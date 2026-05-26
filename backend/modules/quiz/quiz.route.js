import Router from 'express';
import { generateQuizController } from './quiz.controller.js';
import { authentication } from '../../middleware/auth.js';
import { validation } from '../../middleware/validation.js';
import { generateQuizSchema } from './quiz.validation.js';
import multer from 'multer';

const quizRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

quizRouter.post("/", upload.single("file"), validation(generateQuizSchema), authentication, generateQuizController);

export default quizRouter;