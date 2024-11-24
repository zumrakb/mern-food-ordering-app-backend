import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

/* middleware: this function check authorization error, bearer token */
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { authorization } = req.headers;

  //bearer fjkldffgdj. space is important.
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
