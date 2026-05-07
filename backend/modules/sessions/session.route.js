import Router from 'express'
import { generateSessions } from './session.controller.js'
import { generateAISchema } from './session.validation.js'
import { authentication } from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
const sessionRouter = Router()

sessionRouter.post('/ai',authentication,validation(generateAISchema),generateSessions)

export default sessionRouter