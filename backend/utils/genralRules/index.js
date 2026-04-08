import { Types } from 'mongoose';
import joi from 'joi';


export const customId = (value, helper) => {
    let data = Types.ObjectId.isValid(value);
    return data? value : helper.message("invalid id");
}


export const generalRules = {
    id: joi.string().custom(customId),

    headers:  joi.object({
        authorization: joi.string().required(),
        'cache-control': joi.string().required(),
        'postman-token': joi.string().required(),
        'content-type': joi.string().required(),
        'content-length': joi.string().required(),
        host: joi.string().required(),
        'user-agent': joi.string().required(),
        accept: joi.string().required(),
        'accept-encoding': joi.string().required(),
        connection: joi.string().required(),
    })
}