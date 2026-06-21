import joi from "joi";
import { generalRules } from "../../utils/generalRules/index.js";

export const generateQuizSchema = joi.object({
  body: joi
    .object({
      questionType: joi.string().required().valid("MCQ", "True_False", "Mixed"),
      difficultyLevel: joi.string().required().valid("easy", "medium", "hard"),
      numberOfQuestions: joi.number().integer().min(1).max(30).required().messages({
        "number.max": "Number of questions must be between 1 and 30.",
      }),
      timeOption: joi.string().required().valid("user_defined", "ai_defined"),
      userDuration: joi
        .number()
        .integer()
        .min(1)
        .max(60)
        .optional()
        .allow("", null),
    })
    .required(),

  query: joi.object().optional(),
  params: joi.object().optional(),
});

export const quizIdSchema = joi.object({
  params: joi.object({
    quizId: generalRules.id.required(),
  }),
});

export const submitQuizSchema = joi.object({
  params: joi.object({
    quizId: generalRules.id.required(),
  }),
  body: joi
    .object({
      score: joi.number().integer().min(0).required(),
      percentage: joi.number().min(0).max(100).required(),
      completedAt: joi.date().required(),
      userAnswers: joi.array().items(
        joi.object({
          questionNumber: joi.number().integer().min(1).required(),
          selectedAnswer: joi.number().integer().min(0).allow(null).required(),
          isCorrect: joi.boolean().required(),
        }),
      ),
    })
    .required(),
});
