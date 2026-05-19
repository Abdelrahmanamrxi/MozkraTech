import joi from 'joi'

export const createTaskSchema=joi.object({
    body:joi.object({
        name:joi.string().required().messages({
            "string.empty":"Please provide a name for your task."
        }),
        subjectId:joi.string().required().messages({
            "string.empty":"Please provide your subjectID for your task."
        }),
        totalHours:joi.number().min(1).required().messages({
            "number.min":"Minimum for Total Hours is 1"
        }),
        priority: joi.string().valid("low", "medium", "high").required(),
        dueDate:joi.date().required().messages({
            "date.empty":"Please provide a due date."
        })

    })
})

export const updateTaskSchema=joi.object({
    params:joi.object({
        taskId:joi.string().required().messages({
            "string.empty":"Task ID is required"
        })
    }),
    body:joi.object({
        name:joi.string().optional(),
        subjectId:joi.string().optional(),
        totalHours:joi.number().min(1).optional(),
        priority: joi.string().valid("low", "medium", "high").optional(),
        dueDate:joi.date().optional()
    })
})

export const deleteTaskSchema=joi.object({
    params:joi.object({
        taskId:joi.string().required().messages({
            "string.empty":"Task ID is required"
        })
    })
})

export const confirmTaskSchema=joi.object({
    params:joi.object({
        taskId:joi.string().required().messages({
            "string.empty":"Task ID is required"
        })
    })
})