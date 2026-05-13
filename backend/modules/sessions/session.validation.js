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

export const createSessionSchema=joi.object({
  body:joi.object({
    name:joi.string().required().messages({
      "string.empty":"Please Provide a Session Name."
    }),
     taskId:joi.string().required().messages({
      "string.empty":"Task ID must be provided"
    }),
    startTime:joi.string().required().messages({
      "date.empty":"Start Time must be provided"
    }),
    endTime:joi.string().required().messages({
      "date.empty":"End Time must be Provided"
    })

  })
})

export const checkAvailableSessionsSchema=joi.object({
  query:joi.object({
    dueDate:joi.date().required().messages({
      "date.empty":"Please provide the Due Date"
    }),
    totalHours:joi.number().min(1).required().messages({
      "number.empty":"Total Hours Are Required"
    }),
     studyHours:joi.number().min(1).required().messages({
      "number.empty":"Please provide your study hours per day"
    }),
    subjectId:joi.string().required().messages({
      "string.empty":"Subject ID must be provided."
    }),    
  })
})
export const createScheduleSchema=joi.object({
  body:joi.object({
    task:joi.object({
      name:joi.string().required().messages({
        "string.empty":"Please provide a name for your Task"
      }),
      subjectId:joi.string().required().messages({
      "string.empty":"Subject ID must be provided."
    }),
      totalHours:joi.number().min(1).required().messages({
      "number.empty":"Total Hours Are Required"
    }),
     dueDate:joi.date().required().messages({
      "date.empty":"Please provide the Due Date"
    }),
    priority: joi.string().valid("low", "medium", "high").required(),
        
    }),
    sessions:joi.array().items(
      joi.object({
       name:joi.string().required().messages({
        "string.empty":"Please provide a name for your Session"
      }),
        startTime: joi.date().required().messages({
          "date.empty":"Please provide a Start Time for your session"
        }),
          endTime: joi.date().required().messages({
            "date.empty":"Please provide a End Time for your session."
          }),
        subjectId:joi.string().required().messages({
      "string.empty":"Subject ID must be provided."
      }),
      }).min(1).required().messages({
      "array.empty":"Please add a Session.",
      })
    )
  })
})
export const deleteSessionSchema=joi.object({
  params:joi.object({
    sessionId:joi.string().required().messages({
      'string.empty':"Please provide the session."
    })
  })
})
