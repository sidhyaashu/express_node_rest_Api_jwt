const userDB ={
    users:require('../model/user.json'),
    setUser:function(data){this.users = data}
}

const fsPromises = require('fs').promises
const path = require('path')


const handleLogout = async (req,res)=>{
    //on client also delete the token

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) //no content
    const refressToken = cookies.jwt

    // is refresh token in db
    const foundUser = userDB.users.find(person=>person.refressToken === refressToken)
    if(!foundUser) {
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
        return res.sendStatus(204)
    } //forbidden

    //delete token
    const otherUser =userDB.users.filter(person=> person.refressToken !== foundUser.refressToken)
    const currentUser = {...foundUser,refressToken:''}
    userDB.setUser([...otherUser,currentUser])

    await fsPromises.writeFile(
        path.join(__dirname,'..','model','user.json'),
        JSON.stringify(userDB.users)
    )

    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true}) // secure:true -only serve on https
    res.sendStatus(204)
       
}

module.exports = {handleLogout}