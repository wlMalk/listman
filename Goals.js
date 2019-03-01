import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { List } from './List';
import { ShadowOverlay } from './ShadowOverlay';

import { animationConfig, pad, GOALS_HEIGHT } from './helpers'
import { themes } from './Themes'

const screenWidth = Dimensions.get('window').width;

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
  //
  // ) : null }
  constructor(props) {
    super(props)
    this.state = {
      scroll: 0,
      titleWidth: 0,
      titleShown: true,
      overlayNotShown: true,
      dragging: false,
      momentum: false,
    }

    this.scrollToSelectedGoal = false

    this.handleScroll = this.handleScroll.bind(this)
    this.handleListScroll = this.handleListScroll.bind(this)
    this.handleListMomentumScrollBegin = this.handleListMomentumScrollBegin.bind(this)
    this.handleListMomentumScrollEnd = this.handleListMomentumScrollEnd.bind(this)
    this.handleListDragBegin = this.handleListDragBegin.bind(this)
    this.handleListDragEnd = this.handleListDragEnd.bind(this)
    this.handleScrollEnd = this.handleScrollEnd.bind(this)
  }
  componentDidUpdate(prevProps) {
    if(this.props.selected!=prevProps.selected&&this.props.selected!=null){
      if(this.state.titleShown){
        this.scrollView.scrollTo({x: this.state.titleWidth, animated: true})
        this.scrollToSelectedGoal = true
      }else{
        this.list.scrollToIndex(this.props.goals.findIndex((goal)=>goal.id===this.props.selected))
      }
    }
  }
  handleScrollEnd(e) {
    const contentOffset = e.nativeEvent.contentOffset.x
    if(contentOffset==this.state.titleWidth&&this.state.titleShown&&this.scrollToSelectedGoal){
      this.list.scrollToIndex(this.props.goals.findIndex((goal)=>goal.id===this.props.selected))
      this.setState({titleShown: false})
      setTimeout(()=>{this.setState({overlayNotShown: false})},150)
      this.scrollToSelectedGoal = false
    }
  }
  handleScroll(e) {
    const contentOffset = e.nativeEvent.contentOffset.x
    // if(contentOffset<=this.state.titleWidth&&contentOffset>=0&&contentOffset!=this.state.scroll){
      this.setState({scroll: Math.max(Math.min(contentOffset,this.state.titleWidth),0)})

    // }
  }
  handleListMomentumScrollBegin() {
    this.setState({momentum: true})
  }
  handleListMomentumScrollEnd() {
    this.setState({momentum: false})
  }
  handleListDragBegin() {
    this.setState({dragging: true})
  }
  handleListDragEnd() {
    this.setState({dragging: false})
  }
  handleListScroll(e) {
    const contentOffset = e.nativeEvent.contentOffset.x
    if(contentOffset>0&&this.state.titleShown&&(this.state.dragging||this.state.momentum)){
      this.setState({titleShown: false})
      setTimeout(()=>{this.setState({overlayNotShown: false})},150)
      this.scrollView.scrollTo({x: this.state.titleWidth, animated: true})
      // this.list.scrollTo({x:0, animated: false})
    }else if(contentOffset<=0&&!this.state.titleShown&&(this.state.dragging||this.state.momentum)){
      this.setState({titleShown: true, overlayNotShown: true})
      this.scrollView.scrollTo({x: 0, animated: true})
    }
  }
  render(){
    return (
      <View style={{height: GOALS_HEIGHT, backgroundColor: themes[this.props.theme].mainColor, borderTopWidth: 2, borderTopColor: themes[this.props.theme].goal}}>
        <ScrollView
          ref={(ref)=>{this.scrollView = ref}}
          scrollEnabled={false}
          bounces={false}
          horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={this.handleScroll}
          onMomentumScrollEnd={this.handleScrollEnd}
          scrollEventThrottle={1}>
          <View onLayout={(e)=>{this.setState({titleWidth: e.nativeEvent.layout.width})}} style={{flexDirection: 'row', zIndex: 1}}>
            <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft: 18, marginRight: 12}}>
              {this.props.fontLoaded ? (
              <Text style={{color: themes[this.props.theme].mainTitles, fontFamily: 'pt-mono-bold', fontSize: 14, textAlign: 'center'}}>GOALS</Text>
              ) : null}
              {this.props.fontLoaded ? (
              <Text style={{color: themes[this.props.theme].mainTitles, fontFamily: 'pt-mono-bold', fontSize: 14, textAlign: 'center'}}>10</Text>
              ) : null}
            </View>
            {this.props.fontLoaded ? (
              <TouchableOpacity activeOpacity={.5} onPress={()=>{LayoutAnimation.configureNext(animationConfig);this.props.creator()}} style={{alignItems:'center',justifyContent:'center',width:44,height:GOALS_HEIGHT,textAlign:'right'}}><Text style={{color: themes[this.props.theme].mainTitles,fontFamily: 'pt-mono-bold',fontSize:34}}>+</Text></TouchableOpacity>
            ) : null }
          </View>
          <List
            overflowVisible={true}
            ref={(ref)=>{this.list = ref}}
            onScroll={this.handleListScroll}
            style={[styles.goalsList, {zIndex:2, width: screenWidth-this.state.titleWidth+this.state.scroll}]}
            data={this.props.goals}
            keyExtractor={goal => goal.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            onScrollBeginDrag={this.handleListDragBegin}
            onScrollEndDrag={this.handleListDragEnd}
            onMomentumScrollBegin={this.handleListMomentumScrollBegin}
            onMomentumScrollEnd={this.handleListMomentumScrollEnd}
            renderItem={({item, index}) => (
              <Goal onPress={()=>{this.props.selectGoal(item.id)}} style={[index==0?{paddingLeft: 18}:null, index==this.props.goals.length-1?{paddingRight: 18}:null]} theme={this.props.theme} goal={item} selected={this.props.selected&&this.props.selected==item.id} fontLoaded={this.props.fontLoaded} />
            )}
            noStartOverlay={this.state.overlayNotShown}
            overlayColor={themes[this.props.theme].mainColor}
            overlaySize={35}
            emptyState="no goals yet"
            emptyStateSize={14}
            emptyStateColor="#000"
            fontLoaded={this.props.fontLoaded} />
            <View style={{width: this.state.titleWidth-this.state.scroll}}></View>
        </ScrollView>
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
    paddingBottom: 7,
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
