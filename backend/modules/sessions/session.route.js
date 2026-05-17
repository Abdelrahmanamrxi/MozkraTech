import Router from 'express'
import { generateSessions,createSession, updateSession } from './session.controller.js'
import { generateAISchema,createSessionSchema,checkAvailableSessionsSchema,createScheduleSchema,deleteSessionSchema, updateSessionSchema } from './session.validation.js'
import { authentication } from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
import { checkAvailableSessions,createSchedule,getSchedule,editSession,moveSession,deleteSession,getSessions } from './session.controller.js'
const sessionRouter = Router()

sessionRouter.post('/ai',authentication,validation(generateAISchema),generateSessions)
sessionRouter.post('/',authentication,validation(createSessionSchema),createSession)
sessionRouter.get('/availability',authentication,validation(checkAvailableSessionsSchema),checkAvailableSessions)
sessionRouter.post('/schedule',authentication,validation(createScheduleSchema),createSchedule)
sessionRouter.post('/move',authentication,moveSession)
sessionRouter.get('/schedule',authentication,getSchedule)
sessionRouter.get('/',authentication,getSessions)
sessionRouter.patch('/',authentication,editSession)
sessionRouter.delete('/:sessionId', authentication, validation(deleteSessionSchema), deleteSession)
sessionRouter.post('/update-session', authentication, validation(updateSessionSchema), updateSession);

export default sessionRouter