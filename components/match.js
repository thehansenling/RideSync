import { StyleSheet, Text, View, Pressable, Modal, TextInput, Button} from 'react-native';
import { useState, useEffect, createRef } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import EventDialogue from "./eventdialogue.js"
import {UserContext, useUser} from "../lib/context.js"
import Event from "./event.js"
export default function Match({navigation, values}) {
  return (
    <CollapsibleView title={values.event_user_full_name}>
        <Event values={values} navigation={navigation} schedule_id = {values.event_schedule_id} showContact = {true}/>
    </CollapsibleView>
  );
}