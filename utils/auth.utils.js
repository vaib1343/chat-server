const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports={
    getHashPassword: async (password)=>{
        try{
            const salt = await bcryptjs.genSalt();
            return  bcryptjs.hash(password,salt);
        }catch(err){
            throw new Error(err);
        }
    },
    verifyPassword:async (password,HashPassword)=>{
        try{
            return  bcryptjs.compare(password,HashPassword)
        }catch(err){
            throw new Error(err);
        }
    },
    generateToken:(email)=>{
        return jwt.sign({email},process.env.SECRET_TOKEN);
    }       
}