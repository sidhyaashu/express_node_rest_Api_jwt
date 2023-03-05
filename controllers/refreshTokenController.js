const userDB ={
    users:require('../model/user.json'),
    setUser:function(data){this.users = data}
}

const jwt = require('jsonwebtoken')
require('dotenv').config()

const handRefressToken =  (req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    const refressToken = cookies.jwt

    const foundUser = userDB.users.find(person=>person.refressToken === refressToken)
    if(!foundUser) return res.sendStatus(403) //forbidden

    //evaluate jwt
    jwt.verify(
        refressToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403)
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo":
                    {"username":decoded.username,"roles":roles}
                },
                process.env.ACCES_TOKEN_SECRET,
                { expiresIn:'30s' }
            )
            res.json({accessToken})
        }
    )
       
}

module.exports = {handRefressToken}