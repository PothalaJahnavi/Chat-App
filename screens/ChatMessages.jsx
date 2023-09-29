import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { userType } from "../UserContext";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from '@expo/vector-icons';
const ChatMessages = () => {
  const [showEmoji, setEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [receiverData, setReceiverData] = useState("");
  const { userId } = useContext(userType);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedMessages,setSelectedMessages]=useState([])
  const route = useRoute();
  const { receiver } = route.params;
  const navigation = useNavigation();

  const fetchMessages = async () => {
    try {
      await axios
        .get(`http://10.5.4.118:8000/messages/${userId}/${receiver}`)
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            setAllMessages(response.data);
          } else {
            console.log("error fetching messages");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSend = async (messageType, imageUrl) => {
    const formData = new FormData();
    formData.append("senderId", userId);
    formData.append("receiverId", receiver);
    if (messageType == "image") {
      formData.append("messageType", "image");
      formData.append("imageFile", {
        uri: imageUrl,
        name: "image.jpg",
        type: "image/jpeg",
      });
    } else {
      formData.append("messageType", "text");
      formData.append("message", message);
    }
    await axios
      .post("http://10.5.4.118:8000/messages", formData)
      .then((response) => {
        if (response.data) {
          setMessage("");
          fetchMessages();
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleSend("image", result.uri);
    }
  };

const handleSelectedMessages=async(message)=>{
 
  const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }

}
const handleDelete=async()=>{
  await axios.post('http://10.5.4.118:8000/deleteMessages',{selectedMessages}).then((response)=>{
    if(response.data){
      Alert.alert("Messages deleted Successfully")
      setSelectedMessages([])
       fetchMessages()
    }
    else{
      console.log('error')
    }
  }).catch((err)=>{
    console.log(err)
  })
}

  useEffect(() => {
    const fetchReceiverData = async () => {
      axios
        .get(`http://10.5.4.118:8000/user/${receiver}`)
        .then((response) => {
          if (response.data) {
            setReceiverData(response.data);
          } else {
            console.log("Receiver data error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchReceiverData();
  }, []);
  useEffect(() => {
    fetchMessages();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        selectedMessages.length>0?
          (
           <View style={{display:'flex',flexDirection:'row',gap:10}}>
            <AntDesign name="arrowleft" size={24} color="black" onPress={()=>navigation.goBack()}/>
           <Text style={{fontWeight:700,fontSize:18}}>{selectedMessages.length}</Text>
           </View>
          )
          :
        (
          <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: "grey",
              borderRadius: 50,
            }}
          ></View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {receiverData?.name}
          </Text>
        </View>
        )
        
       
      ),
      headerRight: () => selectedMessages.length>0?<>
      <AntDesign name="delete" size={24} color="black" onPress={handleDelete}/>
      </>:<></>,
    });
  }, [receiverData,selectedMessages]);

  const formatTime = (time) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
    };

    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <KeyboardAvoidingView style={{ backgroundColor: "#f0f0f0", flex: 1 }}>
      <ScrollView>
        {allMessages &&
          allMessages.map((item, index) => {
            const isSelected=selectedMessages.includes(item._id)
            if (item.messageType === "text") {
              return (
                <Pressable
                onLongPress={()=>handleSelectedMessages(item)}
                  key={item.index}
                  style={[
                    item.senderId._id === userId
                      ? {
                          alignSelf: "flex-end",
                          padding: 7,
                          backgroundColor: "#dcf8c6",
                          maxWidth: "60%",
                          borderRadius: 10,
                          margin: 10,
                        }
                      : {
                          alignSelf: "flex-start",
                          padding: 5,
                          backgroundColor: "white",
                          maxWidth: "60%",
                          borderRadius: 10,
                          margin: 10,
                        },
                        isSelected&&{
                          backgroundColor:'#D2E0FB',
                          width:'100%'
                        }
                  ]}
                >
                  <Text style={{ fontSize: 20, textAlign: "left" }}>
                    {item.message}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "grey", textAlign: "right" }}
                  >
                    {formatTime(item.timeStamp)}
                  </Text>
                </Pressable>
              );
            }
            if (item.messageType === "image") {
              const baseUrl = "../api/files/";
              const imageUrl = item.imageUrl;
              const filename = imageUrl.split(/[\\/]/).pop();
              const source = { uri: baseUrl + filename };
              return (
                <Pressable
                  onLongPress={() => handleSelectedMessages(item)}
                  key={item.index}
                  style={[
                    item.senderId._id === userId
                      ? {
                          alignSelf: "flex-end",
                          padding: 7,
                          backgroundColor: "#dcf8c6",
                          maxWidth: "60%",
                          borderRadius: 10,
                          margin: 10,
                        }
                      : {
                          alignSelf: "flex-start",
                          padding: 5,
                          backgroundColor: "white",
                          maxWidth: "60%",
                          borderRadius: 10,
                          margin: 10,
                        },
                  ]}
                >
                  <View>
                    <Image
                      source={source}
                      style={{ width: 200, height: 200, borderRadius: 7 }}
                    />
                  </View>
                  <Text style={{ fontSize: 12, color: "grey", textAlign: "right" }}>
                    {formatTime(item.timeStamp)}
                  </Text>
                </Pressable>
              );
            }
            
          })}
      </ScrollView>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingVertical: 10,
          alignItems: "center",
          borderTopWidth: 1,
          borderColor: "#dddddd",
        }}
      >
        <Entypo
          name="emoji-happy"
          size={24}
          color="grey"
          onPress={() => setEmoji(!showEmoji)}
        />
        <TextInput
          value={message}
          placeholder="Type Your Message"
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            borderColor: "#dddddd",
            marginHorizontal: 5,
          }}
          onChangeText={(text) => setMessage(text)}
        />
        <Ionicons
          name="camera"
          size={24}
          color="grey"
          onPress={() => imagePicker()}
        />
        <MaterialIcons name="keyboard-voice" size={24} color="grey" />
        <Pressable
          style={{
            backgroundColor: "#191D88",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 10,
          }}
          onPress={() => handleSend("text", "")}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </Pressable>
      </View>

      {showEmoji && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessages;
