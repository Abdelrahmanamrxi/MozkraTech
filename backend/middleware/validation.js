
// export const validation = (schema) => {
//     return (req, res, next) => {
//         let validationResult = [];
//         for (const key of Object.keys(schema)) {
//             const validationError = schema[key].validate(req[key]);
//             if (validationError?.error) {
//                 validationResult.push(validationError.error.details);
//             }
//         }
//         if (validationResult.length > 0) {
//             console.log(validationResult);
            
//             return next(new Error("validation error"));
//             // return res.status(400).json({ message: "validation error", errors: validationResult });
//         }
//         next();
//     }
// }
import HttpException from "../utils/HttpException.js";

export const validation = (schema) => {
    return (req, res, next) => {
        const resultObj = { ...req.body, ...req.params, ...req.query };
        const result = schema.validate(resultObj);
        if(result?.error) {
            console.log(result.error)
            return next(new HttpException("Validation Error"),400);
            // return res.status(400).json({ message: "validation error", errors: result.error.details });
        }
        next();
    }
}