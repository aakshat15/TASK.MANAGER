import express from "express" ;
import {  createTaskPage , createTask , fetchTask , fetchTaskById , fetchTaskEdit , updateTaskDetalis , taskDelete} from "../controller/task.controller.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/create-task", auth ,createTaskPage);
router.post("/create-task", auth ,createTask);
router.get("/all-task" , auth , fetchTask);
router.get("/load-task/:priorityId" , auth , fetchTaskById);

//UPDATE
router.get("/taskEdit/:priorityId" , fetchTaskEdit);
router.post("/updateTask/:priorityId" , updateTaskDetalis)

//DELETE
router.get("/taskDelete/:priorityId" , taskDelete);

export default router;