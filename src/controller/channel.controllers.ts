import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import asyncWrapper from "../middlewares/AsyncWrapper";
import GroupChannelModel from '../model/groupChannel.model';
import RoleModel from '../model/role.model';
import UserModel from '../model/user.model';
import UserGroupModel from '../model/user_group';
import UserGroupChannelModel from '../model/user_groupChannel';
import RoleUserModel from '../model/user_role';
import { ValidateToken } from "../utils/password.utils";

export const addGroupChannel = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const isTokenValid = await ValidateToken(req);

    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };

    const existingGroupChannel = await GroupChannelModel.findOne({ name: req.body.name });
    if (existingGroupChannel) {
        return res.status(400).json({ message: "Channel already exists" });
    };

    const newGroupChannel = await GroupChannelModel.create(req.body);

    if (newGroupChannel) {
        const ManagerRole = await RoleModel.findOne({ role_name: "ChannelManager"})
        const UserRole = await RoleModel.findOne({ role_name: "ChannelUser"})
    
        const newManager = await UserGroupChannelModel.create({
            user_id: req?.body?.created_by,
            group_id: req?.body?.group_id,
            channel_id: newGroupChannel?._id,
            role_id: ManagerRole?._id
        })

        if(newManager) {
            req?.body?.selectedUsers_Id?.forEach(async (user_id: string) => {
                await UserGroupChannelModel.create({
                    user_id: user_id,
                    group_id: req?.body?.group_id,
                    channel_id: newGroupChannel?._id,
                    role_id: UserRole?._id
                })
                
            })
        }

        await RoleUserModel.create({
            user_id: req?.body?.created_by,
            role_id: ManagerRole?._id
        })

        req?.body?.selectedUsers_Id?.forEach(async (user_id: string) => {
            await RoleUserModel.create({
            user_id: user_id,
            role_id: UserRole?._id
            })
        })

        res.status(201).json({ message: "newRole added successfully", groupChannel: newGroupChannel });
    };

});


export const getGroupChannelList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const { groupId } = req?.query

    const groupChannelList = await GroupChannelModel.find({ del_flag: 0, group_id: groupId })
    
    res.status(201).json({ message: "successfully", groupChannelList: groupChannelList });

});

export const getJoinedGroupChannelList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
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

            const result = await UserGroupChannelModel.aggregate([
                {
                    $match: { user_id: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: 'groupchannels', // Collection name in MongoDB
                        localField: 'channel_id',
                        foreignField: '_id',
                        as: 'channelDetails'
                    }
                },
                {
                    $unwind: '$channelDetails'
                },
                {
                    $project: {
                        _id: '$channelDetails._id',
                        group_id: '$channelDetails.group_id',
                        name: '$channelDetails.name',
                        channel_avatar: '$channelDetails.channel_avatar',
                        created_by: '$channelDetails.created_by',
                        del_flag: '$channelDetails.del_flag',
                        createdAt: '$channelDetails.createdAt',
                        updatedAt: '$channelDetails.updatedAt'
                    }
                }
            ]);
            res.status(201).json({ message: "successfully", joinedGroupChannelList: result });
            
        } catch (err) {
            throw err;
        }
    } else {
        return res.status(400).json({ message: "Failed" });
    }
    

});

export const joinGroupChannel = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

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