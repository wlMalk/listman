import React from 'react';
import { Platform, Animated, Dimensions, LayoutAnimation, ScrollView, FlatList, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import { List } from './List';

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

    var action = 0;
    if(this.props.rightEnabled&&this.props.leftEnabled){
      action = e.nativeEvent.contentOffset.x==screenWidth?0:(e.nativeEvent.contentOffset.x>screenWidth?1:-1);
    }else if(this.props.rightEnabled){
      action = e.nativeEvent.contentOffset.x==0?0:e.nativeEvent.contentOffset.x>0?1:-1;
    }else if(this.props.leftEnabled){
      action = e.nativeEvent.contentOffset.x==screenWidth?0:(e.nativeEvent.contentOffset.x>screenWidth?1:-1);
    }

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
  static formatDuration(d) {
    var mins = d*15
    var hrs = parseInt(mins/60)
    mins = mins - hrs*60
    var fmt = ""
    if(hrs>0) {
      fmt += hrs+"H"
    }
    if(mins>0) {
      fmt += mins+"M"
    }
    return fmt==""?null:fmt
  }
  render() {
    const items = [this.state.editingImportance?this.state.importance:this.props.task.importance,this.state.editingDifficulty?Task.formatDuration(this.state.difficulty):Task.formatDuration(this.props.task.difficulty)];

    var color = this.state.c.interpolate({
        inputRange: [0,100],
        outputRange: [this.props.color, this.props.highlightColor]
    });

    var rightEnabled = this.props.rightEnabled
    var leftEnabled = this.props.leftEnabled

    return (
      <View style={[this.props.style, !this.props.last?{marginBottom: 5}:null]}>
        <ScrollView
        onContentSizeChange={()=>{if(Platform.OS==="android"){this.scrollView.scrollTo({x:screenWidth, animated: false})}}}
        style={{zIndex: 2}}
        overScrollMode='never'
        scrollEnabled={!this.state.editingText&&this.state.scrollable}
        onMomentumScrollEnd={this.handleScrollEnd}
        pagingEnabled={true}
        contentOffset={{x:this.props.leftEnabled?screenWidth:0}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={ 1 }
        onScroll={this.handleScroll}
        ref={(ref)=>{this.scrollView=ref}}>
          {this.props.leftEnabled?(
          <View style={styles.taskPlaceholder}></View>
          ):null}
          <TouchableWithoutFeedback onLongPress={this.handleLongPress} onPressOut={this.handlePressOut}>
            <View style={styles.taskContainer}>
              <Animated.View style={[this.props.style, styles.task, {backgroundColor: color}, this.props.borderColor?{borderColor: this.props.borderColor}:null]}>
                <View style={styles.taskHeader}>
                  {this.props.showDayIndicators&&this.props.task.scheduledForToday?(<View style={[styles.taskDayIndicator, {backgroundColor: themes[this.props.theme].taskTodayIndicator}]}></View>):null}
                  {this.props.showDayIndicators&&this.props.task.scheduledForTomorrow?(<View style={[styles.taskDayIndicator, {backgroundColor: themes[this.props.theme].taskTomorrowIndicator}]}></View>):null}
                </View>
                {this.props.fontLoaded ? (
                <Text style={[styles.taskText, {color: this.props.textColor}, this.props.textFontSize?{fontSize: this.props.textFontSize}:null, this.props.verticalSpace?{marginTop:this.props.verticalSpace,marginBottom:this.props.task.goals.length==0?this.props.verticalSpace+15:this.props.verticalSpace}:null]}>{this.props.task.text.toUpperCase()}</Text>
                ) : null}
                {this.props.task.goals.length>0 ? (
                <TaskGoals color={this.props.goalColor} textColor={this.props.goalTextColor} goals={this.props.task.goals} selectGoal={this.props.selectGoal} fontLoaded={this.props.fontLoaded} />
                ) : null}
                <TaskFooter items={items} itemColor={this.props.footerItemColor} separatorColor={this.props.footerSeparatorColor} itemSize={this.props.footerItemSize} fontLoaded={this.props.fontLoaded} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
          {this.props.rightEnabled?(
          <View style={styles.taskPlaceholder}></View>
          ) : null}
        </ScrollView>
        <View style={[styles.taskUnderLayer, {backgroundColor: this.state.dragAction==1&&this.props.rightEnabled?this.props.rightColor:this.state.dragAction==-1&&this.props.leftEnabled?this.props.leftColor:"transparent"}, {borderColor: this.state.dragAction==1&&this.props.rightEnabled?this.props.rightBorderColor:this.state.dragAction==-1&&this.props.leftEnabled?this.props.leftBorderColor:"transparent"}]}>
          {this.props.fontLoaded ? (
          <Text style={[styles.actionText, {color: this.state.dragAction==1&&this.props.rightEnabled?this.props.rightTextColor:this.state.dragAction==-1&&this.props.leftEnabled?this.props.leftTextColor:"transparent"}, {textAlign: this.state.dragAction==1&&this.props.rightEnabled?"right":this.state.dragAction==-1&&this.props.leftEnabled?"left":"center"}]}>
            {this.state.dragAction==1&&this.props.rightEnabled?this.props.rightText.toUpperCase():this.state.dragAction==-1&&this.props.leftEnabled?this.props.leftText.toUpperCase():""}
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
    var nonNulls = this.props.items.filter((item)=>item!=null)
    var items = []
    if(this.props.fontLoaded){
      for(var i=0; i<nonNulls.length; i++){
        items.push(
          typeof nonNulls[i]=="string"||typeof nonNulls[i]=="number"?(
          <Text key={i} style={[styles.taskFooterText, {color: this.props.itemColor}, this.props.itemSize?{fontSize: this.props.itemSize}:null]}>
            {typeof nonNulls[i]=="string"?nonNulls[i].toUpperCase():nonNulls[i]}
          </Text>):nonNulls[i])
        if(i<nonNulls.length-1){
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
    borderWidth: 2,
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

export class TasksList extends React.Component {
  render() {
    return (
      <List
        style={{flex: 1}}
        scrollEnabled={this.props.scrollEnabled}
        data={this.props.tasks}
        keyExtractor={task => task.id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        startOffset={this.props.startOffset?this.props.startOffset:12}
        endOffset={this.props.endOffset?this.props.endOffset:12}
        renderItem={this.props.renderItem}
        overlayColor={this.props.overlayColor}
        overlaySize={this.props.overlaySize?this.props.overlaySize:12}
        emptyState={this.props.emptyState}
        emptyStateSize={14}
        emptyStateColor={this.props.emptyStateColor}
        fontLoaded={this.props.fontLoaded} />
    )
  }
}

export class TodayTask extends Task {
  render() {
    return (
      <Task
        task={this.props.task}
        showDayIndicators={false}
        verticalSpace={5}
        color={themes[this.props.theme].todayTasks[this.props.index]}
        borderColor={themes[this.props.theme].todayTasksHighlight[this.props.index]}
        highlightColor={themes[this.props.theme].todayTasksHighlight[this.props.index]}
        textColor={themes[this.props.theme].todayTasksText[this.props.index]}
        textFontSize={30}
        rightText={this.props.rightText?this.props.rightText:"Tomorrow"}
        leftText={this.props.leftText?this.props.leftText:"Completed"}
        rightColor={themes[this.props.theme].tomorrowColor}
        leftColor={themes[this.props.theme].todayColor}
        rightBorderColor={themes[this.props.theme].tomorrowAccent}
        leftBorderColor={themes[this.props.theme].todayColor}
        rightTextColor={themes[this.props.theme].tomorrowAccent}
        leftTextColor={themes[this.props.theme].todayAccent}
        footerItemColor={themes[this.props.theme].todayTasksText[this.props.index]}
        footerItemSize={10}
        footerSeparatorColor={themes[this.props.theme].todayTasksHighlight[this.props.index]}
        goalColor={themes[this.props.theme].todayTasksText[this.props.index]}
        goalTextColor={"#fff"}
        rightAction={this.props.rightAction}
        leftAction={this.props.leftAction}
        selectGoal={this.props.selectGoal}
        theme={this.props.theme}
        datastore={this.props.datastore}
        fontLoaded={this.props.fontLoaded} />
    )
  }
}

export class TomorrowTask extends Task {
  render() {
    return (
      <Task
        task={this.props.task}
        showDayIndicators={false}
        verticalSpace={5}
        color={themes[this.props.theme].tomorrowTasks[this.props.index]}
        borderColor={themes[this.props.theme].tomorrowTasksHighlight[this.props.index]}
        highlightColor={themes[this.props.theme].tomorrowTasksHighlight[this.props.index]}
        textColor={themes[this.props.theme].tomorrowTasksText[this.props.index]}
        textFontSize={30}
        rightText={this.props.rightText?this.props.rightText:"Later"}
        leftText={this.props.leftText?this.props.leftText:"Today"}
        rightColor={themes[this.props.theme].mainColor}
        leftColor={themes[this.props.theme].todayColor}
        rightBorderColor={themes[this.props.theme].mainTitles}
        leftBorderColor={themes[this.props.theme].todayAccent}
        rightTextColor={themes[this.props.theme].mainTitles}
        leftTextColor={themes[this.props.theme].todayAccent}
        footerItemColor={themes[this.props.theme].tomorrowTasksText[this.props.index]}
        footerItemSize={10}
        footerSeparatorColor={themes[this.props.theme].tomorrowTasksHighlight[this.props.index]}
        goalColor={themes[this.props.theme].tomorrowTasksText[this.props.index]}
        goalTextColor={"#fff"}
        rightAction={this.props.rightAction}
        leftAction={this.props.leftAction}
        selectGoal={this.props.selectGoal}
        theme={this.props.theme}
        datastore={this.props.datastore}
        fontLoaded={this.props.fontLoaded} />
    )
  }
}

export class GoalTask extends Task {}

export class NowTask extends Task {
  leftEnabled() {
    return true
  }
  rightEnabled() {
    return true
  }
  render() {
    return (
      <View style={{flex:1, paddingTop: 12, justifyContent: 'center'}}>
        <Task
          leftEnabled={this.leftEnabled()}
          rightEnabled={this.rightEnabled()}
          task={this.props.task}
          showDayIndicators={false}
          verticalSpace={5}
          color={themes[this.props.theme].todayTasks[0]}
          borderColor={themes[this.props.theme].todayTasksHighlight[0]}
          highlightColor={themes[this.props.theme].todayTasksHighlight[0]}
          textColor={themes[this.props.theme].todayTasksText[0]}
          textFontSize={30}
          rightText={this.props.rightText?this.props.rightText:"Tomorrow"}
          leftText={this.props.leftText?this.props.leftText:"Completed"}
          rightColor={themes[this.props.theme].tomorrowColor}
          leftColor={themes[this.props.theme].todayColor}
          rightBorderColor={themes[this.props.theme].tomorrowAccent}
          leftBorderColor={themes[this.props.theme].todayColor}
          rightTextColor={themes[this.props.theme].tomorrowAccent}
          leftTextColor={themes[this.props.theme].todayAccent}
          footerItemColor={themes[this.props.theme].todayTasksText[0]}
          footerItemSize={10}
          footerSeparatorColor={themes[this.props.theme].todayTasksHighlight[0]}
          goalColor={themes[this.props.theme].todayTasksText[0]}
          goalTextColor={"#fff"}
          rightAction={this.props.rightAction}
          leftAction={this.props.leftAction}
          selectGoal={this.props.selectGoal}
          theme={this.props.theme}
          datastore={this.props.datastore}
          fontLoaded={this.props.fontLoaded} />
      </View>
    )
  }
}

export class TodoTask extends Task {
  render() {
    return (
      <Task
        task={this.props.task}
        showDayIndicators={true}
        verticalSpace={5}
        color={themes[this.props.theme].mainTasksColor}
        highlightColor={themes[this.props.theme].mainTasksHighlightColor}
        textColor={themes[this.props.theme].mainTasksTextColor}
        borderColor={themes[this.props.theme].mainTasksBorderColor}
        textFontSize={30}
        rightText={this.props.rightText?this.props.rightText:"Tomorrow"}
        leftText={this.props.leftText?this.props.leftText:"Today"}
        rightColor={themes[this.props.theme].tomorrowColor}
        leftColor={themes[this.props.theme].todayColor}
        rightBorderColor={themes[this.props.theme].tomorrowAccent}
        leftBorderColor={themes[this.props.theme].todayAccent}
        rightTextColor={themes[this.props.theme].tomorrowAccent}
        leftTextColor={themes[this.props.theme].todayAccent}
        footerItemColor="#000"
        footerItemSize={10}
        footerSeparatorColor="#aaa"
        goalColor={themes[this.props.theme].mainTasksTextColor}
        goalTextColor={"#fff"}
        rightAction={this.props.rightAction}
        leftAction={this.props.leftAction}
        selectGoal={this.props.selectGoal}
        theme={this.props.theme}
        datastore={this.props.datastore}
        fontLoaded={this.props.fontLoaded} />
    )
  }
}
