import { View, Text,Pressable,Image } from 'react-native'
import React, { useContext,useState,useEffect } from 'react'
import { userType } from '../UserContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const UserChat = ({item}) => {
    const {userId}=useContext(userType)
    const receiver=item._id
    const navigation=useNavigation()
    const [allMessages,setAllMessages]=useState([])
    const [lastMessage,setLastMessage]=useState('')
    const fetchMessages = async () => {
        try {
          await axios
            .get(`http://10.5.4.118:8000/messages/${userId}/${receiver}`)
            .then((response) => {
              if (response.data) {
                setAllMessages(response.data);
              } else {
                console.log("error fetching messages");
              }
            });
        } catch (error) {
          console.log(error);
        }
        const n=allMessages.length
        console.log(n)
        setLastMessage(allMessages[n-1])
      };
      const formatTime = (time) => {
        const options = {
          hour: "numeric",
          minute: "numeric",
        };
    
        return new Date(time).toLocaleString("en-US", options);
      };
    useEffect(() => {
        fetchMessages();
        console.log(lastMessage)
      }, []);
  return (
    <Pressable style={{padding:10,borderBottomWidth:1,borderBlockColor:'grey'}} onPress={()=>navigation.navigate('Messages',{
        receiver:item._id
    })}>
        <View style={{display:'flex',flexDirection:'row',padding:10}}>
<View style={{marginRight:10}}>
{
item.image!=""?<Image source={item.image}></Image>:
<View style={{width:50,height:50,backgroundColor:"grey",borderRadius:50}}></View>

}
</View>
<View style={{flex:1}}>
<Text style={{fontWeight:'bold'}}>{item.name}</Text>
{lastMessage?.messageType==='text'&&<Text style={{color:"grey",marginTop:10}}>{lastMessage.message}</Text>
}
</View>
<View>
{lastMessage?.timeStamp&&<Text >{formatTime(lastMessage?.timeStamp)}
  </Text>}
</View>
</View>
</Pressable>
  )
}

export default UserChat