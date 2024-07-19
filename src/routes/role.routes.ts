import express from "express";
import { addRole, roleList, roleUpdate } from "../controller/role.controllers";
const roleRouter = express.Router();

roleRouter.post('/add', addRole);
roleRouter.get('/list', roleList);
roleRouter.put('/update', roleUpdate);

export default roleRouter;