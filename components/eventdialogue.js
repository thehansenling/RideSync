import { StyleSheet, Text, View, Pressable, Modal, TextInput, Button} from 'react-native';
import React, { Component, useState, useEffect, createRef } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"
import DatePicker from "./datepicker.js"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { v4 as uuid } from "uuid";
import {UserContext, useUser} from "../lib/context.js"

export default class EventDialogue extends React.Component {

    constructor(props) {
        super();
        this.username = props.username
        this.temp_name =''
        console.log("DIALOGUE")
        if (props.data)
        {
            this.state = {
                isModalVisible: false,
                pickUpLocation:props.data.event_start_location,
                startTime:props.data.event_start_time,
                dropOffLocation: props.data.event_end_location,
                endTime: props.data.event_end_time,
                newName: props.data.event_name,
                id: props.data.event_id
            }
        } else
        {
            this.state = {
                isModalVisible: false,
                newName:'',
                pickUpLocation: '',
                dropOffLocation: '',
                startTime:'',
                endTime:'',
                id:''
            }
        }
        this.props = props
        this.handleModal = this.handleModal.bind(this)
        this.save = this.save.bind(this)
        this.setTempName = this.setTempName.bind(this)
        this.pickUpLocationRef = createRef()
        this.dropOffLocationRef = createRef()
        this.startTimeRef = createRef()
        this.endTimeRef = createRef()
    }

    handleModal(){
        this.setState({
            isModalVisible:!this.state.isModalVisible,
        })
    }
    setTempName(text)
    {
        this.temp_name = text
    }
    async save()
    {
        var startTime = this.startTimeRef.current.getDate().toString()
        var endTime = this.endTimeRef.current.getDate().toString()
        var newId = this.state.id
        console.log(this.state)
        if (!newId)
        {
            newId = uuid()
        }
        var data = {
                   id: newId,
                   name: this.temp_name,
                   start_time:this.startTimeRef.current.getDate(),
                   end_time:this.endTimeRef.current.getDate(),
                   start_location:this.state.pickUpLocation,
                   end_location:this.state.dropOffLocation,
                   username: this.username,
                   schedule_id: this.props.schedule_id
                   }

        this.temp_name = ''
        console.log(data)
        const err = await supabase
          .from('events')
          .upsert(data)
        console.log("HERE")
        data.start_time = this.startTimeRef.current.getDate().toString()
        data.end_time = this.endTimeRef.current.getDate().toString()
        this.props.valuesCallback(data)
        this.handleModal()
    }
    render()
    {
        return (
        <Modal visible={this.state.isModalVisible} transparent={true}>
            <Pressable onPress = {this.handleModal} style = {styles.modalContainer}>
                <Pressable style = {styles.itemModal}>
                  <View style={{flexDirection: 'row', justifyContent:"flex-end"}}>
                      <Pressable onPress={this.handleModal} style = {{backgroundColor:"red", width:"20%"}}>
                        <Text style={[styles.rightBox]}>x</Text>
                      </Pressable>
                  </View>
                  <Text>Event</Text>
                  <TextInput style ={styles.textInput} placeholder = {this.state.newName ? this.state.newName : "Event Name"} onChangeText={text => this.setTempName(text)}></TextInput>
                  <Text>Pick-Up Time</Text>
                  <DatePicker date = {this.state.startTime} ref = {this.startTimeRef}/>
                  <Text>Pick-Up Location</Text>
                   <GooglePlacesAutocomplete
                       styles={{
                         container: {
                            flex:0,
                         }
                       }}
                     placeholder={this.state.dropOffLocation ? this.state.dropOffLocation : "Search"}
                     onPress={(data, details = null) => {
                       // 'details' is provided when fetchDetails = true
                       console.log(data, details);
                       this.setState({pickUpLocation:data.description})
                     }}
                     query={{
                       key: 'AIzaSyCc9IsKZUH2y2HfgWhsbW-SBYng3xa1-Zc',
                       language: 'en',
                       components: 'country:us',
                     }}
                   />
                  <Text>Drop-Off Time</Text>
                  <DatePicker date = {this.state.endTime} ref = {this.endTimeRef}/>
                  <Text>Drop-Off Location</Text>
                   <GooglePlacesAutocomplete
                       styles={{
                         container: {
                            flex:0,
                         }
                       }}
                     placeholder={this.state.dropOffLocation ? this.state.dropOffLocation : "Search"}
                     onPress={(data, details = null) => {
                       // 'details' is provided when fetchDetails = true
                       console.log(data, details);
                       this.setState({dropOffLocation:data.description})
                     }}
                     query={{
                       key: 'AIzaSyCc9IsKZUH2y2HfgWhsbW-SBYng3xa1-Zc',
                       language: 'en',
                       components: 'country:us',
                     }}
                   />
                  <Button title="Save" onPress={this.save} />
                </Pressable>
            </Pressable>
        </Modal>
        );
  }
}