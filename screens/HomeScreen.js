import { FlatList, StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { useEffect } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SchedulesScreen from "./SchedulesScreen.js"
import ScheduleScreen from "./ScheduleScreen.js"

export default function HomeScreen() {
    const Stack = createNativeStackNavigator();

  return (
          <Stack.Navigator>
            <Stack.Screen name="Schedules" component={SchedulesScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
          </Stack.Navigator>
  );
}