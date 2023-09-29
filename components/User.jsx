import { View, Text, Pressable,Image, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useContext ,useState} from 'react'
import { userType } from '../UserContext'
import axios from 'axios'

const User = ({item,fetchUsers}) => {

    const {userId}=useContext(userType)
    const [requests,setRequests]=useState([])
    const [friends,setFriends]=useState([])
    const fetchRequests=async()=>{
      await axios.get(`http://10.5.4.118:8000/friend-requests/sent/${userId}`).then((response)=>{
        if(response.data){
            setRequests(response.data)
        }
        else{
            console.log("error")
        }
      }).catch((err)=>{
        console.log(err)
      })
      }
      const fetchFriends=async()=>{
        await axios.get(`http://10.5.4.118:8000/friends/${userId}`).then((response)=>{
            if(response.data){
                setFriends(response.data)
            }
            else{
                console.log("error")
            }
          }).catch((err)=>{
            console.log(err)
          })
    }
  useEffect(()=>{
      fetchRequests()
  },[])

  useEffect(()=>{
    fetchFriends()
  },[])
    const sendRequest=async(sender,receiver)=>{

               await axios.post('http://10.5.4.118:8000/friend-request',{
                sender:sender,
                receiver:receiver
               }).then((response)=>{
                if(response){
                    Alert.alert("Request Sent")
                   }
                   else{
                    Alert.alert("Failed To send")
                   }
               }).catch((err)=>{
                console.log(err)

               })
               fetchFriends();
               fetchRequests();
    }

  return (
    <Pressable style={{display:"flex",flexDirection:"row",alignItems:"center",marginVertical:10}} >
        <View>
            {
                item.image!=""?<Image source={item.image}></Image>:
                <View style={{width:50,height:50,backgroundColor:"grey",borderRadius:50}}></View>

            }
        </View>
        <View style={{marginLeft:15,flex:1}}>
        <Text style={{fontSize:15,fontWeight:600}} >{item.name}</Text>
        <Text >{item.email}</Text>
        </View>
        <View style={{marginRight:10}} >
             {
                friends.includes(item._id)&&<Pressable style={{backgroundColor:'#D7E5CA',borderRadius:10,padding:10}} onPress={()=>sendRequest(userId,item._id)}>
                <Text style={{fontSize:15,fontWeight:600}}>Friend</Text>
            </Pressable>
            }
            {
                requests.includes(item._id)&&
                <Pressable style={{backgroundColor:'#D2E0FB',borderRadius:10,padding:10}} onPress={()=>sendRequest(userId,item._id)}>
                <Text style={{fontSize:15,fontWeight:600}}>Requested</Text>
            </Pressable>
            }
            {
                ( !requests.includes(item._id)&& !friends.includes(item._id))&&
               <Pressable style={{backgroundColor:'orange',borderRadius:10,padding:10}} onPress={()=>sendRequest(userId,item._id)}>
               <Text style={{fontSize:15,fontWeight:600}}>Add Friend</Text>
           </Pressable>
            }
           
        </View>
    </Pressable>
  )
}

export default User