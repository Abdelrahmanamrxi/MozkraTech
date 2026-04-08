export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        fn(req, res, next).catch((error) => {
            // return res.status(500).json({message: "error", message: error.message, stack:error.stack, error});
            next(error);
        })
    }
}

export const  globalErrorHandling = (err, req, res, next) => {
        return res.status(500).json({message: "error", message: err.message, stack:err.stack, error: err});};