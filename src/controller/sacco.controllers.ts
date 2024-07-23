import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import asyncWrapper from "../middlewares/AsyncWrapper";
import RoleModel from '../model/role.model';
import SaccoModel from '../model/sacco.model';
import UserModel from '../model/user.model';
import UserGroupModel from '../model/user_group';
import RoleUserModel from '../model/user_role';
import UserSaccoModel from '../model/user_sacco';
import { ValidateToken } from "../utils/password.utils";
export const addSacco = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const isTokenValid = await ValidateToken(req);

    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };

    const existingGroup = await SaccoModel.findOne({ name: req.body.name });
    if (existingGroup) {
        return res.status(400).json({ message: "Group already exists" });
    };

    const newSacco = await SaccoModel.create(req.body);

    if (newSacco) {
        const ManagerRole = await RoleModel.findOne({ role_name: "SaccoManager"})
    
        await UserSaccoModel.create({
            user_id: req?.body?.created_by,
            group_id: req?.body?.group_id,
            sacco_id: newSacco?._id,
            role_id: ManagerRole?.id,
            approved: 1
        })

        await RoleUserModel.create({
            user_id: req?.body?.created_by,
            role_id: ManagerRole?.id
        })

        res.status(201).json({ message: "newSacco added successfully", sacco: newSacco });
    };

});


export const getSaccoList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    const { group_id } = req?.query
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const allSaccoList = await SaccoModel.find({ del_flag: 0 })
    
    res.status(201).json({ message: "successfully", allSaccoList: allSaccoList });

});

export const getJoinedSaccoList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }
    const existingUser = await UserModel.findOne({ email: req.user?.email });

    if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
    }

    const userId = existingUser?.id
    // const { userId } = req.query
    
    if (userId) {
        try {

            if (typeof userId !== 'string' || !mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid userId: must be a valid ObjectId string');
            }

            const result = await UserSaccoModel.aggregate([
                {
                    $match: { user_id: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: 'roles', // collection name in MongoDB (should match the name in your MongoDB)
                        localField: 'role_id',
                        foreignField: '_id',
                        as: 'roleDetails'
                    }
                },
                {
                    $unwind: '$roleDetails'
                },
                {
                    $lookup: {
                        from: 'saccos', // Collection name in MongoDB
                        localField: 'sacco_id',
                        foreignField: '_id',
                        as: 'saccoDetails'
                    }
                },
                {
                    $unwind: '$saccoDetails'
                },
                {
                    $project: {
                        _id: '$sacco_id',
                        approved: '$approved',
                        sacco_id: '$sacco_id',
                        group_id: '$group_id',
                        role_name: '$roleDetails.role_name',
                        name: '$saccoDetails.name',
                        entranceFee: {
                            adults: '$saccoDetails.adults',
                            children: '$saccoDetails.children',
                            teens:'$saccoDetails.teens',
                            friend: '$saccoDetails.friend',
                        },
                        shares: {
                            initialNumber: '$saccoDetails.initialNumber',
                            nominalPrice: '$saccoDetails.nominalPrice',
                            maxInitial:'$saccoDetails.maxInitial',
                        },
                        saving: {
                            minimumAmount: '$saccoDetails.minimumAmount',
                            lumpSum: '$saccoDetails.lumpSum',
                        },
                        notificationStatus: '$saccoDetails.notificationStatus',
                        loanType: '$saccoDetails.loanType',
                        priorityOfLoan: '$saccoDetails.priorityOfLoan',
                        traningProgram: '$saccoDetails.traningProgram',
                        role: {
                            admin: '$saccoDetails.admin',
                            treasurer: '$saccoDetails.treasurer',
                            secretary: '$saccoDetails.secretary',
                        },
                        approval: {
                            maker: '$saccoDetails.maker',
                            checker: '$saccoDetails.checker',
                            approver: '$saccoDetails.approver',
                        },
                        created_by: '$saccoDetails.created_by',
                    }
                }
            ]);
            res.status(201).json({ message: "successfully", joinedSaccoList: result });
            
        } catch (err) {
            throw err;
        }
    } else {
        return res.status(400).json({ message: "Failed" });
    }
    

});

export const joinSacco = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const isTokenValid = await ValidateToken(req);
    

    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };
    

    const existingGroup = await UserGroupModel.findOne({ user_id: req.body.user_id, group_id: req.body.group_id });
    
    if (existingGroup) {
        return res.status(400).json({ message: "You have already joined!" });
    } else {
        const Role = await RoleModel.findOne({ role_name: "GroupUser"})

        const newJoinGroup = await UserGroupModel.create({
            user_id: req?.body?.user_id,
            group_id: req?.body?.group_id,
            role_id: Role?._id
        });

        if (newJoinGroup) {
            const existingRole = await RoleUserModel.findOne({user_id: req.body.user_id, role_id: Role?._id})
            
            if(!existingRole) {
                await RoleUserModel.create({
                    user_id: req?.body?.user_id,
                    role_id: Role?.id
                })
            }
            
            res.status(201).json({ message: "newRole added successfully", group: newJoinGroup });
        };
    }

    

});

export const groupUpdate = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});

export const deleteGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});