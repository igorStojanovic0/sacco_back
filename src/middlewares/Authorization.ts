import { NextFunction, Request, Response } from "express";
import { ValidateToken } from "../utils/password.utils";

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await ValidateToken(req);
    if (validate) {
        next();
    } else {
        return res.json({ message: "User not authenticated" })
    }

}