import Router from 'express'
import { generateSessions,createSession } from './session.controller.js'
import { generateAISchema,createSessionSchema,checkAvailableSessionsSchema,createScheduleSchema } from './session.validation.js'
import { authentication } from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
import { checkAvailableSessions,createSchedule,getSchedule,editSession,moveSession } from './session.controller.js'
const sessionRouter = Router()

sessionRouter.post('/ai',authentication,validation(generateAISchema),generateSessions)
sessionRouter.post('/',authentication,validation(createSessionSchema),createSession)
sessionRouter.get('/availability',authentication,validation(checkAvailableSessionsSchema),checkAvailableSessions)
sessionRouter.post('/schedule',authentication,validation(createScheduleSchema),createSchedule)
sessionRouter.post('/move',authentication,moveSession)
sessionRouter.get('/',authentication,getSchedule)
sessionRouter.patch('/',authentication,editSession)

export default sessionRouter