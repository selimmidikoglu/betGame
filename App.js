import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Image,Alert, Dimensions, TouchableOpacity} from 'react-native';
var {height, width} = Dimensions.get('window');
console.disableYellowBox = true
export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
        currentImg: '',
        previousCardValue: '',
        nextCardValue: '',
        deckID: ''
    }
  }
  //Give values to ACE, KING, QUEEN, JACK
  comparisonOfCards(value){
    if(value == "ACE"){
      this.setState({nextCardValue:14})
    }
    else if(value == "KING"){
      this.setState({nextCardValue:13})
    }
    else if(value == "QUEEN"){
      this.setState({nextCardValue:12})
    }
    else if(value == "JACK"){
      this.setState({nextCardValue:11})
    }
    else{
      this.setState({nextCardValue:value})
    }
    
  }
  componentDidMount(){
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({deckID:responseJson.deck_id});
      fetch('https://deckofcardsapi.com/api/deck/' + this.state.deckID + '/draw/?count=1')
      .then((card) => card.json())
      .then((cardJson) => {
        if(cardJson.cards[0].value == "ACE"){
          this.setState({previousCardValue:14})
        }
        else if(cardJson.cards[0].value == "KING"){
          this.setState({previousCardValue:13})
        }
        else if(cardJson.cards[0].value == "QUEEN"){
          this.setState({previousCardValue:12})
        }
        else if(cardJson.cards[0].value == "JACK"){
          this.setState({previousCardValue:11})
        }
        else{
          this.setState({previousCardValue:cardJson.cards[0].value})
        }
        this.setState({currentImg:cardJson.cards[0].image})
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  getNextAndCalculate(action){
    if(action === "up"){
      fetch('https://deckofcardsapi.com/api/deck/' + this.state.deckID + '/draw/?count=1')
      .then((card) => card.json())
      .then((cardJson) => {
        console.log("Prev " + this.state.previousCardValue);
        // Get Current Card Value and Image
        this.comparisonOfCards(cardJson.cards[0].value);
        console.log("Next " + this.state.nextCardValue);
        this.setState({currentImg:cardJson.cards[0].image});
        if(this.state.previousCardValue < this.state.nextCardValue)
        {
          Alert.alert(
            'Win',
            '',
            [
              {text: '', onPress: () => console.log('Ask me later pressed')},
              {
                text: '',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            
            {cancelable: true},
          );
          
        }
        else{
          Alert.alert(
            'Lose',
            '',
            [
              {text: '', onPress: () => console.log('Ask me later pressed')},
              {
                text: '',
                onPress: () => console.log('Cancel Pressed'),
                style: '',
              },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: true},
          );
        }
        this.setState({previousCardValue:this.state.nextCardValue});
      })
      .catch((error) => {
        console.error(error);
      });
    }
    else if("down"){
      fetch('https://deckofcardsapi.com/api/deck/' + this.state.deckID + '/draw/?count=1')
      .then((card) => card.json())
      .then((cardJson) => {
        console.log("Prev" + this.state.previousCardValue);
        //
        this.comparisonOfCards(cardJson.cards[0].value);
        console.log("Next " + this.state.nextCardValue);
        this.setState({currentImg:cardJson.cards[0].image});
        
        if(this.state.previousCardValue > this.state.nextCardValue)
        {
          Alert.alert(
            'Win',
            '',
            [
              {text: '', onPress: () => console.log('Ask me later pressed')},
              {
                text: '',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        }
        else{
          Alert.alert(
            'Lose',
            '',
            [
              {text: '', onPress: () => console.log('Ask me later pressed')},
              {
                text: '',
                onPress: () => console.log('Cancel Pressed'),
                style: '',
              },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: true},
          );
        }
        this.setState({previousCardValue:this.state.nextCardValue});
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }
  render() {

    return (
        <View style={styles.container}>
            <View style={{height:height*3/4,width:width,alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode="contain" source={{uri:this.state.currentImg}} style={{width:314, height:226}} ></Image>
            </View>
            <View style={{flexDirection:'row', height:height*1/6,width:width}}>
                <View style={{flex:1,borderColor:'red',borderWidth:2,alignItems:'center',justifyContent:'center'}}>
                  <TouchableOpacity onPress={()=> this.getNextAndCalculate("down")}>
                    <Text style={styles.welcome}>Down</Text>
                  </TouchableOpacity>
                </View>
                <View  style={{flex:1,borderColor:'red',borderWidth:2,alignItems:'center',justifyContent:'center'}}>
                  <TouchableOpacity onPress={()=> this.getNextAndCalculate("up")}>
                    <Text style={styles.welcome}>Up</Text>
                  </TouchableOpacity></View>
            </View>        
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
});
