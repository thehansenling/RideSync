import { StyleSheet, View, Pressable, Modal, Linking, Platform} from 'react-native';
import {Button, Text, Input, Card, ListItem} from 'react-native-elements'
import { useState, useEffect, createRef } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"
import EventDialogue from "./eventdialogue.js"
import {UserContext, useUser} from "../lib/context.js"
export default function Event({navigation, values, showContact}) {
    const [name, setName] = useState(values.event_name)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(true)

    const [startTime, setStartTime] = useState(values.event_start_time)
    const [startLocation, setStartLocation] = useState(values.event_start_location)
    const [endTime, setEndTime] = useState(values.event_end_time)
    const [endLocation, setEndLocation] = useState(values.event_end_location)
    const dialogueRef = createRef()

    const user = useUser()
      function handleDatePicker() {
        setIsDatePickerVisible(!isDatePickerVisible);
      };

  function handleConfirm(date) {
    handleDatePicker();
  };

    function handleModal(){
        dialogueRef.current.handleModal()
    }

    function contact(){
         var message = "test"
         const operator = Platform.select({ios: '&', android: '?'});
         Linking.openURL('sms:' + values.event_phone_number + operator +'?body=' + message);
    }


    function getValues(data)
    {
        setName(data.name)
        setStartTime(data.start_time)
        setEndTime(data.end_time)
        setStartLocation(data.start_location)
        setEndLocation(data.end_location)
    }
  return (
          <ListItem>
          <Pressable style = {{width:"100%"}}>
            <EventDialogue data = {values} valuesCallback = {getValues} ref = {dialogueRef} isVisible={isModalVisible} username= {user.username.data.user.email} schedule_id = {values.schedule_id}/>
            <Text style={{fontSize:20}}>{name}</Text>
            <View style={{flexDirection:"row", flex:1}}>
                <View style={{flex:1}}>
                    <Text>{startLocation}</Text>
                    <Text>{startTime}</Text>
                    <Text>{endLocation}</Text>
                    <Text>{endTime}</Text>
                </View>
                {showContact ? <Button style={{flex:1}} title="Contact" onPress = {contact}/> : <Button style={{flex:1}} title="Edit" onPress = {handleModal}/> }

            </View>

          </Pressable>
          </ListItem>
  );
}