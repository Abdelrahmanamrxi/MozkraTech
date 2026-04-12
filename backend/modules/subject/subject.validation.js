import joi from "joi";

export const createSubjectSchema = joi.object({
  body: joi.object({
    name: joi.string().trim().required(),
    difficulty: joi.string().trim().required(),
    interestLevel: joi.number().integer().min(1).max(5).required(),
    subjectType: joi.string().valid("theoretical", "practical").required(),
  }),
});
