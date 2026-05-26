import Router from 'express';
import { deleteQuizById, generateQuizController, getAllQuizzes, getQuizById, submitQuiz } from './quiz.controller.js';
import { authentication } from '../../middleware/auth.js';
import { validation } from '../../middleware/validation.js';
import { generateQuizSchema, quizIdSchema, submitQuizSchema } from './quiz.validation.js';
import multer from 'multer';

const quizRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

quizRouter.post("/", upload.single("file"), validation(generateQuizSchema), authentication, generateQuizController);
quizRouter.get("/all", authentication, getAllQuizzes);
quizRouter.get("/get/:quizId", authentication, validation(quizIdSchema), getQuizById);
quizRouter.delete("/delete/:quizId", authentication, validation(quizIdSchema), deleteQuizById);
quizRouter.post("/submit/:quizId", authentication, validation(submitQuizSchema), submitQuiz);

export default quizRouter;