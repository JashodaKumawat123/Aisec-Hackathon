import React, {useState, useEffect} from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Main from './src/screens/Main';
import Login from './src/screens/Login';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function HomeScreen({setToken}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
      <Button
        title="Logout"
        onPress={async () => {
          await AsyncStorage.removeItem('token');
          setToken(null);
        }}
      />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

function TestScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Test!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthenticatedStack({setToken}) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" options={{headerShown: false}}>
        {props => <HomeScreen {...props} setToken={setToken} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Test" component={Main} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    try {
      getToken();
    } catch (e) {
      getToken();
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <Stack.Screen
            name="AuthenticatedRoutes"
            options={{headerShown: false}}>
            {props => <AuthenticatedStack {...props} setToken={setToken} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {props => <Login {...props} setToken={setToken} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
