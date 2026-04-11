import joi from 'joi'


export const searchFriendSchema=joi.object({
    query:joi.object({
        name:joi.string().required().messages({
            "string.empty":"Name cannot be Empty"
        }),
        page:joi.string().required().messages({
             "string.empty":"Please provide a page number"
        }),
        limit:joi.number().required().messages({
            "string.empty":"Please provide a limit number"
        })
    }),
    body:joi.object({}),
    params:joi.object({})
})