const AllowedOrigin = require('../configOptions/allowedOrigin.js')

const credentials =(req,res,next)=>{
    const origin = req.headers.origin
    if(AllowedOrigin.includes(origin)){
        res.headers('Access-Control-Allow-Credentials',true)
    }
    next()
}

module.exports = credentials