import { View, Text, Pressable,Alert } from 'react-native'
import React, { useContext } from 'react'
import { userType } from '../UserContext'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'


const Friends = ({item,friends,setFriends}) => {

    const {userId}=useContext(userType)
    const navigation=useNavigation()
    const acceptRequest=async(sender,receiver)=>{
        await axios.post('http://10.5.4.118:8000/friend-request/accept',{
                sender:sender,
                receiver:receiver
               }).then((response)=>{
                if(response){
                    Alert.alert("Request Accepted")
                    setFriends(friends.filter((friend)=>friend._id!=receiver))
                    navigation.navigate('chats')
                   }
                   else{
                    Alert.alert("Failed To Accept")
                   }
               }).catch((err)=>{
                console.log(err)
               })
    }
  return (
    <Pressable style={{display:"flex",flexDirection:"row",alignItems:"center",marginVertical:10}} >
    <View>
            <View style={{width:50,height:50,backgroundColor:"grey",borderRadius:50}}></View>
    </View>
    <View style={{marginLeft:15,flex:1}}>
    <Text style={{fontSize:15,fontWeight:600}} >{item.name} Sent You a Friend Request!!</Text>
    </View>
    <View style={{marginRight:10}} >
        <Pressable style={{backgroundColor:'#0066b2',borderRadius:10,padding:10}} onPress={()=>acceptRequest(userId,item._id)}>
            <Text style={{fontSize:15,fontWeight:600,color:'white',}}>Accept</Text>
        </Pressable>
    </View>
</Pressable>
  )
}

export default Friends