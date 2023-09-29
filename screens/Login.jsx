import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
const Login = () => {
    const navigation=useNavigation()
    const [email,setEmail]=useState('')
    const [password,setpassword]=useState('')
    
      const handleLogin=async()=>{
      const user={
        email:email,
        password:password
      }
      await axios.post('http://10.5.4.118:8000/login',user).then((response)=>{
            const token=response.data.token
            AsyncStorage.setItem('authToken',token)
            navigation.navigate('home')
      }).catch((err)=>{
        Alert.alert("Login Unsuccessfull")
      })

      }

useEffect(()=>{
   const checkLoginStatus=async()=>{
    try{
      const token=await AsyncStorage.getItem('authToken')
      if(token)
      navigation.navigate('home')
     }
    catch(err){
      console.log(err)
    }
  }
   checkLoginStatus()
},[])

      return (
    <SafeAreaView>
    <View style={{alignItems:"center",padding:10}}>
      <KeyboardAvoidingView>
       <View>
       <Text style={{padding:10,fontSize:30,fontWeight:600,marginTop:100,color:'#451952'}}>Login To Your Account</Text>
       </View>
       <View>
        <TextInput placeholder='Email' name="email" value={email} style={styles.input}onChangeText={(text)=>setEmail(text)}/>
       </View>
       <View>
        <TextInput placeholder='Password' name="password" value={password}  style={styles.input} onChangeText={(text)=>setpassword(text)}/>
       </View>
       <View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={{color:"white",fontSize:20,fontWeight:600}}>Login</Text>
        </TouchableOpacity>
       </View>
       <View style={{display:"flex",flexDirection:'row',margin:35}}>
        <Text style={{textAlign:'center',fontSize:15}}>Don't Have An Account?</Text>
        <Pressable onPress={()=>navigation.navigate("register")}>
        <Text style={{textAlign:'center',marginLeft:10,fontSize:15,fontWeight:500,color:'#451952'}}>Register</Text>
        </Pressable>
       </View>
      </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

const styles=StyleSheet.create({
    input:{
        borderBottomColor:"grey",
        borderBottomWidth:1,
        padding:5,
        margin:10,
    },
    button:{
      margin:10,
      width:"95%",
      padding:10,
      backgroundColor:"#451952",
      textAlign:'center',
      alignItems:'center'
    }
})
export default Login