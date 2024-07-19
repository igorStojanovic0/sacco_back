import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import asyncWrapper from "../middlewares/AsyncWrapper";
import GroupModel from '../model/group.model';
import RoleModel from '../model/role.model';
import UserModel from '../model/user.model';
import UserGroupModel from '../model/user_group';
import RoleUserModel from '../model/user_role';
import { ValidateToken } from "../utils/password.utils";
export const addGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const isTokenValid = await ValidateToken(req);

    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };

    const existingGroup = await GroupModel.findOne({ name: req.body.name });
    if (existingGroup) {
        return res.status(400).json({ message: "Group already exists" });
    };

    const newGroup = await GroupModel.create(req.body);

    if (newGroup) {
        const ManagerRole = await RoleModel.findOne({ role_name: "GroupManager"})
        const UserRole = await RoleModel.findOne({ role_name: "GroupUser"})
    
        const newManager = await UserGroupModel.create({
            user_id: req?.body?.created_by,
            group_id: newGroup?._id,
            role_id: ManagerRole?.id
        })

        if(newManager) {
            req?.body?.selectedUsers_Id?.forEach(async (user_id: string) => {
                await UserGroupModel.create({
                    user_id: user_id,
                    group_id: newGroup?._id,
                    role_id: UserRole?.id
                })
                
            })
        }

        await RoleUserModel.create({
            user_id: req?.body?.created_by,
            role_id: ManagerRole?.id
        })

        req?.body?.selectedUsers_Id?.forEach(async (user_id: string) => {
            await RoleUserModel.create({
            user_id: user_id,
            role_id: UserRole?.id
            })
        })

        res.status(201).json({ message: "newRole added successfully", group: newGroup });
    };

});


export const getGroupList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const allGroupList = await GroupModel.find({ del_flag: 0 })
    
    res.status(201).json({ message: "successfully", allGroupList: allGroupList });

});

export const getJoinedGroupList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
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

            const result = await UserGroupModel.aggregate([
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
                        from: 'groups', // Collection name in MongoDB
                        localField: 'group_id',
                        foreignField: '_id',
                        as: 'groupDetails'
                    }
                },
                {
                    $unwind: '$groupDetails'
                },
                {
                    $project: {
                        group_id: '$group_id',
                        role_name: '$roleDetails.role_name',
                        group_name: '$groupDetails.name',
                        group_type: '$groupDetails.group_type',
                        group_state: '$groupDetails.group_state',
                        group_avatar: '$groupDetails.group_avatar',
                        description: '$groupDetails.description',
                        tags: '$groupDetails.tags',
                        created_by: '$groupDetails.created_by',
                        del_flag: '$groupDetails.del_flag',
                        createdAt: '$groupDetails.createdAt',
                        updatedAt: '$groupDetails.updatedAt'
                    }
                }
            ]);
            res.status(201).json({ message: "successfully", joinedGroupList: result });
            
        } catch (err) {
            throw err;
        }
    } else {
        return res.status(400).json({ message: "Failed" });
    }
    

});

export const joinGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

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