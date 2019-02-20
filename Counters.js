import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { themes } from './Themes'
import { COUNTERS_HEIGHT } from './helpers'

export class CountersList extends React.Component {

  render(){

    const list = [
      {
        id: "ALL",
        name: "All tasks",
        count: this.props.all,
        onPress: this.props.onAllPress,
      },{
        id: "REMAINING",
        name: "Remaining",
        count: this.props.remaining,
        onPress: this.props.onRemainingPress,
      },{
        id: "COMPLETED",
        name: "Completed",
        count: this.props.completed,
        onPress: this.props.onCompletedPress,
      },{
        id: "RECURRING",
        name: "Recurring",
        count: this.props.recurring,
        onPress: this.props.onRecurringPress,
      },
    ]

    return (
      <View style={styles.countersList}>
        {list.map((counter, i) => (<Counter key={i} selected={counter.id==this.props.selected} name={counter.name} count={counter.count} onPress={counter.onPress} last={i==list.length-1} theme={this.props.theme} fontLoaded={this.props.fontLoaded} />) )}
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
            <View style={[styles.counter, this.props.selected?{backgroundColor: themes[this.props.theme].goalHighlight}:null]}>
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
    height: COUNTERS_HEIGHT,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
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
    height: COUNTERS_HEIGHT/2,
    width: 2,
    marginRight: 3,
    marginLeft: 3,
    marginTop: COUNTERS_HEIGHT/4,
  }
});
