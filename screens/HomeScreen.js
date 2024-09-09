import { FlatList, StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { useEffect } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SchedulesScreen from "./SchedulesScreen.js"
import ScheduleScreen from "./ScheduleScreen.js"
import MatchScreen from "./MatchScreen.js"

export default function HomeScreen() {
    const Stack = createNativeStackNavigator();

  return (
          <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Schedules" component={SchedulesScreen}/>
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="Match" component={MatchScreen}/>
          </Stack.Navigator>
  );
}