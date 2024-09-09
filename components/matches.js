import { StyleSheet, Text, View, Pressable, Modal, TextInput, Button, FlatList, Linking, Platform} from 'react-native';
import { useState, useEffect, createRef } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"
import EventDialogue from "./eventdialogue.js"
import {UserContext, useUser} from "../lib/context.js"
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import Match from "../components/match.js"
export default function Matches({navigation, events, event_name}) {

    function contact(){
        var phone_numbers = ''
        for (index in events)
        {
            var event = events[index]
            phone_numbers += event.event_phone_number
            if (index < events.length-1)
            {
                phone_numbers += ','
            }
        }
        console.log(phone_numbers)
         var message = "test"
         const operator = Platform.select({ios: '&', android: '?'});
         Linking.openURL('sms:' + phone_numbers + operator +'?body=' + message);
    }

  return (
    <CollapsibleView title={event_name}>
        <FlatList data = {events}
        renderItem = {(i) =>
             {
                console.log(i.item)
                return <Match values={i.item} navigation={navigation}/>
             }
            }

        />
        {events.length ? <Button style={{flex:1}} title="Contact All" onPress = {contact}/> :<View/>}
    </CollapsibleView>
  );
}