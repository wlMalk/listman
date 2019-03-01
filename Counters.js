import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { themes } from './Themes'
import { COUNTERS_HEIGHT } from './helpers'

import { List } from './List';

export class CountersList extends React.Component {
  constructor(props) {
    super(props)
    this.list = [
      {
        id: "ALL",
        name: "All tasks",
        onPress: props.onAllPress,
      },{
        id: "REMAINING",
        name: "Remaining",
        onPress: props.onRemainingPress,
      },{
        id: "COMPLETED",
        name: "Completed",
        onPress: props.onCompletedPress,
      },{
        id: "RECURRING",
        name: "Recurring",
        onPress: props.onRecurringPress,
      },
    ]
  }
  render(){
    console.log(this.list.length);
    return (
      <View style={[styles.countersListContainer, {backgroundColor: themes[this.props.theme].mainColor, borderBottomColor: themes[this.props.theme].mainAccent, borderBottomWidth: 5}]}>
        <View style={styles.countersList}>
          <List
            ref={(ref)=>{this.listRef = ref}}
            style={[styles.countersList]}
            data={this.list}
            keyExtractor={counter => counter.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            renderItem={({item, index}) => (
              <Counter selected={item.id==this.props.selected} name={item.name} count={item.id=="ALL"?this.props.all:item.id=="REMAINING"?this.props.remaining:item.id=="COMPLETED"?this.props.completed:item.id=="RECURRING"?this.props.recurring:0} onPress={item.onPress} last={index==this.list.length-1} theme={this.props.theme} fontLoaded={this.props.fontLoaded} />
            )}
            overlayColor={themes[this.props.theme].mainColor}
            overlaySize={35}
            emptyState="no goals yet"
            emptyStateSize={14}
            emptyStateColor="#000"
            fontLoaded={this.props.fontLoaded} />
        </View>
        {this.props.fontLoaded ? (
        <TouchableOpacity activeOpacity={.5} onPress={()=>{LayoutAnimation.configureNext(animationConfig);this.props.creator()}} style={{marginLeft:18,alignItems:'flex-end',justifyContent:'center',bottom:5, paddingRight: 18,width:COUNTERS_HEIGHT,height:COUNTERS_HEIGHT,textAlign:'right'}}><Text style={{color: themes[this.props.theme].mainTitles,fontFamily: 'pt-mono-bold',fontSize:40}}>+</Text></TouchableOpacity>
        ) : null }
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
  countersListContainer: {
    flexDirection: "row",
    paddingLeft: 18,
    height: COUNTERS_HEIGHT,
  },
  countersList: {
    flexDirection: "row",
    flex: 1,
    height: COUNTERS_HEIGHT-5,
  },
  counter: {
    // width: 100,
    height: COUNTERS_HEIGHT-5,
    paddingLeft: 20,
    paddingRight: 20,
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
    marginRight: 2,
    marginLeft: 2,
    marginTop: (COUNTERS_HEIGHT-5)/4,
  }
});
