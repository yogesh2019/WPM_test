const User = require("../models/userModels");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req,res,next) =>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                err: "authorization header not found"
            })
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({
                err: "token not found"
            })
        }
        const decoded = jwt.verify(token, "SECRET MESSAGE");
        const user = await User.findOne(
            {
                where: {id: decoded.user.id}
            }
        )
        if(!user){
            return res.status(404).json({err: "user not found"});
        }
        req.user = user;    
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
module.exports = isAuthenticated;