import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import asyncWrapper from "../middlewares/AsyncWrapper";
const GroupChatRoom = require('../models/user/interchange/chat/GroupChatRoomModel'); // Adjust the path to your GroupChatRoom model


export const getGroupChatRoomsWithUserDetails = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
    
    const groupId = req?.query?.groupId
    
    try {
        const results = await GroupChatRoom.aggregate([
            {
                $match: { groupId : new mongoose.Types.ObjectId(groupId as string) }
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

        res.status(201).json({ message: "successfully", groupChatMsg: results });

        
      } catch (err) {
          console.error(err);
          throw new Error('Error fetching group chat rooms with user details');
      }

});
