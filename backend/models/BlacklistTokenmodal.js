//Mongoose
const mongoose=require('mongoose');

const BlacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        require:true,
        unique:true,
    },

    blacklistAt:{
        type:Date,
        default:Date.now,
    },

    expiresAt:{
        type:Date,
        required:true,
    },
});

BlacklistTokenSchema.index({expiresAt:1},{expireAfterSeconds:0});
const blacklisttoken=mongoose.model('blacklisttoken',BlacklistTokenSchema);
module.exports=blacklisttoken;