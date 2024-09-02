import { FlatList, StyleSheet, Text, View, Button, Modal, Pressable, TextInput} from 'react-native';
import { useState, useEffect, createRef } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {UserContext, useUser} from "../lib/context.js"
import { styles } from "../lib/styles.js"
import EventDialogue from "../components/eventdialogue.js"
import Event from "../components/event.js"
import Schedule from "../components/schedule.js"

export default function ScheduleScreen({navigation, route}) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [date, setDate] = useState(new Date())
    const [data, setData] = useState({})
    const [events, setEvents] = useState([])
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(true)
    const dialogueRef = createRef()
    const user = useUser();
    function handleDatePicker() {
        setIsDatePickerVisible(!isDatePickerVisible);
    };
    function handleConfirm(date) {
        handleDatePicker();
    };
    const [newName, setNewName] = useState('')

    useEffect(() => {
        async function getSchedules()
        {
            var data = await supabase
              .rpc('get_schedule_events', {input_schedule_id:route.params.schedule_id})
            var newEvents = []

            setEvents(data.data)
        }
        getSchedules()
    },
    []);
    function handleModal(){
        setIsModalVisible(true)
        dialogueRef.current.handleModal()
    }
    function createNewEvent()
    {
    }
    function save()
    {}

    function getValues(data)
    {
        var newEvent = {
            event_name:data.name,
            event_start_time:data.start_time,
            event_end_time:data.end_time,
            event_start_location:data.start_location,
            event_end_location:data.end_location,
            username: data.username,
            event_schedule_id: route.params.schedule_id,
            event_id: data.id
        }
        var newEvents = [...events]
        newEvents.push(newEvent)
        setEvents(newEvents)
    }

  return (
          <View>
            <FlatList data = {events}
            renderItem = {(i) =>
                 {
                    return <Event values={i.item} navigation={navigation} schedule_id = {route.params.schedule_id}/>
                 }
                }/>
            <EventDialogue valuesCallback = {getValues} ref = {dialogueRef} isVisible={isModalVisible} username= {user.username.data.user.email} schedule_id = {route.params.schedule_id}/>
          <Button title="Create New Event" onPress={handleModal} />
          </View>
  );
}