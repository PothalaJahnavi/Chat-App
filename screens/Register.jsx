import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import axios from 'axios'
const Register = () => {
    const navigation=useNavigation()
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setpassword]=useState('')

    const handleRegister=async()=>{
      if(name==""||email==""||password==""){
        Alert.alert("All Fields are required")
        return;
      }
      const user={
        name:name,
        email:email,
        password:password,
      }
       await axios.post('http://10.5.4.118:8000/register',user).then((response)=>{
        Alert.alert("Registration successfull")
        setName('')
        setEmail('')
        setpassword('')
       }).catch((err)=>{
        console.log(err)
        Alert.alert("Registration Unsuccessful")
       })
      }
  return (
    <SafeAreaView>
            <View style={{alignItems:"center",padding:10}}>
       <KeyboardAvoidingView>
       <View>
       <Text style={{padding:10,fontSize:30,fontWeight:600,marginTop:100,color:'#451952',textAlign:'center'}}>Register For Your Account</Text>
       </View>
       <View>
        <TextInput placeholder='Name' name="name" value={name} style={styles.input} onChangeText={(text)=>setName(text)} />
       </View>
       <View>
        <TextInput placeholder='Email' name="email" value={email} style={styles.input} onChangeText={(text)=>setEmail(text)}/>
       </View>
       <View>
        <TextInput secureTextEntry={true} placeholder='Password' name="password" value={password} style={styles.input} onChangeText={(text)=>setpassword(text)}/>
       </View>
       <View>
       <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={{color:"white",fontSize:20,fontWeight:600}}>Register</Text>
        </TouchableOpacity>
       </View>
       <View style={{display:"flex",flexDirection:'row',margin:35}}>
        <Text style={{textAlign:'center',fontSize:15}}>Already Have An Account?</Text>
        <Pressable onPress={()=>navigation.navigate("login")}>
        <Text style={{textAlign:'center',marginLeft:10,fontSize:15,fontWeight:500,color:'#451952'}}>Login</Text>
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
export default Register