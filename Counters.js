import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { themes } from './Themes'
import { COUNTERS_HEIGHT } from './helpers'

export class CountersList extends React.Component {
  constructor(props) {
    super(props)
    this.list = [
      {
        id: "ALL",
        name: "All tasks",
        count: props.all,
        onPress: props.onAllPress,
      },{
        id: "REMAINING",
        name: "Remaining",
        count: props.remaining,
        onPress: props.onRemainingPress,
      },{
        id: "COMPLETED",
        name: "Completed",
        count: props.completed,
        onPress: props.onCompletedPress,
      },{
        id: "RECURRING",
        name: "Recurring",
        count: props.recurring,
        onPress: props.onRecurringPress,
      },
    ]
  }
  render(){
    return (
      <View style={[styles.countersList, {backgroundColor: themes[this.props.theme].mainColor, borderBottomColor: themes[this.props.theme].mainAccent, borderBottomWidth: 5}]}>
        {this.list.map((counter, i) => (<Counter key={i} selected={counter.id==this.props.selected} name={counter.name} count={counter.count} onPress={counter.onPress} last={i==this.list.length-1} theme={this.props.theme} fontLoaded={this.props.fontLoaded} />) )}
      </View>
    )
  }
}

class Counter extends React.Component {
  render() {
    return (
        <View style={{flex:1, height: COUNTERS_HEIGHT, flexDirection: "row"}}>
          {this.props.fontLoaded ? (
          <TouchableOpacity style={{flex: 1}} activeOpacity={.3} onPress={this.props.onPress}>
            <View style={[styles.counter, this.props.selected?{opacity: 1, backgroundColor: themes[this.props.theme].mainAccent}:null]}>
              <Text style={[styles.counterName, {color: themes[this.props.theme].counterName}]}>{this.props.name.toUpperCase()}</Text>
              <Text style={[styles.counterCount, {color: themes[this.props.theme].counterCount}]}>{this.props.count}</Text>
            </View>
          </TouchableOpacity>
          ) : null}
          {!this.props.last?(
            <View style={[styles.separator, {backgroundColor: themes[this.props.theme].counterSeparator}]}></View>
          ):null}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  countersList: {
    flexDirection: "row",
    paddingLeft: 8,
    paddingRight: 8,
  },
  counter: {
    flex: 1,
    height: COUNTERS_HEIGHT-5,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    opacity: .8,
  },
  counterName: {
    fontFamily: 'pt-mono-bold',
    fontSize: 12,
    textAlign: "center",
    marginBottom: 2,
  },
  counterCount: {
    fontFamily: 'pt-mono-bold',
    fontSize: 14,
    textAlign: "center",
  },
  separator: {
    height: (COUNTERS_HEIGHT-5)/2,
    width: 2,
    marginRight: 3,
    marginLeft: 3,
    marginTop: (COUNTERS_HEIGHT-5)/4,
  }
});
