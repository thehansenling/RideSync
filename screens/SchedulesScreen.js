import { Button, FlatList, StyleSheet, Text, View, Modal, Pressable, TextInput} from 'react-native';
import { useState, useEffect, useContext } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"
import {UserContext, useUser} from "../lib/context.js"
import Schedule from "../components/schedule.js"
import 'react-native-get-random-values';
import { v4 as uuid } from "uuid";

export default function SchedulesScreen({navigation}) {
    const [rooms, setRooms] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [newName, setNewName] = useState('')
    const [isLoading, setLoading] = useState(true);

    const user = useUser();
    function handleModal(){
        setIsModalVisible(!isModalVisible)
    }

    useEffect(() => {

        async function getSchedules()
        {
            var data = await supabase
              .rpc('get_user_schedules', {user_name:user.username.data.user.email})
            var data_rooms = []
            for (i in data.data)
            {
                data_rooms.push({name:data.data[i].schedule_name,
                                id:data.data[i].schedule_id,
                                })
            }

            setLoading(false);
            setRooms(data_rooms)
        }
        getSchedules()
    },
    []);

    async function save()
    {
        var newRooms = [...rooms]
        var newId = uuid()
        newRooms.push({name:newName, id: newId})
        setRooms(newRooms)
        try {
            const err = await supabase
              .from('schedules')
              .insert({
                        id: newId,
                        name: newName,
                        username: user.data.user.email
                        })
        }
        catch (err){
            console.log("Error uploading bill items")
            //break
        }
        setNewName('')
        handleModal()

    }

     if (isLoading) {
       return <View><Text>Loading...</Text></View>;
     }

  return (
          <View>
            <FlatList data = {rooms}
            renderItem = {(i) =>
                 {
                      console.log(i)
                      return <Schedule name={i.item.name} schedule_id = {i.item.id} navigation={navigation}/>
                 }
                }/>
            <Button title = "Create New Schedule" onPress={handleModal}/>
                          <Modal visible={isModalVisible} transparent={true}>

                            <Pressable onPress = {handleModal} style = {styles.modalContainer}>
                                <Pressable style = {styles.itemModal}>
                                  <View style={{flexDirection: 'row', justifyContent:"flex-end"}}>
                                      <Pressable onPress={handleModal} style = {{backgroundColor:"red", width:"20%"}}>
                                        <Text style={[styles.rightBox]}>x</Text>
                                      </Pressable>
                                  </View>
                                  <Text>Name</Text>
                                  <TextInput onChangeText={text => setNewName(text)} style ={styles.textInput} placeholder = "Name"></TextInput>
                                  <Button title="Save" onPress={save} />
                                </Pressable>
                            </Pressable>
                          </Modal>

          </View>
  );
}