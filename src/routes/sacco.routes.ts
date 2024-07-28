import express from "express";
import { addSacco, getJoinedSaccoList, getSaccoList, getSaccoUserList, joinSacco } from "../controller/sacco.controllers";
const saccoRouter = express.Router();

saccoRouter.post('/add', addSacco);
saccoRouter.get('/list', getSaccoList);
saccoRouter.get('/findByUserId', getJoinedSaccoList);
saccoRouter.post('/join', joinSacco);
saccoRouter.get('/findBySaccoId', getSaccoUserList);
// saccoRouter.put('/update', roleUpdate);

export default saccoRouter;