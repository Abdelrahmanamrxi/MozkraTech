import joi from "joi";
import { generalRules } from "../../utils/generalRules/index.js";

export const updateProfileSchema = joi.object({
  body: joi.object({
    fullName: joi
      .string()
      .min(3)
      .pattern(/^[A-Za-z\s]+$/),
    location: joi.string(),
    gender: joi.string().valid("male", "female", "other"),
    bio: joi.string(),
    gpa: joi.number().min(0).max(4).messages({
      "number.min": "GPA cannot be less than 0",
      "number.max": "GPA cannot be more than 4",
    }),
  }),
});

export const updateStudyPreferencesSchema = joi.object({
  body: joi
    .object({
      sessionDuration: joi.number().integer().min(15).max(240),
      breakDuration: joi.number().integer().min(5).max(60),
      preferredTime: joi
        .string()
        .valid("morning", "afternoon", "evening", "night"),
      weeklyGoalHours: joi.number().integer().min(1).max(100),
      weeklyStudyHours: joi.number().integer().min(0),
    })
    .min(1),
});

export const addFriendSchema = joi
  .object({
    body: joi.object({}),

    params: joi.object({
      userId: generalRules.id.required(),
    }),
    query: joi.object({}),
  })
  .required();

export const getProfileByIDSchema = joi.object({
  params: joi.object({
    id: generalRules.id.required(),
  }),
});

export const searchForUsersSchema = joi.object({
  query: joi.object({
    name: joi.string().required().messages({
      "string.empty": "Name cannot be Empty",
    }),
    page: joi.string().required().messages({
      "string.empty": "Please provide a page number",
    }),
    limit: joi.number().required().messages({
      "string.empty": "Please provide a limit number",
    }),
  }),
  body: joi.object({}),
  params: joi.object({}),
});
