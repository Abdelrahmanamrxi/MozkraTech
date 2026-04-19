import joi from 'joi'
import { generalRules } from '../../utils/generalRules/index.js';




export const addFriendSchema=joi.object({
  body:joi.object({
    receiverId:joi.string().required().messages({
      "string.empty":"Please provide a Receiver Id"
    })
  })  ,

})
export const acceptFriendSchema=joi.object({
    body:joi.object({
        senderId:joi.string().required().messages({
      "string.empty":"Please provide a senderId"
    }),
   
    })
})

export const rejectFriendSchema=joi.object({
    body:joi.object({
        senderId:joi.string().required().messages({
      "string.empty":"Please provide a Sender Id"
    }),
     
    })
})



export const shareProfileSchema = joi.object({
    id: generalRules.id.required()
});