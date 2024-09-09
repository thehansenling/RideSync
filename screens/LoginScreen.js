import { Button, Text, FlatList, StyleSheet, View, TextInput, Alert } from 'react-native';
//import {Button, Text, Input} from 'react-native-elements'
import { useState, useEffect } from "react";
import {supabase} from "../lib/supabase.js"
import { createClient } from "@supabase/supabase-js";
import {styles} from "../lib/styles.js";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

 async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,

    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {

    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
            options: {
              data:
              {
                  firstName: firstName,
                  lastName: lastName,
                  phoneNumber: phoneNumber
              }
            }
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (

    <View style={styles.login_container}>
    <Text style= {{fontSize:50}}>Login</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
        <TextInput
          label="First Name"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          placeholder="first name"
          autoCapitalize={'none'}
        />
        <TextInput
          label="Last Name"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          placeholder="last name"
          autoCapitalize={'none'}
        />
        <TextInput
          label="Phone Number"
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
          placeholder="phone number"
          autoCapitalize={'none'}
        />
</View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  );
}