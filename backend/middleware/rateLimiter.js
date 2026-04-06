import rateLimit from 'express-rate-limit'
const limiter=rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:"Too many requests, try again later.",
    statusCode:429
})
export default limiter