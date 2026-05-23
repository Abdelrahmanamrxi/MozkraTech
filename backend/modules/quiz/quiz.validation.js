import joi from 'joi';

export const generateQuizSchema = joi.object({
    body: joi.object({
        questionType: joi.string().required().valid('MCQ', 'True_False', 'Mixed'),
        difficultyLevel: joi.string().required().valid('easy', 'medium', 'hard'),
        numberOfQuestions: joi.number().integer().min(1).max(50).required(),
        timeOption: joi.string().required().valid('user_defined', 'ai_defined'),
        userDuration: joi.number().integer().min(1).max(60).optional().allow('', null)
    }).required(),

    query: joi.object().optional(),
    params: joi.object().optional()
});