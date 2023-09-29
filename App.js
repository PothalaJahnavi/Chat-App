import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import { UserContext,userType } from './UserContext';
import FriendRequests from './screens/FriendRequests';
import Chat from './screens/Chat';
import ChatMessages from './screens/ChatMessages';

const Stack=createNativeStackNavigator()
export default function App() {
  return (
    <UserContext>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='login' component={Login} options={{headerShown:false}}/>
        <Stack.Screen name='register' component={Register} options={{headerShown:false}}/>
        <Stack.Screen name='home' component={Home} />
        <Stack.Screen name='friends' component={FriendRequests} />
        <Stack.Screen name='chats' component={Chat} />
        <Stack.Screen name='Messages' component={ChatMessages} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
