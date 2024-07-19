import { NextFunction, Request, Response } from "express";
import asyncWrapper from "../middlewares/AsyncWrapper";
import RoleModel from "../model/role.model";

export const addRole = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // const isTokenValid = await ValidateToken(req);
    // if (!isTokenValid) {
    //     return res.status(400).json({ message: "Access denied" });
    // };
    const newRole = await RoleModel.create(req.body);

    if (newRole) {
        res.status(201).json({ message: "newRole added successfully", role: newRole });
    };

});


export const roleList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});


export const roleUpdate = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});

export const deleteRole = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});
