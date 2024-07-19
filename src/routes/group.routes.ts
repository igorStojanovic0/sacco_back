import express from "express";
import { addGroup, getGroupList, getJoinedGroupList, joinGroup } from "../controller/group.controllers";
const roleRouter = express.Router();

roleRouter.post('/add', addGroup);
roleRouter.get('/list', getGroupList);
roleRouter.get('/findByUserId', getJoinedGroupList);
roleRouter.post('/join', joinGroup);
// roleRouter.put('/update', roleUpdate);

export default roleRouter;