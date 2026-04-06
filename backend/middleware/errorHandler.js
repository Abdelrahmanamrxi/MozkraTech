
const errorHandler=(err,req,res,next)=>{
    console.error(err)

    const statusCode=err.statusCode? err.statusCode: 500
    const message=err.message? err.message: "Internal Server Error"

    res.status(statusCode).json({
       success:false,
       message:message,
       status:statusCode
    })

}
export default errorHandler