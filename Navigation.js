import { FlatList, StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { useState, useEffect, createContext } from "react";
import { callAffiliateApi } from "./lib/context.js";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen.js";
import {UserProvider, useUser} from "./lib/context.js"


export default function Navigation({props}) {

    const Tab = createBottomTabNavigator();
    const user = useUser()
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)

    const getUser = async ()=>{
    }

    useEffect(() => {
        getUser()
    },
    []);
  return (
    <UserProvider value={''}>
        <NavigationContainer >
            <Tab.Navigator>
              <Tab.Screen name="Scheduling" component={HomeScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    </UserProvider>
  );
}