import Router from 'express'
import { generateSessions,createSession } from './session.controller.js'
import { generateAISchema,createSessionSchema,checkAvailableSessionsSchema,createScheduleSchema } from './session.validation.js'
import { authentication } from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
import { checkAvailableSessions,createSchedule } from './session.controller.js'
const sessionRouter = Router()

sessionRouter.post('/ai',authentication,validation(generateAISchema),generateSessions)
sessionRouter.post('/',authentication,validation(createSessionSchema),createSession)
sessionRouter.get('/availability',authentication,validation(checkAvailableSessionsSchema),checkAvailableSessions)
sessionRouter.post('/schedule',authentication,validation(createScheduleSchema),createSchedule)

export default sessionRouter