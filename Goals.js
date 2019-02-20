import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { animationConfig, pad, GOALS_HEIGHT } from './helpers'
import { themes } from './Themes'

export class Goal extends React.Component {
  static daysFromTo(from, to){
    var oneDay = 24*60*60*1000;
    var diff = to.getTime() - from.getTime()
    if(diff<0&&Math.round(Math.abs(diff)/(oneDay))!=0){
      return -1
    }
    return Math.round(Math.abs(diff)/(oneDay));
  }
  static daysPercentage(start, end){
    var now = new Date();
    var totalDays = Goal.daysFromTo(start, end)
    var daysSinceStart = Goal.daysFromTo(start, new Date())
    if(daysSinceStart>=totalDays){
      return 100
    }
    return daysSinceStart/totalDays*100;
  }
  static daysUntil(end){
    var days = Goal.daysFromTo(new Date(), end)
    if(days==0){
      return "today"
    }else if(days<0){
      return "passed"
    }else if(days==1){
      return "one day"
    }
    return days+" days";
  }
  render(){
    return (
      <TouchableOpacity activeOpacity={.5} onPress={this.props.onPress} style={[styles.goalContainer, this.props.style]}>
        <View style={[styles.goal, this.props.selected?[{backgroundColor: themes[this.props.theme].goalHighlight}, styles.goalSelected]:{backgroundColor: themes[this.props.theme].goal}]}>
          <View style={[styles.goalHead]}>
            {this.props.fontLoaded ? (
            <Text style={[styles.goalName, {color: themes[this.props.theme].goalName}, this.props.goal.inToday||this.props.goal.inTomorrow?{marginRight: 3}:null]}>{this.props.goal.name.toUpperCase()}</Text>
            ) : null }
            {this.props.goal.inToday ? (
            <View style={[styles.dayIndicator, {backgroundColor: themes[this.props.theme].goalTodayIndicator}]}></View>
            ) : null }
            {this.props.goal.inTomorrow ? (
            <View style={[styles.dayIndicator, {backgroundColor: themes[this.props.theme].goalTomorrowIndicator}]}></View>
            ) : null }
          </View>
          <View style={styles.goalBottom}>
            <GoalProgressBar progress={this.props.goal.completedTasks/this.props.goal.totalTasks*100} text={this.props.goal.completedTasks+"/"+this.props.goal.totalTasks} align="left" theme={this.props.theme} fontLoaded={this.props.fontLoaded} />
            <View style={{flex:1}}></View>
            <GoalProgressBar progress={Goal.daysPercentage(this.props.goal.start, this.props.goal.deadline)} text={Goal.daysUntil(this.props.goal.deadline)} align="right" theme={this.props.theme} fontLoaded={this.props.fontLoaded} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

class GoalProgressBar extends React.Component {
  render() {
    return (
      <View style={[styles.progressBarContainer, this.props.align=="left"?{paddingRight: 5}:{paddingLeft: 5}]}>
        <View style={[styles.progressBar, {backgroundColor: themes[this.props.theme].goalProgressBar}]}>
          <View style={[styles.progressBarIndicator,
            {width: this.props.progress+'%'},
            {backgroundColor: themes[this.props.theme].goalProgressBarIndicator}]}></View>
        </View>
        {this.props.fontLoaded ? (
        <Text style={[styles.progressBarText, {textAlign: this.props.align, color: themes[this.props.theme].goalProgressBarIndicator}]}>{this.props.text.toUpperCase()}</Text>
        ) : null }
      </View>
    )
  }
}

export class GoalsList extends React.Component {
  // {this.props.fontLoaded ? (
  //   <View style={{paddingLeft: 18, paddingRight: 18, paddingTop: 5, paddingBottom: 0}}>
  //     <Text style={{color: themes[this.props.theme].mainTitles, fontFamily: 'pt-mono-bold', fontSize: 14, lineHeight: 14}}>GOALS</Text>
  //   </View>
  // ) : null }
  render(){
    return (
      <View style={styles.goalsList}>

        <View>
          <FlatList
            style={{height: GOALS_HEIGHT}}
            data={this.props.goals}
            ref={(ref) => {this.flatListRef = ref}}
            keyExtractor={goal => goal.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            renderItem={({item, index}) => (
              <Goal onPress={()=>{this.props.selectGoal(item.id)}} style={[index==0?{paddingLeft: 18}:null, index==this.props.goals.length-1?{paddingRight: 18}:null]} theme={this.props.theme} goal={item} selected={this.props.selected&&this.props.selected==item.id} fontLoaded={this.props.fontLoaded} />
            )} />
          <GoalsShade left={true} color={themes[this.props.theme].mainColor} />
          <GoalsShade left={false} color={themes[this.props.theme].mainColor} />
        </View>
      </View>
    )
  }
}

class GoalsShade extends React.Component {
  render() {
    return (
      <View style={[{position:'absolute',height:GOALS_HEIGHT,width:10,zIndex:999,overflow:'visible'},!this.props.left?{right:0}:{left:0}]}>
        <View style={{
          position:'absolute',
          height:GOALS_HEIGHT,
          width:10,
          shadowColor: this.props.color,
          shadowOffset: {height:0,width:this.props.left?10:-10},
          shadowOpacity: 0.25,
          shadowRadius: 10,
          backgroundColor: this.props.color,
        }}></View>
        <View style={{
          position:'absolute',
          height:GOALS_HEIGHT,
          width:10,
          shadowColor: this.props.color,
          shadowOffset: {height:0,width:this.props.left?6:-6},
          shadowOpacity: 1,
          shadowRadius: 2,
          backgroundColor: this.props.color,
        }}></View>
        <View style={{
          position:'absolute',
          height:GOALS_HEIGHT,
          width:10,
          shadowColor: this.props.color,
          shadowOffset: {height:0,width:this.props.left?10:-10},
          shadowOpacity: 0.4,
          shadowRadius: 6,
          backgroundColor: this.props.color,
        }}></View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  goalsList: {
    height: GOALS_HEIGHT,
  },
  goalContainer: {
    height: GOALS_HEIGHT,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 5,
    paddingBottom: 5,
  },
  goalSelected: {
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2.5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  goal: {
    flex: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalHead: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  goalBottom: {
    flex: 1,
    flexDirection: 'row',
  },
  goalName: {
    fontFamily: 'pt-mono-bold',
    fontSize: 12,
  },
  dayIndicator: {
    height: 4,
    width: 4,
    borderRadius: 4,
    marginLeft: 2,
  },
  progressBarContainer: {
    width: 54,
  },
  progressBar: {
    height: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  progressBarIndicator: {
    position: 'absolute',
    height: '100%',
    left: 0,
    borderRadius: 10,
  },
  progressBarText: {
    fontFamily: 'pt-mono-bold',
    fontSize: 8,
    marginTop: 1,
  },
  goalsList: {
  },
});
