import joi from "joi"



export const generateAISchema=joi.object({
    body:joi.object({
    weeklyDescription:joi.string().max(600).trim().min(100).required().messages({
        "string.max":"Weekly Description can't exceed 600 characters",
        "string.empty":"Weekly Description cannot be empty for AI response.",
        "string.min":"Weekly Description cannot be empty for AI response."
      }),

    subjects:joi.array().items( 
    joi.object({
    subjectId: joi.string().required(),
    name: joi.string().required(),
    difficulty: joi.string().valid("hard", "medium", "easy").required(),
    interestLevel: joi.number().min(1).max(5).required(),
    subjectType: joi.string().valid("theoretical", "practical").required(),
    hoursPerWeek: joi.number().min(1).required(),
  })).required().messages({
        "array.base": "Subjects must be an array.",
        "array.empty": "Subjects cannot be empty.",
      }),

  userPreferences:joi.object({
     userPreferredTime: joi.string()
    .valid("morning", "afternoon", "evening", "night")
    .required(),
  weeklyGoalHours: joi.number().min(1).required(),
  timer: joi.object({
    sessionDuration: joi.number().min(1).required(),
    breakDuration: joi.number().min(1).required(),
  }).required(),
  })
    })
})