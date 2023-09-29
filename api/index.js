const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const passport=require("passport")
const bodyParser=require("body-parser")
const localStrategy=require("passport-local").Strategy
const jwt=require("jsonwebtoken")
const Users = require('./models/user');
const Messages=require('./models/messages')
const multer=require('multer')
const app=express()
const port=8000

const url='mongodb+srv://Jahnavi:Jahnavi@cluster0.scacz24.mongodb.net/Chat?retryWrites=true&w=majority'

app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())


mongoose.connect(url).then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err)
})

app.listen(port,()=>{
    console.log(`App is running on port ${port}`)
})

const createToken=(userId)=>{
    const payload={userId:userId}
    const token=jwt.sign(payload,'jahnavi',{expiresIn:'1hr'})
    return token
}

app.post('/register',(req,res)=>{
    const {name,email,password,image}=req.body
    const newUser=new Users({name,email,password,image})
    newUser.save().then(()=>{
        res.status(200).json({message:"user Registered Successsfullly"})
    }).catch((err)=>{
        console.log(err)
        res.status(500).json({message:'Error in registering Users'})
    })
})

app.post("/login",(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        return res.status(404).json({message:'Fill All Details'})
    }
    Users.findOne({email}).then((user)=>{
        if(!user)
        {return res.status(404).json({message:'User Not Found'})}
        if(user.password!=password)
        {return res.status(404).json({message:'Password is incorrect'})}
        const token=createToken(user._id)
        return res.status(200).json({token})
        
    }).catch((err)=>{
        console.log(err)
        return res.status(500).json({message:'Internal Server error'})
    })
})

app.get("/users/:userId",(req,res)=>{
    const loggedInId=req.params.userId
    Users.find({_id:{$ne:loggedInId}}).then((users)=>{
             res.status(200).json(users)
    }).catch((err)=>{
        res.status(500).json({message:'Error Retrieving Users'})
    })
})

app.post("/friend-request",async(req,res)=>{
    const sender=req.body.sender
    const receiver=req.body.receiver
   try{
      await Users.findByIdAndUpdate(sender,{
        $push:{FriendRequestsSent:receiver}
      })
      await Users.findByIdAndUpdate(receiver,{
        $push:{friendRequests:sender}
      })
    //   console.log("js")
      res.status(200).json({message:"Request Sent"})
   }
   catch(error){
   console.log(error)
   }

})

app.post("/friend-requests/:userId",async(req,res)=>{
    const userId=req.params.userId
    try{
       const users=await Users.findById(userId).populate('friendRequests').lean()
       res.status(200).json(users.friendRequests)
    
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server Error"})
    }
   
})

app.post("/friend-request/accept",async(req,res)=>{
    const sender=req.body.sender
    const receiver=req.body.receiver
    try{
        await Users.findByIdAndUpdate(sender,{
          $push:{friends:receiver}
        })
        await Users.findByIdAndUpdate(receiver,{
          $push:{friends:sender}
        })
        await Users.findByIdAndUpdate(sender,{
            $pull:{FriendRequestsSent:receiver}
          })
          await Users.findByIdAndUpdate(receiver,{
            $pull:{friendRequests:sender}
          })

        res.status(200).json({message:"Request Accepted"})
     }
     catch(error){
     console.log(error)
     }
  

})

app.get("/accepted-friends/:userId",async(req,res)=>{
    try{
       const userId=req.params.userId
       const user=await Users.findById(userId).populate('friends')
       res.status(200).json(user.friends)
    }
    catch(error){
        console.log(error)
       res.status(500).json({message:'Internal Server Error'})
    }
})

app.get('/user/:userId',async(req,res)=>{
    const {userId}=req.params
    try{
        const user=await Users.findById(userId)
        res.status(200).json(user)
    }
    catch(error){
        res.status(500).json({message:'Internal Server Error'})
    }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
  
  const upload = multer({ storage: storage })

  // ... (other imports and setup)

app.post('/messages', upload.single('imageFile'), async (req, res) => {
    try {
      const { senderId, receiverId, messageType, message } = req.body;
      const newMessage = new Messages({
        senderId,
        receiverId,
        messageType,
        message,
        timeStamp: new Date(),
        imageUrl: messageType === 'image' ? req.file.path : null,
      });
      await newMessage.save();
      res.status(200).json({ message: 'Message sent Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

app.get('/messages/:sender/:receiver',async(req,res)=>{
    try{
      const {sender,receiver}=req.params
      const messages=await Messages.find({
        $or:[
            {senderId:sender,receiverId:receiver},
            {senderId:receiver,receiverId:sender}
        ]
      }).populate('senderId','_id name')
      res.status(200).json(messages)
    }
    catch(error){
        res.status(200).json({message:'Internal server Error'})
    }
})

app.post("/deleteMessages",async(req,res)=>{
  const messages=req.body.selectedMessages
  console.log('messages',messages)
  try{
    if(!Array.isArray(messages)||messages.length==0){
      res.status(400).json({message:'No messages to delete'})
    }
    else{
         await Messages.deleteMany({_id:{$in:messages}})
         res.status(200).json({message:'Messages Deleted Successfully'})
    }
  }
  catch(err){
    console.log(err)
    res.status(500).json({message:'Internal Server Error'})
  }
})

app.get("/friend-requests/sent/:id",async(req,res)=>{
  const userId=req.params.id
  try{
  const user=await Users.findById(userId).populate('FriendRequestsSent')
  const requestIds=user.FriendRequestsSent.map((friend)=>friend._id)
  res.status(200).json(requestIds)
}
catch(error){
  console.log(error)
  res.status(500).json({message:'Internal Server Error'})
}
})
app.get("/friends/:id",async(req,res)=>{
  const userId=req.params.id

  try{
    const user=await Users.findById(userId).populate('friends')
    const friendIds=user.friends.map((friend)=>friend._id)
    res.status(200).json(friendIds)
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:'Internal Server Error'})
  }
})