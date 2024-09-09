import { StyleSheet, View, Pressable, Modal} from 'react-native';
import {Button, Text, Input, Card, ListItem} from 'react-native-elements'
import {ButtonGroup} from "@rneui/themed"
import React, { Component, useState, useEffect, createRef } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"
import DatePicker from "./datepicker.js"
import { SelectMultipleWeekDays } from "react-native-select-week-day";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import GooglePlacesApi from 'dcts-google-places-api';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { v4 as uuid } from "uuid";
import {UserContext, useUser} from "../lib/context.js"

const apiKey = "AIzaSyCc9IsKZUH2y2HfgWhsbW-SBYng3xa1-Zc"; // define API key
const googleapi = new GooglePlacesApi(apiKey); // initialize

export default class EventDialogue extends React.Component {

    constructor(props) {
        super();
        this.username = props.username
        this.temp_name =''
        if (props.data)
        {
            var days = props.data.event_days
            if (!days.length || days == "[]")
            {
                days = []
            }
            else
            {
                days = ("[" + props.data.event_days + "]").toString()
                days = JSON.parse(days)
            }

            this.state = {
                isDateVisible: false,
                isModalVisible: false,
                pickUpLocation:props.data.event_start_location,
                startTime:props.data.event_start_time,
                dropOffLocation: props.data.event_end_location,
                endTime: props.data.event_end_time,
                newName: props.data.event_name,
                days: days,
                id: props.data.event_id,
                selectedIndex: 0,
                startCoords: [0, 0],
                endCoords : [0, 0]
            }
        } else
        {
            this.state = {
                isDateVisible: false,
                isModalVisible: false,
                newName:'',
                pickUpLocation: '',
                dropOffLocation: '',
                startTime:new Date(),
                endTime:new Date(),
                days:[],
                id:'',
                selectedIndex: 0,
                startCoords: [0, 0],
                endCoords : [0, 0]
            }
        }
        this.dateSelector =
              this.dateSelector = <SelectMultipleWeekDays
                style = {{flex:1}}
                selectableDays={["sun", "mon", "tue", "wed", "thu", "fri", "sat"]}
                containerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
                initialWeekDays = {this.state.days}
                bubblesInitialColor={"grey"}
                bubblesSelectedColor={"green"}
                size={50}
                onChange={(day) => this.setState({days:day})}
              />

        this.props = props
        this.handleModal = this.handleModal.bind(this)
        this.save = this.save.bind(this)
        this.setTempName = this.setTempName.bind(this)
        this.setSelected = this.setSelected.bind(this)
        this.selectDay = this.selectDay.bind(this)
        this.selectWeekly = this.selectWeekly.bind(this)
        this.handleDate = this.handleDate.bind(this)
        this.getIndex = this.getIndex.bind(this)
        this.pickUpLocationRef = createRef()
        this.dropOffLocationRef = createRef()
        this.startTimeRef = createRef()
        this.endTimeRef = createRef()
    }

