import rateLimit from 'express-rate-limit'
const limiter=rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:"Too many requests, try again later.",
    statusCode:429,
       skip: (req, res) => {
        return (
            req.method === "GET" &&
            req.originalUrl === "/api/v1/notifications/unread-count"
        )
    }
})
export default limiter