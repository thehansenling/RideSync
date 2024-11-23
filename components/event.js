import { StyleSheet, View, Pressable, Modal, Linking, Platform} from 'react-native';
import {Button, Text, Input, Card, ListItem} from 'react-native-elements'
import { useState, useEffect, createRef } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"
import EventDialogue from "./eventdialogue.js"
import {UserContext, useUser} from "../lib/context.js"

const day_abbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Event({navigation, values, showContact}) {
    const [name, setName] = useState(values.event_name)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(true)
    const [startTime, setStartTime] = useState(new Date(values.event_start_time))
    const [startLocation, setStartLocation] = useState(values.event_start_location)
    const [endTime, setEndTime] = useState(new Date(values.event_end_time))
    const [endLocation, setEndLocation] = useState(values.event_end_location)

    const [days, setDays] = useState((typeof values.event_days == "object") ? [...values.event_days.sort()] : [...JSON.parse(values.event_days).sort()])

    const [eventData, setEventData] = useState(values)

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
        setDays(data.days)

        setEventData(data)
    }

    var days_string = ""
    for (i in days)
    {
        days_string += day_abbreviations[days[i]] + " "
    }

    var start_hours = "00"
    var start_minutes = "00"
    if (startTime)
    {
        start_hours = startTime.getHours()
        start_minutes = startTime.getMinutes()
        if (start_hours < 10)
        {
            start_hours = "0" + start_hours
        }
        if (start_minutes < 10)
        {
            start_minutes = "0" + start_minutes
        }
    }

    var end_hours = "00"
    var end_minutes = "00"
    if (endTime)
    {
        end_hours = endTime.getHours()
        end_minutes = endTime.getMinutes()
        if (end_hours < 10)
        {
            end_hours = "0" + end_hours
        }
        if (end_minutes < 10)
        {
            end_minutes = "0" + end_minutes
        }
    }

  return (
          <ListItem>
          <Pressable style = {{width:"100%"}}>
            <EventDialogue data = {eventData} valuesCallback = {getValues} ref = {dialogueRef} isVisible={isModalVisible} username= {user} schedule_id = {values.schedule_id}/>
            <Text style={{fontSize:20}}>{name}</Text>
            <View style={{flexDirection:"row", flex:1}}>
                <View style={{flex:1}}>
                    <Text>{startLocation}</Text>
                    <Text>{days_string + start_hours + ":" + start_minutes}</Text>
                    <Text>{endLocation}</Text>
                    <Text>{days_string + end_hours + ":" + end_minutes}</Text>
                </View>
                {showContact ? <Button style={{flex:1}} title="Contact" onPress = {contact}/> : <Button style={{flex:1}} title="Edit" onPress = {handleModal}/> }
            </View>

          </Pressable>
          </ListItem>
  );
}