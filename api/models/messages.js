const mongoose=require("mongoose")
const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    messageType:{
        type:String,
        enum:['image','text']
    },
    message:String,
    imageUrl:String,
    timeStamp:{
        type:Date,
        default:Date.now()
    }
})

const Messages=mongoose.model("Messages",messageSchema)
module.exports=Messages