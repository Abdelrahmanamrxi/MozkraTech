import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { createTaskSchema } from "./task.validation.js";
import { createTask } from "./task.controller.js";
const taskRouter=Router()

taskRouter.post('/',authentication,validation(createTaskSchema),createTask)

export default taskRouter