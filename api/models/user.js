const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        }
    ],
    friendRequests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        }
    ],
    FriendRequestsSent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        }
    ]
})

const Users = mongoose.model('Users', userSchema);

module.exports = Users;