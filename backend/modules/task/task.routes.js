import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { createTaskSchema, updateTaskSchema, deleteTaskSchema, confirmTaskSchema } from "./task.validation.js";
import { createTask, getTasks, updateTask, deleteTask, confirmTask } from "./task.controller.js";

const taskRouter=Router()

taskRouter.post('/',authentication,validation(createTaskSchema),createTask)
taskRouter.get('/',authentication,getTasks)
taskRouter.patch('/:taskId',authentication,validation(updateTaskSchema),updateTask)
taskRouter.delete('/:taskId',authentication,validation(deleteTaskSchema),deleteTask)
taskRouter.post('/:taskId/confirm',authentication,validation(confirmTaskSchema),confirmTask)

export default taskRouter