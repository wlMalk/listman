import React from 'react';
import { Platform, Animated, Dimensions, LayoutAnimation, ScrollView, FlatList, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import { themes } from './Themes'
import { limits, animationConfig } from './helpers'

const screenWidth = Dimensions.get('window').width;

export class Task extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollable:true,
      text: props.task.text,
      editingText: props.task.isNew,
      c: new Animated.Value(0),
      editingImportance: false,
      editingDifficulty: false,
      importance: 0,
      difficulty: 0,
      dragAction: 0,
    }
    this._interval = null

    this.handleScrollEnd = this.handleScrollEnd.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleLongPress = this.handleLongPress.bind(this)
    this.handlePressOut = this.handlePressOut.bind(this)
  }
  handleScrollEnd() {

  }
  handleScroll(e) {
    var action = e.nativeEvent.contentOffset.x==screenWidth?0:e.nativeEvent.contentOffset.x>screenWidth?1:-1;
    if(this.state.dragAction!=action){
      this.setState({dragAction: action})
    }
  }
  handleLongPress(event){
    const width = screenWidth - 18*2;
    var x = event.nativeEvent.pageX - 18;
    if(x>=width/3*2){
      this.setState({editingImportance: true, scrollable: false})
      Animated.timing(this.state.c, {toValue:100,duration:100}).start()
      this.setState({importance: Math.min(limits.importance, this.state.importance+1)})
      this._interval = setInterval(()=>{
        this.setState({importance: Math.min(limits.importance, this.state.importance+1)})
      },200)
    }else if(x<=width/3){
      Animated.timing(this.state.x, {toValue:this.props.task.recurring?0:100,duration:80}).start()
      this.props.datastore.toggleTaskRecurring(this.props.task.id)
    }else{
      this.setState({editingDifficulty: true, scrollable: false})
      Animated.timing(this.state.c, {toValue:100,duration:100}).start()
      this.setState({difficulty: Math.min(limits.difficulty, this.state.difficulty+1)})
      this._interval = setInterval(()=>{
        this.setState({difficulty: Math.min(limits.difficulty, this.state.difficulty+1)})
      },200)
    }
  }
  handlePressOut(){
    if(this.state.editingImportance){
      this.props.datastore.setTaskImportance(this.props.task.id, this.state.importance)
    }else if(this.state.editingDifficulty){
      this.props.datastore.setTaskDifficulty(this.props.task.id, this.state.difficulty)
    }
    if(this.state.editingImportance||this.state.editingDifficulty){
      LayoutAnimation.configureNext(animationConfig);
      if(this.state.editingImportance){
        this.props.datastore.setTaskImportance(this.props.task.id, this.state.importance)
      }else{
        this.props.datastore.setTaskDifficulty(this.props.task.id, this.state.difficulty)
      }
      Animated.timing(this.state.c, {toValue:0,delay:350,duration:150}).start();
      setTimeout(()=>{this.setState({scrollable: true, editingImportance: false, editingDifficulty:false, importance: 0, difficulty: 0})},500)
      if(this._interval!=null){
        clearInterval(this._interval)
      }
    }
  }
  render() {
    const items = [this.state.editingImportance?this.state.importance:this.props.task.importance,"fd","fd"];

    var color = this.state.c.interpolate({
        inputRange: [0,100],
        outputRange: [this.props.color, this.props.highlightColor]
    });

    return (
      <View style={!this.props.last?{marginBottom: 5}:null}>
        <ScrollView
        onContentSizeChange={()=>{if(Platform.OS==="android"){this.scrollView.scrollTo({x:screenWidth, animated: false})}}}
        style={{zIndex: 2}}
        bounces={false}
        overScrollMode='never'
        scrollEnabled={!this.state.editingText&&this.state.scrollable}
        onMomentumScrollEnd={this.handleScrollEnd}
        pagingEnabled={true}
        contentOffset={{x:screenWidth}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={ 1 }
        onScroll={this.handleScroll}
        ref={(ref)=>{this.scrollView=ref}}>
          <View style={styles.taskPlaceholder}></View>
          <TouchableWithoutFeedback onLongPress={this.handleLongPress} onPressOut={this.handlePressOut}>
            <View style={styles.taskContainer}>
              <Animated.View style={[this.props.style, styles.task, {backgroundColor: color}, this.props.borderColor?{borderColor: this.props.borderColor}:null]}>
                <View style={styles.taskHeader}>
                  {this.props.showDayIndicators&&this.props.task.scheduledForToday?(<View style={[styles.taskDayIndicator, {backgroundColor: themes[this.props.theme].taskTodayIndicator}]}></View>):null}
                  {this.props.showDayIndicators&&this.props.task.scheduledForTomorrow?(<View style={[styles.taskDayIndicator, {backgroundColor: themes[this.props.theme].taskTomorrowIndicator}]}></View>):null}
                </View>
                {this.props.fontLoaded ? (
                <Text style={[styles.taskText, {color: this.props.textColor}, this.props.textFontSize?{fontSize: this.props.textFontSize}:null, this.props.verticalSpace?{marginTop:this.props.verticalSpace,marginBottom:this.props.verticalSpace}:null]}>{this.props.task.text.toUpperCase()}</Text>
                ) : null}
                {this.props.task.goals.length>0 ? (
                <TaskGoals color={this.props.goalColor} textColor={this.props.goalTextColor} goals={this.props.task.goals} selectGoal={this.props.selectGoal} fontLoaded={this.props.fontLoaded} />
                ) : null}
                <TaskFooter items={items} itemColor={this.props.footerItemColor} separatorColor={this.props.footerSeparatorColor} itemSize={this.props.footerItemSize} fontLoaded={this.props.fontLoaded} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.taskPlaceholder}></View>
        </ScrollView>
        <View style={[styles.taskUnderLayer, {backgroundColor: this.state.dragAction==1?this.props.rightColor:this.state.dragAction==-1?this.props.leftColor:"transparent"}]}>
          {this.props.fontLoaded ? (
          <Text style={[styles.actionText, {color: this.state.dragAction==1?this.props.rightTextColor:this.state.dragAction==-1?this.props.leftTextColor:"transparent"}, {textAlign: this.state.dragAction==1?"right":this.state.dragAction==-1?"left":"center"}]}>
            {this.state.dragAction==1?this.props.rightText.toUpperCase():this.state.dragAction==-1?this.props.leftText.toUpperCase():""}
          </Text>
          ) : null}
        </View>
      </View>
    )
  }
}

