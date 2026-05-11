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