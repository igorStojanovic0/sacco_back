import express from "express";
import { addSacco, getJoinedSaccoList, getSaccoList, joinSacco } from "../controller/sacco.controllers";
const roleRouter = express.Router();

roleRouter.post('/add', addSacco);
roleRouter.get('/list', getSaccoList);
roleRouter.get('/findByUserId', getJoinedSaccoList);
roleRouter.post('/join', joinSacco);
// roleRouter.put('/update', roleUpdate);

export default roleRouter;