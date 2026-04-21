import joi from "joi";
import { generalRules } from "../../utils/generalRules/index.js";

export const createSubjectSchema = joi.object({
  body: joi.object({
    name: joi.string().trim().required().messages({
      "string.empty": "Subject name cannot be empty",
      "any.required": "Please provide a name for this subject",
    }),
    difficulty: joi.string().trim().required().messages({
      "any.required": "Choose a difficulty level to continue",
    }),
    interestLevel: joi.number().integer().min(1).max(5).required().messages({
      "number.min": "Interest level must be at least 1",
      "number.max": "Interest level cannot exceed 5",
      "any.required": "Please rate your interest level",
    }),
    subjectType: joi
      .string()
      .valid("theoretical", "practical")
      .required()
      .messages({
        "any.only": "Subject type must be either theoretical or practical",
        "any.required": "Please select a subject type",
      }),
    hoursPerWeek: joi.number().integer().min(1).required().messages({
      "number.min": "Hours per week must be at least 1",
      "any.required": "Please provide hours per week",
    }),
  }),
});

export const deleteSubjectSchema = joi.object({
  params: joi.object({
    subjectId: generalRules.id.required(),
  }),
  body: joi.object({}),
  query: joi.object({}),
});
