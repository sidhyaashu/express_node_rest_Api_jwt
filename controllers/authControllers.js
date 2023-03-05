const userDB ={
    users:require('../model/user.json'),
    setUser:function(data){this.users = data}
}
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req,res)=>{
    const {user,pwd} = req.body
    if(!user||!pwd) return res.status(400).json({"message":"username and password required"})
    const foundUser = userDB.users.find(person=>person.username === user)
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
        const refressToken = jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        )


        //saving refresh token 
        const otherUser=userDB.users.filter(person=>person.username !== foundUser.username)
        const currentUser = {...foundUser,refressToken}
        userDB.setUser([...otherUser,currentUser])
        await fsPromises.writeFile(
            path.join(__dirname,'..','model','user.json'),
            JSON.stringify(userDB.users)
        )

        res.cookie('jwt',refressToken,{ httpOnly:true, maxAge:24*60*60*1000, sameSite:'None',secure:true })
        res.json({accessToken})
    }else{
        res.status(400).json({"message":"Invalid credintials"})
    }
}

module.exports = {handleLogin}