const admin = (req,res,next)=>{
    console.log("USER is",req.user.role);
    if(req.user.role != "admin"){
        return res.status(403).json({
            message:"Access Denied"
        })
    }
    next();
}

module.exports = admin;