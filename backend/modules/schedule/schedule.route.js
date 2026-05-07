import Router from 'express'
import { generateSchedule } from './schedule.controller.js'
import { generateAISchema } from './schedule.validation.js'
import { authentication } from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
const scheduleRouter = Router()

scheduleRouter.post('/ai',authentication,validation(generateAISchema),generateSchedule)

export default scheduleRouter