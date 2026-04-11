import joi from "joi";
import { generalRules } from "../../utils/generalRules/index.js";

export const updateProfileSchema = joi.object({
    body:joi.object({
    fullName: joi.string().min(3).pattern(/^[A-Za-z\s]+$/),
    location: joi.string(),
    gender: joi.string().valid('male', 'female', 'other'),
    bio: joi.string(),
    gpa: joi.number().min(0).max(4).messages({
        "number.min": "GPA cannot be less than 0",
        "number.max": "GPA cannot be more than 4"
    })
    })
   
});

export const shareProfileSchema = joi.object({
    id: generalRules.id.required()
});
