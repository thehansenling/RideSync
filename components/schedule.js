import { StyleSheet, Text, View, Pressable, Modal, TextInput, Button} from 'react-native';
import { useState, useEffect } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"

export default function Schedule({navigation, name, schedule_id}) {

    const [isModalVisible, setIsModalVisible] = useState(false)

    function handleModal(){
        setIsModalVisible(true)
    }

    function setName(newName)
    {
        name = newName
    }


    function goSchedule()
    {
        console.log("SINGLE ID")
        console.log(schedule_id)
        navigation.push("Schedule",{schedule_id:schedule_id})
    }

  return (
          <Pressable onPress={goSchedule} style = {{flex:1, width:"100%", height:"100px", backgroundColor:"gray"}}>
            <Text>{name}</Text>
                          <Modal visible={isModalVisible} transparent={true}>
                            <Pressable onPress = {handleModal} style = {styles.modalContainer}>
                                <Pressable style = {styles.itemModal}>
                                  <View style={{flexDirection: 'row', justifyContent:"flex-end"}}>
                                      <Pressable onPress={handleModal} style = {{backgroundColor:"red", width:"20%"}}>
                                        <Text style={[styles.rightBox]}>x</Text>
                                      </Pressable>
                                  </View>
                                  <Text>Name</Text>
                                  <TextInput onChangeText={text => setName(text)} style ={styles.textInput} placeholder = "Name"></TextInput>
                                </Pressable>
                            </Pressable>
                          </Modal>

          </Pressable>
  );
}