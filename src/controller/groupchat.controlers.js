const mongoose = require('mongoose');
const GroupChatRoom = require('../models/user/interchange/chat/GroupChatRoomModel'); // Adjust the path to your GroupChatRoom model

export const getGroupChatRoomsWithUserDetails = async (req, res) => {
    const groupId = req.body.groupId

    try {
        const results = await GroupChatRoom.aggregate([
            {
                $match: { groupId: new mongoose.Types.ObjectId(groupId) }
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
};