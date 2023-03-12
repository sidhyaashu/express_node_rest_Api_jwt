const User = require('../model/UserM.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const handleLogin = async (req,res)=>{
    const {user,pwd} = req.body
    if(!user||!pwd) return res.status(400).json({"message":"username and password required"})
    const foundUser = await User.findOne({username:user}).exec()
    if(!foundUser) return res.status(401).json({"message":"User not found"})
    const matchPass = await bcrypt.compare(pwd,foundUser.password)

    if(matchPass){
        const roles = Object.values(foundUser.roles)
        //JWT
        const accessToken = jwt.sign(
            {
                "UserInfo":
                {"username":foundUser.username,"roles":roles},
            },
            process.env.ACCES_TOKEN_SECRET,
            {expiresIn:'60s'}
        )
        const refreshToken = jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        )


        //saving refresh token 
        foundUser.refreshToken = refreshToken
        await foundUser.save()
        // console.log('auth added refreshToken ---> ',result)

        res.cookie('jwt',refreshToken,{ httpOnly:true, maxAge:24*60*60*1000, sameSite:'None'}) //,secure:true 
        res.json({accessToken})
    }else{
        res.status(400).json({"message":"Invalid credintials"})
    }
}

module.exports = {handleLogin}