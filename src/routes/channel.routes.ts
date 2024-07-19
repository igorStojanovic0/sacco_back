import express from "express";
import { addGroupChannel, getGroupChannelList, getJoinedGroupChannelList, joinGroupChannel } from "../controller/channel.controllers";
const roleRouter = express.Router();

roleRouter.post('/add', addGroupChannel);
roleRouter.get('/list', getGroupChannelList);
roleRouter.get('/findByUserId', getJoinedGroupChannelList);
roleRouter.post('/join', joinGroupChannel);
// roleRouter.put('/update', roleUpdate);

export default roleRouter;