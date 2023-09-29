import { View, Text } from 'react-native'
import React, { useContext, useEffect,useState } from 'react'
import { userType } from '../UserContext'
import axios from 'axios'
import Friends from '../components/Friends'
const FriendRequests = () => {
  const [friends,setFriends]=useState([])
  const {userId}=useContext(userType)
  useEffect(()=>{
  const fetchFriendRequests=async()=>{
    await axios.post(`http://10.5.4.118:8000/friend-requests/${userId}`).then((response)=>{
      if(response.data)
      setFriends(response.data)
    else
    console.log("error")
    }).catch((error)=>{
      console.log(error)
    })
  }
   fetchFriendRequests()


  },[])
  return (
    <View>
      <Text style={{textAlign:'center',fontWeight:800,fontSize:19,padding:10}}>Friend Requests</Text>
      <View>
        {
          friends&&friends.map((item,index)=>{
            return(
              <Friends key={index} item={item} friends={friends} setFriends={setFriends}/>
            )
          })
        }
      </View>
    </View>
  )
}

export default FriendRequests