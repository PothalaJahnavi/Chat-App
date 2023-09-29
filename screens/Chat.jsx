import { View, Text, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { userType } from '../UserContext'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import UserChat from '../components/UserChat'
const Chat = () => {
    const [myFriends,setMyFriends]=useState([])
   const {userId}=useContext(userType)
   const navigation=useNavigation()


    useEffect(()=>{
      const fetchFriends=async()=>{
         await axios.get(`http://10.5.4.118:8000/accepted-friends/${userId}`).then((response)=>{
            if(response.data){
                setMyFriends(response.data)
            }
            else{
                console.log("error")
            }
         }).catch((error)=>{
            console.log(error)
         })
      }
      fetchFriends()
    },[])
  return (
    <View style={{padding:5}}>
        {
            myFriends&&myFriends.map((item,index)=>{
                return(
                  <UserChat item={item}/>
                )
            })
        }
    </View>
  )
}

export default Chat