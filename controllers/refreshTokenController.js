const userDB ={
    users:require('../model/user.json'),
    setUser:function(data){this.users = data}
}

const jwt = require('jsonwebtoken')
require('dotenv').config()

const handRefressToken =  (req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies.jwt)
    const refressToken = cookies.jwt

    const foundUser = userDB.users.find(person=>person.refressToken === refressToken)
    if(!foundUser) return res.sendStatus(403) //forbidden

    //evaluate jwt
    jwt.verify(
        refressToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403)
            const accessToken = jwt.sign(
                {"username":decoded.username},
                process.env.ACCES_TOKEN_SECRET,
                { expiresIn:'30s' }
            )
            res.json({accessToken})
        }
    )
       
}

module.exports = {handRefressToken}