import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';


export default class HomePage extends Component {

  
    onPress() {
        /*
        this.props.navigator.push({
            screen: 'Home'
        });
      
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'Home',
                title: 'Home Title',
            }
        });
        */
    }


    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Home Page !</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