    setSelected(){
        this.setSelected(!this.selected)
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
        if (!this.state.selectedIndex && !this.state.days.length)
        {
            console.warn("No weekly days selected")
            return
        }
        var startTime = this.startTimeRef.current.getDate().toString()
        var endTime = this.endTimeRef.current.getDate().toString()
        var newId = this.state.id
        this.selected = false

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
                   username: this.username.username.data.user.email,
                   schedule_id: this.props.schedule_id,
                   days:this.state.days.toString(),
                   user_full_name: this.username.username.data.user.user_metadata.firstName + " " + this.username.username.data.user.user_metadata.lastName,
                   user_phone_number: this.username.username.data.user.user_metadata.phoneNumber,
                   start_coords:this.state.startCoords,
                   end_coords:this.state.endCoords
                   }
        if (this.state.selectedIndex)
        {
            this.setState({days:[]})
        }
        this.temp_name = ''
        const err = await supabase
          .from('events')
          .upsert(data)
        data.start_time = this.startTimeRef.current.getDate().toString()
        data.end_time = this.endTimeRef.current.getDate().toString()
        this.props.valuesCallback(data)
        this.setState({days:[]})
        this.handleModal()
    }

    selectDay(day)
    {
        var newDays = [...this.state.days]
        const index = newDays.indexOf(day);
        if (index > -1) {
          newDays.splice(index, 1);
        }
        else
        {
            newDays.push(day)
        }
        this.setState({days:newDays})
    }

    handleConfirm(date) {

        var hours = date.getHours()
        var minutes = date.getMinutes()

        if (hours < 10)
        {
            hours = "0" + hours
        }

        if (minutes < 10)
        {
            minutes = "0" + minutes
        }
        this.setState({
            date: hours + ":" + minutes,
            timestamptz: date
        })

        var newStart = this.state.startTime
        var newEnd = this.state.endTime
        newStart.setDate(date.getDate())
        newStart.setMonth(date.getMonth())
        newEnd.setDate(date.getDate())
        newEnd.setMonth(date.getMonth())
        this.setState({startTime:newStart,
                       endTime:newEnd})

        this.handleDate();
    };

    selectWeekly(value)
    {
        this.setState({selectedIndex: value})
        //this.selectedIndex = value

        if (!value)
        {
              this.dateSelector = <SelectMultipleWeekDays
                style = {{flex:1}}
                selectableDays={["sun", "mon", "tue", "wed", "thu", "fri", "sat"]}
                containerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
                initialWeekDays = {this.state.days}
                bubblesInitialColor={"grey"}
                bubblesSelectedColor={"green"}
                size={50}
                onChange={(day) => this.setState({days:day})}
              />
        }
        else
        {
                this.dateSelector = <View>
                  <Button title="Select Date" onPress={this.handleDate}/>
              </View>
        }

    }
    getIndex()
    {
        return this.state.selectedIndex
    }
    handleDate()
    {
        this.setState({isDateVisible: !this.state.isDateVisible})
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
                  <Text style={{paddingLeft:10, fontSize:20}}>Event</Text>
                  <Input style ={styles.textInput} placeholder = {this.state.newName ? this.state.newName : "Event Name"} onChangeText={text => this.setTempName(text)}></Input>
                  <Text style={{paddingLeft:10, fontSize:20}}>Pick-Up Time</Text>
                  <DatePicker style={{paddingLeft:10}} date = {this.state.startTime} ref = {this.startTimeRef}/>
                  <Text style={{paddingLeft:10, fontSize:20}}>Pick-Up Location</Text>
                   <GooglePlacesAutocomplete
                       styles={{
                         container: {
                            flex:0,
                         }
                       }}
                     placeholder={this.state.dropOffLocation ? this.state.dropOffLocation : "Search"}
                     onPress={(data, details = null) => {
                       // 'details' is provided when fetchDetails = true
                       var start_coords = ''
                       googleapi.runPlaceDetails(data.place_id).then(placeDetails => {
                         console.log(placeDetails.geometry.location);
                         start_coords = placeDetails.geometry.location
                        this.setState({pickUpLocation:data.description,
                                       startCoords:start_coords})
                       })

                     }}
                     query={{
                       key: 'AIzaSyCc9IsKZUH2y2HfgWhsbW-SBYng3xa1-Zc',
                       language: 'en',
                       components: 'country:us',
                     }}
                   />
                  <Text style={{paddingLeft:10, fontSize:20}}>Drop-Off Time</Text>
                  <DatePicker date = {this.state.endTime} ref = {this.endTimeRef}/>
                  <Text style={{paddingLeft:10, fontSize:20}}>Drop-Off Location</Text>
                   <GooglePlacesAutocomplete
                       styles={{
                         container: {
                            flex:0,
                         }
                       }}
                     placeholder={this.state.dropOffLocation ? this.state.dropOffLocation : "Search"}
                     fetchDetails = {true}
                     onPress={(data, details = null) => {
                       // 'details' is provided when fetchDetails = true

                       var end_coords = ''
                        googleapi.runPlaceDetails(data.place_id).then(placeDetails => {
                          console.log(placeDetails.geometry.location);
                          end_coords = placeDetails.geometry.location
                             this.setState({dropOffLocation:data.description,
                                            endCoords:end_coords})
                        })

                     }}
                     query={{
                       key: 'AIzaSyCc9IsKZUH2y2HfgWhsbW-SBYng3xa1-Zc',
                       language: 'en',
                       components: 'country:us',
                     }}
                   />

                   <ButtonGroup
                     buttons={['Weekly', 'One Time']}
                     selectedIndex={this.getIndex()}
                      onPress={(value) => {
                        this.selectWeekly(value);
                      }}
                     containerStyle={{ marginBottom: 20 }}
                   />
                  <DateTimePickerModal
                    isVisible={this.state.isDateVisible}
                    mode="date"
                    onConfirm={(date)=>this.handleConfirm(date)}
                    onCancel={this.handleDate}
                  />
                  <Text style={{paddingLeft:10, fontSize:17}}>{this.state.startTime && this.state.selectedIndex ? this.state.startTime.toLocaleString('default', { month: 'long' }) + " " + new Date(this.state.startTime).getDate(): ""}</Text>
                  { this.dateSelector }
                  <Button title="Save" onPress={this.save} />
                </Pressable>

            </Pressable>
        </Modal>
        );
  }
}