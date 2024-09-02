import { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { Text, View} from 'react-native';
import {supabase} from "./supabase.js"

export const UserContext = createContext('ahhhhhh');

export const UserProvider = (props) => {
    const [username, setUsername] = useState('')
    const [loading,setLoading]=useState(false);
    useEffect(() => {
        async function getUserContext()
        {
            setLoading(true)
            const user = await supabase.auth.getUser()
            setUsername(user)
            setLoading(false)
        }
        getUserContext()
        console.log("GOT USER")
    },
    []);

  const children = useMemo(
    () => (
      <View>
        <Text>Hello!</Text>
      </View>
    ),
    []
  );

    return (
        <UserContext.Provider value={{loading,username}}>
            {username ? props.children : <View><Text>Loading</Text></View>}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
//getUserContext()
