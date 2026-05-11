const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode ? err.statusCode : 500;
  let message = err.message ? err.message : "Internal Server Error";

  if (err?.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Profile image must be smaller than 5 MB";
    } else {
      message = "Invalid file upload";
    }
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    status: statusCode,
  });
};
export default errorHandler;