class TaskGoals extends React.Component {
  render() {
    return (
      <View style={styles.taskGoalsList}>
        {this.props.fontLoaded?(
        <View style={{flexWrap:'wrap', flexDirection:'row', alignSelf: 'flex-start'}}>
          {this.props.goals.map((goal, i)=>(<TouchableOpacity style={[styles.taskGoal, {backgroundColor: this.props.color}]} key={goal.id} activeOpacity={.5} onPress={()=>{this.props.selectGoal(goal.id)}}><Text style={[styles.taskGoalText, {color: this.props.textColor}]}>{goal.name.toUpperCase()}</Text></TouchableOpacity>))}
        </View>
        ):null}
      </View>
    )
  }
}

class TaskFooter extends React.Component {
  render() {
    var items = []
    if(this.props.fontLoaded){
      for(var i=0; i<this.props.items.length; i++){
        if(this.props.items[i]==null){
          continue
        }
        items.push(
          typeof this.props.items[i]=="string"||typeof this.props.items[i]=="number"?(
          <Text key={i} style={[styles.taskFooterText, {color: this.props.itemColor}, this.props.itemSize?{fontSize: this.props.itemSize}:null]}>
            {typeof this.props.items[i]=="string"?this.props.items[i].toUpperCase():this.props.items[i]}
          </Text>):this.props.items[i])
        if(i<this.props.items.length-1){
          items.push(<View key={"s"+i} style={[styles.taskFooterSeparator, {backgroundColor: this.props.separatorColor}]}></View>)
        }
      }
    }
    return (
      <View style={styles.taskFooter}>
      {items}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  taskContainer: {
    width: screenWidth,
    paddingLeft: 18,
    paddingRight: 18,
  },
  task: {
    width: screenWidth-18*2,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  taskText: {
    fontFamily: 'pt-mono-bold',
    fontSize: 20,
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 5,
  },
  taskGoalsList: {
    marginBottom: 6,
    marginTop: 10,
  },
  taskGoal: {
    borderRadius: 5,
    height: 28,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 4,
    marginRight: 4,
    justifyContent: 'center',
  },
  taskGoalText: {
    fontSize: 12,
    fontFamily: 'pt-mono-bold',
  },
  actionText: {
    fontFamily: 'pt-mono-bold',
    fontSize: 20,
  },
  taskUnderLayer: {
    borderRadius: 8,
    position: 'absolute',
    left: 18,
    width: screenWidth-18*2,
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
  taskPlaceholder: {
    width: screenWidth,
    height: '100%',
  },
  taskHeader: {
    flexDirection: 'row',
    height: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  taskFooter: {
    flexDirection: 'row',
    height: 10,
    alignItems: 'center',
  },
  taskDayIndicator: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginRight: 3,
  },
  taskFooterText: {
    fontFamily: 'pt-mono-bold',
    fontSize: 10,
  },
  taskFooterSeparator: {
    width: 4,
    height: 4,
    borderRadius: 4,
    marginRight: 3,
    marginLeft: 3,
  },
});

export class TasksList extends React.Component {}
export class TodayTask extends Task {}
export class TomorrowTask extends Task {}
export class GoalTask extends Task {}
export class NowTask extends Task {}
export class TodoTask extends Task {}

class TasksShade extends React.Component {
  render() {
    return (
      <View style={[{position:'absolute',height:10,width:screenWidth,zIndex:999,overflow:'visible'},!this.props.bottom?{top:0}:{bottom:0}]}>
        <View style={{
          position:'absolute',
          height:15,
          width:screenWidth,
          shadowColor: this.props.color,
          shadowOffset: {width:0,height:!this.props.bottom?10:-10},
          shadowOpacity: 0.25,
          shadowRadius: 10,
          backgroundColor: this.props.color,
        }}></View>
        <View style={{
          position:'absolute',
          height:15,
          width:screenWidth,
          shadowColor: this.props.color,
          shadowOffset: {width:0,height:!this.props.bottom?6:-6},
          shadowOpacity: 1,
          shadowRadius: 2,
          backgroundColor: this.props.color,
        }}></View>
        <View style={{
          position:'absolute',
          height:15,
          width:screenWidth,
          shadowColor: this.props.color,
          shadowOffset: {width:0,height:!this.props.bottom?10:-10},
          shadowOpacity: 0.4,
          shadowRadius: 6,
          backgroundColor: this.props.color,
        }}></View>
      </View>
    )
  }
}
