import { StyleSheet, View, Pressable, Modal} from 'react-native';
import {Button, Text, Input} from 'react-native-elements'
import React, { Component, useState, useEffect } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {styles} from "../lib/styles.js"
import DateTimePickerModal from "react-native-modal-datetime-picker";
export default class DatePicker extends React.Component {

    constructor(props)
    {
        super();
        var hours = "00"
        var minutes = "00"
        if (props.date)
        {
            var date = new Date(props.date)
            hours = date.getHours()
            minutes = date.getMinutes()
            if (hours < 10)
            {
                hours = "0" + hours
            }
            if (minutes < 10)
            {
                minutes = "0" + minutes
            }

        }

        this.state = {
            date: hours + ":" + minutes,
            isDatePickerVisible: false,
            timestamptz: new Date()
        }


        this.handleDatePicker = this.handleDatePicker.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
    }

    handleDatePicker() {
        this.setState({
            isDatePickerVisible:!this.state.isDatePickerVisible,
        })
    };

    getDate()
    {
        return this.state.timestamptz
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
        handleDatePicker();
    };

    render()
    {
        return (
              <View>
                  <Text style={{paddingLeft:10, fontSize:17}}>{this.state.date}</Text>
                  <Button title="Set Time" onPress={this.handleDatePicker}/>
                  <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible}
                    mode="time"
                    onConfirm={this.handleConfirm}
                    onCancel={this.handleDatePicker}
                  />
              </View>
        );
    }
}