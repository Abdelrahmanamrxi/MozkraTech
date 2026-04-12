
import HttpException from "../utils/HttpException.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate({
      body: req.body,
      query: req.query,
      params: req.params
    }, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      return next(new HttpException(error.message, 400));
    }

   /*  Object.assign(req.query, value.query );
    Object.assign(req.body, value.body);
    Object.assign(req.params, value.params); */
    
    if (value.query && req.query) Object.assign(req.query, value.query);
    if (value.body && req.body) Object.assign(req.body, value.body);
    if (value.params && req.params) Object.assign(req.params, value.params);

    next();
  };
};