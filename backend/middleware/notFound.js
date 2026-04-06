const notFound=(req,res,next)=>{
    res.status(404).json({message:'Not Found',status:404})
}
export default notFound