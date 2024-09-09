import { StyleSheet, View, Pressable, Modal} from 'react-native';
import {Button, Text, Input, Card, ListItem} from 'react-native-elements'
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
        navigation.push("Schedule",{schedule_id:schedule_id})
    }

  return (
          <ListItem>
          <Pressable onPress={goSchedule} style = {{flex:1, width:"100%", height:"200px"}}>
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
                                  <Input onChangeText={text => setName(text)} style ={styles.textInput} placeholder = "Name"></Input>
                                </Pressable>
                            </Pressable>
                          </Modal>

          </Pressable>
          </ListItem>
  );
}