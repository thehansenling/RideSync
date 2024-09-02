import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from "react";
import {supabase} from "./lib/supabase.js"
import styles from './lib/styles.js'
import LoginScreen from './screens/LoginScreen.js'
import Navigation from './Navigation.js'
import {UserContext, useUser} from "./lib/context.js"
export default function App() {

    const [session, setSession] = useState(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

    },
    []);

    if (session == null)
    {
        return <LoginScreen />
    }
    else
    {
        return <Navigation props = {session}/>
    }
}