import { FlatList, Button, Text, StyleSheet, View, Modal, Pressable} from 'react-native';
//import {Button, Text, Input} from 'react-native-elements'
import { useState, useEffect, createRef } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {UserContext, useUser} from "../lib/context.js"
import { styles } from "../lib/styles.js"
import EventDialogue from "../components/eventdialogue.js"
import Event from "../components/event.js"
import Schedule from "../components/schedule.js"

import Matches from "../components/matches.js"


export default function MatchScreen({navigation, route}) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [matches, setMatches] = useState({})
    const [events, setEvents] = useState([])
    const user = useUser()
    useEffect(() => {

        async function getSchedules()
        {

            async function matchFunction(inputs)
            {
                var start_time = inputs[0]
                var end_time = inputs[1]
                var start_coords = inputs[2]
                var end_coords = inputs[3]
                var  input = {input_start_time:start_time, input_end_time:end_time, input_start_coords:start_coords, input_end_coords:end_coords}
                return new Promise(async (resolve, reject) => {
                        var data = await supabase
                          .rpc('get_matching_events', input)
                        resolve(data.data);
                       });
            }

            var schedule_response = await supabase
              .rpc('get_schedule_events', {input_schedule_id:route.params.schedule_id})
            var newEvents = []
            var promises = []
            for (event_index in schedule_response.data)
            {
                var event = schedule_response.data[event_index]
                promises.push([event.event_start_time,event.event_end_time,event.event_start_coords,event.event_end_coords, event.event_id])

            }
            Promise.all(promises.map(matchFunction)).then(results => {
                var new_matches = {}
                var final_matches = {}
                for (match_index in results)
                {
                    var match = results[match_index]
                    new_matches[promises[match_index][4]] = match
                }

                for (var event_id in new_matches)
                {
                    var final_event_matches = []
                    var event_name = ''
                    var matching_event = null
                    for (var event_index in new_matches[event_id])
                    {
                         var potential_match = new_matches[event_id][event_index]
                         if (potential_match.event_id == event_id)
                         {
                            matching_event = potential_match
                            break
                         }
                    }
                    event_name = matching_event.event_name
                    for (var event_index in new_matches[event_id])
                    {

                        var potential_match = new_matches[event_id][event_index]
                        //NEED TO ADD DAY / DATE COMPARISON
//                        console.log(user.username.data.user)
//                        console.log(user.username.data.user.email)
//                        console.log(potential_match.event_username)

                        if (potential_match.event_id != event_id &&
                            potential_match.event_username != user.username.data.user.email)
                            {

                            //console.log([JSON.parse(new Date(matching_event.event_start_time).getDay())].filter(value => potential_match.event_days.includes(value)).length)
                            if (potential_match.event_days == "[]")
                            {
                                potential_match.event_days = []
                            }
                            else if (typeof potential_match.event_days != "object")
                            {
                                potential_match.event_days = JSON.parse(potential_match.event_days)
                            }
                            if (matching_event.event_days == "[]")
                            {
                                matching_event.event_days = []
                            }
                            else if (typeof matching_event.event_days != "object")
                            {
                                matching_event.event_days = JSON.parse(matching_event.event_days)

                            }
                            matching_event.event_start_time = new Date(matching_event.event_start_time)
                            matching_event.event_end_time = new Date(matching_event.event_end_time)
                            potential_match.event_start_time = new Date(potential_match.event_start_time)
                            potential_match.event_end_time = new Date(potential_match.event_end_time)
                            if(((matching_event.event_days.length == 0 || matching_event.event_days == "[]" )))
                            {
                                 if (matching_event.event_start_time.getDay() in potential_match.event_days ||
                                    matching_event.event_start_time.getDay() == potential_match.event_start_time.getDay())
                                 {

                                    final_event_matches.push(potential_match)
                                    continue
                                 }
                            }

                            if  (matching_event.event_days.length != 0 && matching_event.event_days != "[]" &&
                                 matching_event.event_days.filter(value => potential_match.event_days.includes(value)).length)
                             {
                                final_event_matches.push(potential_match)
                                continue
                             }
                        }


                    }
                    final_matches[event_name] = final_event_matches
                }
                setMatches(final_matches)
            });

        }
        getSchedules()
    },
    []);

  return (
          <View>
              <FlatList data = {Object.keys(matches)}
              renderItem = {(i) =>
                   {
                      const event_matches = matches[i.item]
                      return <Matches events={event_matches} event_name ={i.item}/>
                   }
                  }/>
          </View>
  );
}