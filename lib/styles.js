import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  login_container: {
    marginTop: 40,
    padding: 12,
  },
  container: {
    flexDirection: 'row'
  },
    itemText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  leftBox: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
      itemModal: {
        position: 'fixed',
        height:'80%',
        width:'80%',
        top:'10%',
        left: '10%',
        backgroundColor: 'white',
        zValue:1000
      },
      modalContainer: {
          position:"fixed",
          height:"100%",
          width:"100%",
          backgroundColor:"rgba(0, 0, 0, 0.5)",
      },
      textInput: {
        backgroundColor: "#cccccc",
        borderStyle: "solid",
        borderColor:"black",
        borderWidth:1,

      },
      closeButton: {
        width:"30px",
        height:"30px",
        backgroundColor:"red"
      }
 })
