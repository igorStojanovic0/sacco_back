import express from "express";
import { getGroupFriendList, getGroupFriendMsg } from "../controller/groupUserFriend.controlers";
const groupUserFriendRouter = express.Router();

groupUserFriendRouter.get('/findByGroupIdUserId', getGroupFriendList);
groupUserFriendRouter.get('/getFriendMsgbyroomId', getGroupFriendMsg);

export default groupUserFriendRouter;