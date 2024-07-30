import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import asyncWrapper from "../middlewares/AsyncWrapper";
import UserModel from '../model/user.model';
import { isTokenValid } from "../utils/password.utils";

const GroupChatRoom = require('../models/user/interchange/chat/GroupChatRoomModel'); // Adjust the path to your GroupChatRoom model

const UserFriendModel = require('../model/user_friend');

export const getGroupFriendList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
    const authToken = req.get('Authorization');
    
    if (!authToken?.split(' ')[1]) {
        return res.status(401).json({ message: "Access denied!" });
    }
    
    const isValid = await isTokenValid(req);
    if (!isValid) {
        return res.status(401).json({ message: "Access denied!" });
    }

    
    const existingUser = await UserModel.findOne({ email: req.user?.email });

    if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
    }

    const userId = existingUser?.id

    const { groupId } = req?.query

    // if(groupId) {
    //   const groupFriendList = await UserFriendModel.find({ groupId: groupId, userId: userId })

    //     res.status(201).json({ message: "successfully", groupFriendList: groupFriendList });
    // }
    
    try {
        const results = await UserFriendModel.aggregate([
            {
                $match: { groupId : new mongoose.Types.ObjectId(groupId as string),
                          userId: new mongoose.Types.ObjectId(userId as string)
                 }
            },
            {
                $lookup: {
                    from: 'users', // The name of the User collection in MongoDB
                    localField: 'friendId', // Field from GroupChatRoom
                    foreignField: '_id', // Field from User
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            // {
            //     $lookup: {
            //         from: 'user_groups',
            //         localField: 'userId',
            //         foreignField: 'user_id',
            //         as: 'userGroup'
            //     }
            // },
            // {
            //     $unwind: '$userGroup'
            // },
            // {
            //     $lookup: {
            //         from: 'roles',
            //         localField: '$userGroup.role_id',
            //         foreignField: '_id',
            //         as: 'role'
            //     }
            // },
            // {
            //     $unwind: '$role'
            // },
            {
                $project: {
                        _id: '$_id',
                        userId: '$userDetails._id',
                        title: '$userDetails.title',
                        surName: '$userDetails.surName',
                        givenName: '$userDetails.givenName',
                        otherNames: '$userDetails.otherNames',
                        photograph: '$userDetails.photograph',
                        gender: '$userDetails.gender',
                        tribe: '$userDetails.tribe',
                        religion: '$userDetails.religion',
                        placeOfBirth: '$userDetails.placeOfBirth',
                        currentParish: '$userDetails.currentParish',
                        birthday: '$userDetails.birthday',
                        nationalIDNumber: '$userDetails.nationalIDNumber',
                        nationalIDPhoto: '$userDetails.nationalIDPhoto',
                        email: '$userDetails.email',
                        phone: '$userDetails.phone',
                        homeAddress: '$userDetails.homeAddress',
                        homeLocation: '$userDetails.homeLocation',
                        districtOfBirth: '$userDetails.districtOfBirth',
                        birthParish: '$userDetails.birthParish',
                        birthVillage: '$userDetails.birthVillage',
                        birthHome: '$userDetails.birthHome',
                        maritalStatus: '$userDetails.maritalStatus',
                        profession: '$userDetails.profession',
                        placeOfWorkAddress: '$userDetails.placeOfWorkAddress',
                        is_active: '$userDetails.is_active',
                        userID: '$userDetails.userID',
                        del_falg: '$userDetails.del_falg',
                        // role_name: '$role.role_name',
                        friendId: '$friendId',
                        groupId: '$groupId',
                        roomId: '$roomId'
                }
            }
        ]);
        
        res.status(201).json({ message: "successfully", groupFriendList: results });

        
      } catch (err) {
          console.error(err);
          throw new Error('Error fetching group chat rooms with user details');
      }

});

export const getGroupFriendMsg = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { roomId, groupId } = req.body
        
    try {
        const results = await GroupChatRoom.aggregate([
            {
                $match: { roomId : new mongoose.Types.ObjectId(roomId as string),
                          groupId : new mongoose.Types.ObjectId(groupId as string)
                 }
            },
            {
                $lookup: {
                    from: 'users', // The name of the User collection in MongoDB
                    localField: 'creatorId', // Field from GroupChatRoom
                    foreignField: '_id', // Field from User
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    creatorId: '$creatorId',
                    groupId: '$groupId',
                    roomId: '$roomId',
                    content: '$content',
                    created: '$created',
                    surName: '$userDetails.surName',
                    givenName: '$userDetails.givenName',
                    photograph: '$userDetails.photograph'
                }
            }
        ]);

        res.status(201).json({ message: "successfully", groupFriendChatMsg: results });

      } catch (err) {
          console.error(err);
          throw new Error('Error fetching group chat rooms with user details');
      }

});