import express from "express";
import { getGroupChatRoomsWithUserDetails } from "../controller/groupchat.controllers";
const groupChatRouter = express.Router();

groupChatRouter.get('/getMsgbyGroupId', getGroupChatRoomsWithUserDetails);

export default groupChatRouter;