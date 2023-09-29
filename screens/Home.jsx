import { View, Text } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { userType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode'
import axios from 'axios';
import User from '../components/User';
import { MaterialIcons } from '@expo/vector-icons';
const Home = () => {
 const navigation=useNavigation()
 const {userId,setUserId}=useContext(userType)
 const [users,setUsers]=useState([])
 const handleLogout=()=>{
  AsyncStorage.removeItem('authToken')
    navigation.navigate('login')
 }
  useLayoutEffect(()=>{
        navigation.setOptions({
          headerTitle:"",
          headerLeft:()=>(<Text style={{fontWeight:800,fontSize:25}}>Let's Chat</Text>),
          headerRight:()=>(
              <View style={{display:'flex',flexDirection:"row",alignItems:'center',gap:18}}>
                <Entypo onPress={()=>navigation.navigate('chats')} name="chat" size={24} color="black" />
                <Ionicons onPress={()=>navigation.navigate('friends')} name="people" size={24} color="black" />
                <MaterialIcons name="logout" size={24} color="black" onPress={()=>handleLogout()}/>
              </View>
          )
        })
  },[])
  const fetchUsers=async()=>{
    const token=await AsyncStorage.getItem("authToken")
    const decoded=jwt_decode(token)
    const userId=decoded.userId;
    setUserId(userId)
    axios.get(`http://10.5.4.118:8000/users/${userId}`).then((response)=>{
       setUsers(response.data)
    }).catch((err)=>{
      console.log(err)
    })
   }
useEffect(()=>{
   
 fetchUsers()

},[])

  return (
    <SafeAreaView>
      <View>
        {
          users.map((item,index)=>{
            return(
              <User key={index} item={item} fetchUsers={fetchUsers}></User>            )
          })
        }
      </View>
    </SafeAreaView>
  )
}

export default Home