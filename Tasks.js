import React from 'react';
import { TextInput, Platform, Animated, Dimensions, LayoutAnimation, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import { List } from './List';

import { themes } from './Themes'
import { limits, animationConfig } from './helpers'

const screenWidth = Dimensions.get('window').width;
const importanceFormats = ["Not Important","Slightly Important","Important","Fairly Important","Very Important"]

export class Task extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollable:true,
      scrolling: false,
      text: props.task.text,
      isEditing: props.task.isNew,
      c: new Animated.Value(0),
      editingImportance: false,
      editingDuration: false,
      importance: 0,
      duration: 0,
      dragAction: 0,
    }
    this._interval = null

    this.handleScrollBegin = this.handleScrollBegin.bind(this)
    this.handleScrollEnd = this.handleScrollEnd.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleLongPress = this.handleLongPress.bind(this)
    this.handlePress = this.handlePress.bind(this)
    this.handlePressOut = this.handlePressOut.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
  }
  handleScrollEnd(e) {
    var action = this.getAction(e)
    if(action==-1||action==1){
      this.setState({scrollable: false})
      setTimeout(()=>{
        this.setState({scrolling: false})
        LayoutAnimation.configureNext(animationConfig);
        if(action==-1){
          this.props.leftAction(this.props.task)
        }else if(action==1){
          this.props.rightAction(this.props.task)
        }
      },30)
    }else if(this.state.dragAction!=0){
      this.setState({dragAction: 0})
    }
  }
  handleScrollBegin() {
    this.setState({scrolling: true})
  }
  getAction(e){
    var action = 0;
    if(this.props.rightEnabled&&this.props.leftEnabled){
      action = e.nativeEvent.contentOffset.x==screenWidth?0:(e.nativeEvent.contentOffset.x>screenWidth?1:-1);
    }else if(this.props.rightEnabled){
      action = e.nativeEvent.contentOffset.x==0?0:e.nativeEvent.contentOffset.x>0?1:-1;
    }else if(this.props.leftEnabled){
      action = e.nativeEvent.contentOffset.x==screenWidth?0:(e.nativeEvent.contentOffset.x>screenWidth?1:-1);
    }
    return action
  }
  handleScroll(e) {
    var action = this.getAction(e)

    if(this.state.dragAction!=action){
      this.setState({dragAction: action})
    }
  }
  handleBlur(){
    this.setState({isEditing: false})
  }
  handleTextChange(text){
    if(text.length<=limits.textLength){
      this.setState({text:text})
    }
  }
  handleLongPress(event){
    if(!this.props.task.isNew){
      const width = screenWidth - 18*2;
      var x = event.nativeEvent.pageX - 18;
      LayoutAnimation.configureNext(animationConfig);
      if(x>=width/3*2){
        this.setState({editingImportance: true, scrollable: false})
        Animated.timing(this.state.c, {toValue:100,duration:100}).start()
        this._interval = setInterval(()=>{
          this.setState({importance: Math.min(importanceFormats.length-1, this.state.importance+1)})
        },400)
      }else if(x<=width/3){
        Animated.timing(this.state.x, {toValue:this.props.task.recurring?0:100,duration:80}).start()
        this.props.store.toggleTaskRecurring(this.props.task.id)
      }else{
        this.setState({editingDuration: true, scrollable: false, duration: Math.min(limits.duration, this.state.duration+1)})
        Animated.timing(this.state.c, {toValue:100,duration:100}).start()
        this._interval = setInterval(()=>{
          this.setState({duration: Math.min(limits.duration, this.state.duration+1)})
        },200)
      }
    }
  }
  handlePress(){
    LayoutAnimation.configureNext(animationConfig);
    this.setState({isEditing: true})
  }
  handlePressOut(){
    if(!this.props.task.isNew){
      if(this.state.editingImportance||this.state.editingDuration){
        LayoutAnimation.configureNext(animationConfig);
        if(this.state.editingImportance){
          this.props.store.setTaskImportance(this.props.task, this.state.importance)
        }else{
          this.props.store.setTaskDuration(this.props.task, this.state.duration)
        }
        Animated.timing(this.state.c, {toValue:0,delay:350,duration:150}).start();
        setTimeout(()=>{this.setState({scrollable: true, editingImportance: false, editingDuration:false, importance: 0, duration: 0})},500)
        if(this._interval!=null){
          clearInterval(this._interval)
        }
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
  static formatImportance(i){
    if(i>=importanceFormats.length||i<0){
      return ""
    }
    return importanceFormats[i]
  }
  render() {
    const footerItems = [];
    footerItems.push(this.state.editingImportance?"Importance "+(this.state.importance+1):Task.formatImportance(this.props.task.importance))
    if(this.state.editingDuration||this.props.task.duration!=null){
      footerItems.push(this.state.editingDuration?Task.formatDuration(this.state.duration):Task.formatDuration(this.props.task.duration))
    }

    var color = this.state.c.interpolate({
        inputRange: [0,100],
        outputRange: [this.props.color, this.props.highlightColor]
    });

    var rightEnabled = this.props.rightEnabled
    var leftEnabled = this.props.leftEnabled

    return (
      <View style={[this.props.style, !this.props.last&&!this.props.fullWidth?{marginBottom: 10}:null]}>
        <ScrollView
        onContentSizeChange={()=>{this.scrollView.scrollTo({x:leftEnabled?screenWidth:0, animated: false})}}
        style={{zIndex: 2, overflow: this.props.shadow?'visible':'hidden'}}
        overScrollMode='never'
        scrollEnabled={!this.state.editingText&&this.state.scrollable&&this.props.scrollable}
        onScrollBeginDrag={this.handleScrollBegin}
        onMomentumScrollEnd={this.handleScrollEnd}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={ 1 }
        onScroll={this.handleScroll}
        ref={(ref)=>{this.scrollView=ref}}>
          {this.props.leftEnabled?(
          <View style={styles.taskPlaceholder}></View>
          ):null}
          <TouchableWithoutFeedback onLongPress={this.handleLongPress} onPress={this.handlePress} onPressOut={this.handlePressOut}>
            <View style={[styles.taskContainer, this.props.fullWidth?styles.taskContainerFullWidth:null]}>
              {!this.state.isEditing ? (
              <Animated.View style={[this.props.style, styles.task, this.props.shadow?styles.taskShadow:null, (this.props.fullWidth&&this.props.index>0)?{borderTopWidth: 0}:null, (this.props.fullWidth&&this.state.scrolling&&!this.props.last)?{borderBottomWidth: 0}:null, this.props.fullWidth?styles.taskFullWidth:null, {backgroundColor: color}, this.props.borderColor?{borderColor: this.props.borderColor}:null]}>
                {this.props.showDayIndicators&&this.props.task.scheduledForToday&&this.props.task.scheduledForTomorrow?(
                <View style={styles.taskHeader}>
                  {this.props.task.scheduledForToday?(<View style={[styles.taskDayIndicator, {backgroundColor: themes[this.props.theme].taskTodayIndicator}]}></View>):null}
                  {this.props.task.scheduledForTomorrow?(<View style={[styles.taskDayIndicator, {backgroundColor: themes[this.props.theme].taskTomorrowIndicator}]}></View>):null}
                </View>
                ):null}
                {this.props.fontLoaded ? (
                <Text style={[styles.taskText, {color: this.props.textColor}, this.props.textFontSize?{fontSize: this.props.textFontSize}:null, this.props.verticalSpace?{marginTop:this.props.verticalSpace,marginBottom:this.props.task.goals.length==0?(footerItems.length==0?this.props.verticalSpace+(this.props.fullWidth?5:17):6):this.props.verticalSpace}:null, !this.props.showDayIndicators?{marginTop:10}:null]}>{this.props.task.text.toUpperCase()}</Text>
                ) : null}
                {this.props.task.goals.length>0 ? (
                <TaskGoals style={footerItems.length==0?{marginBottom:17}:null} color={this.props.goalColor} textColor={this.props.goalTextColor} goals={this.props.task.goals} selectGoal={this.props.selectGoal} fontLoaded={this.props.fontLoaded} />
                ) : null}
                <TaskFooter items={footerItems} itemColor={this.props.footerItemColor} separatorColor={this.props.footerSeparatorColor} itemSize={this.props.footerItemSize} fontLoaded={this.props.fontLoaded} />
              </Animated.View>):(
              <TaskForm
                textFontSize={this.props.textFontSize}
                onBlur={this.handleBlur}
                onChangeText={this.handleTextChange}
                color={this.props.highlightColor}
                borderColor={this.props.borderColor}
                text={this.state.text}
                textColor={this.props.textColor}
                selectionColor={this.props.footerItemColor} />
              )}
            </View>
          </TouchableWithoutFeedback>
          {this.props.rightEnabled?(
          <View style={styles.taskPlaceholder}></View>
          ) : null}
        </ScrollView>
        {!this.state.isEditing ? (
        <View style={[styles.taskUnderLayer, this.props.fullWidth?styles.taskUnderLayerFullWidth:null, {backgroundColor: this.state.dragAction==1&&this.props.rightEnabled?this.props.rightColor:this.state.dragAction==-1&&this.props.leftEnabled?this.props.leftColor:"transparent"}, {borderColor: this.state.dragAction==1&&this.props.rightEnabled?this.props.rightBorderColor:this.state.dragAction==-1&&this.props.leftEnabled?this.props.leftBorderColor:"transparent"}, this.props.fullWidth&&this.props.last?{borderBottomWidth: 2}:null]}>
          {this.props.fontLoaded ? (
          <Text style={[styles.actionText, {color: this.state.dragAction==1&&this.props.rightEnabled?this.props.rightTextColor:this.state.dragAction==-1&&this.props.leftEnabled?this.props.leftTextColor:"transparent"}, {textAlign: this.state.dragAction==1&&this.props.rightEnabled?"right":this.state.dragAction==-1&&this.props.leftEnabled?"left":"center"}]}>
            {this.state.dragAction==1&&this.props.rightEnabled?this.props.rightText.toUpperCase():this.state.dragAction==-1&&this.props.leftEnabled?this.props.leftText.toUpperCase():""}
          </Text>
          ) : null}
        </View>
        ) : null}
        {this.props.fullWidth&&this.state.scrolling&&!this.props.last&&this.props.borderColor?(
          <View style={{height:2, width: screenWidth, backgroundColor: this.props.borderColor}}></View>
        ):null}
      </View>
    )
  }
}

class TaskForm extends React.Component {
  render() {
    return (
      <View style={[styles.taskForm, this.props.style, this.props.shadow?styles.taskShadow:null, (this.props.fullWidth&&this.props.index>0)?{borderTopWidth: 0}:null, (this.props.fullWidth&&this.state.scrolling&&!this.props.last)?{borderBottomWidth: 0}:null, this.props.fullWidth?styles.taskFullWidth:null, {backgroundColor: this.props.color}, this.props.borderColor?{borderColor: this.props.borderColor}:null]}>
        <TextInput
          onBlur={this.props.onBlur}
          onChangeText={this.props.onChangeText}
          maxLength={limits.textLength}
          autoCapitalize={'characters'}
          enablesReturnKeyAutomatically={true}
          spellCheck={false}
          autoFocus={true}
          autoCorrect={false}
          selectTextOnFocus={true}
          returnKeyType="done"
          selectionColor={this.props.selectionColor}
          multiline={true}
          style={[styles.textInput, this.props.textFontSize?{fontSize: this.props.textFontSize}:null, {color: this.props.textColor}, {paddingTop: 14, paddingLeft: 16, paddingRight: 16, paddingBottom: 27}]}
          value={this.props.text.toUpperCase()} />
      </View>
    )
  }
}

class TaskGoals extends React.Component {
  render() {
    return (
      <View style={[styles.taskGoalsList, this.props.style]}>
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

export class TasksList extends React.Component {
  scrollTo(y, animated) {
    this.list.scrollTo({y: y, animated: animated})
  }
  scrollToEnd(animated) {
    this.list.scrollToEnd({animated: animated})
  }
  render() {
    return (
      <List
        ref={(ref) => {this.list = ref}}
        style={{flex: 1}}
        startOverScrollColor={this.props.startOverScrollColor}
        scrollEnabled={this.props.scrollEnabled}
        data={this.props.tasks}
        keyExtractor={task => task.id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        startOffset={this.props.startOffset}
        endOffset={this.props.endOffset}
        renderItem={this.props.renderItem}
        overlayColor={this.props.overlayColor}
        overlaySize={this.props.overlaySize?this.props.overlaySize:12}
        emptyState={this.props.emptyState}
        emptyStateSize={14}
        emptyStateColor={this.props.emptyStateColor}
        noStartOverlay={this.props.noStartOverlay}
        noEndOverlay={this.props.noEndOverlay}
        fontLoaded={this.props.fontLoaded} />
    )
  }
}

export class TodayTask extends Task {
  leftEnabled() {
    return true
  }
  rightEnabled() {
    return true
  }
  render() {
    return (
      <Task
        shadow={true}
        scrollable={this.props.scrollable}
        index={this.props.index}
        last={this.props.last}
        leftEnabled={this.leftEnabled()}
        rightEnabled={this.rightEnabled()}
        task={this.props.task}
        showDayIndicators={false}
        verticalSpace={5}
        color={themes[this.props.theme].todayTasks[this.props.index]}
        borderColor={themes[this.props.theme].todayTasksBorder[this.props.index]}
        highlightColor={themes[this.props.theme].todayTasksHighlight[this.props.index]}
        textColor={themes[this.props.theme].todayTasksText[this.props.index]}
        textFontSize={24}
        rightText={this.props.rightText?this.props.rightText:"Tomorrow"}
        leftText={this.props.leftText?this.props.leftText:"Completed"}
        rightColor={themes[this.props.theme].todayColor}
        leftColor={themes[this.props.theme].todayColor}
        rightBorderColor={themes[this.props.theme].todayColor}
        leftBorderColor={themes[this.props.theme].todayColor}
        rightTextColor={themes[this.props.theme].todaySecondary}
        leftTextColor={themes[this.props.theme].todayAccent}
        footerItemColor={themes[this.props.theme].todayTasksTextSecondary[this.props.index]}
        footerItemSize={10}
        footerSeparatorColor={themes[this.props.theme].todayTasksTextSecondary[this.props.index]}
        goalColor={themes[this.props.theme].todayTasksTextSecondary[this.props.index]}
        goalTextColor={"#fff"}
        rightAction={this.props.rightAction}
        leftAction={this.props.leftAction}
        selectGoal={this.props.selectGoal}
        theme={this.props.theme}
        store={this.props.store}
        fontLoaded={this.props.fontLoaded} />
    )
  }
}

export class TomorrowTask extends Task {
  leftEnabled() {
    return true
  }
  rightEnabled() {
    return true
  }
  render() {
    return (
      <Task
        shadow={true}
        scrollable={this.props.scrollable}
        index={this.props.index}
        last={this.props.last}
        leftEnabled={this.leftEnabled()}
        rightEnabled={this.rightEnabled()}
        task={this.props.task}
        showDayIndicators={false}
        verticalSpace={5}
        color={themes[this.props.theme].tomorrowTasks[this.props.index]}
        borderColor={themes[this.props.theme].tomorrowTasksBorder[this.props.index]}
        highlightColor={themes[this.props.theme].tomorrowTasksHighlight[this.props.index]}
        textColor={themes[this.props.theme].tomorrowTasksText[this.props.index]}
        textFontSize={24}
        rightText={this.props.rightText?this.props.rightText:"Later"}
        leftText={this.props.leftText?this.props.leftText:"Today"}
        rightColor={themes[this.props.theme].tomorrowColor}
        leftColor={themes[this.props.theme].tomorrowColor}
        rightBorderColor={themes[this.props.theme].tomorrowColor}
        leftBorderColor={themes[this.props.theme].tomorrowColor}
        rightTextColor={themes[this.props.theme].tomorrowSecondary}
        leftTextColor={themes[this.props.theme].tomorrowAccent}
        footerItemColor={themes[this.props.theme].tomorrowTasksTextSecondary[this.props.index]}
        footerItemSize={10}
        footerSeparatorColor={themes[this.props.theme].tomorrowTasksText[this.props.index]}
        goalColor={themes[this.props.theme].tomorrowTasksTextSecondary[this.props.index]}
        goalTextColor={"#fff"}
        rightAction={this.props.rightAction}
        leftAction={this.props.leftAction}
        selectGoal={this.props.selectGoal}
        theme={this.props.theme}
        store={this.props.store}
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
      <View style={{height: '100%'}}>
        <View style={{flex:1, justifyContent: 'center'}}>
          <Task
            shadow={true}
            scrollable={this.props.scrollable}
            index={0}
            last={false}
            leftEnabled={this.leftEnabled()}
            rightEnabled={this.rightEnabled()}
            task={this.props.task}
            showDayIndicators={false}
            verticalSpace={5}
            color={themes[this.props.theme].todayTasks[0]}
            borderColor={themes[this.props.theme].todayTasksBorder[0]}
            highlightColor={themes[this.props.theme].todayTasksHighlight[0]}
            textColor={themes[this.props.theme].todayTasksText[0]}
            textFontSize={24}
            rightText={this.props.rightText?this.props.rightText:"Tomorrow"}
            leftText={this.props.leftText?this.props.leftText:"Completed"}
            rightColor={themes[this.props.theme].todayColor}
            leftColor={themes[this.props.theme].todayColor}
            rightBorderColor={themes[this.props.theme].todayColor}
            leftBorderColor={themes[this.props.theme].todayColor}
            rightTextColor={themes[this.props.theme].todaySecondary}
            leftTextColor={themes[this.props.theme].todayAccent}
            footerItemColor={themes[this.props.theme].todayTasksTextSecondary[0]}
            footerItemSize={10}
            footerSeparatorColor={themes[this.props.theme].todayTasksText[0]}
            goalColor={themes[this.props.theme].todayTasksTextSecondary[0]}
            goalTextColor={"#fff"}
            rightAction={this.props.rightAction}
            leftAction={this.props.leftAction}
            selectGoal={this.props.selectGoal}
            theme={this.props.theme}
            store={this.props.store}
            fontLoaded={this.props.fontLoaded} />
          </View>
          <View style={{height: 60}}></View>
        </View>
    )
  }
}

export class TodoTask extends Task {
  leftEnabled() {
    return true
  }
  rightEnabled() {
    return true
  }
  render() {
    return (
      <Task
        scrollable={this.props.scrollable}
        index={this.props.index}
        last={this.props.last}
        leftEnabled={this.leftEnabled()}
        rightEnabled={this.rightEnabled()}
        task={this.props.task}
        showDayIndicators={true}
        verticalSpace={5}
        color={themes[this.props.theme].mainColor}
        highlightColor={themes[this.props.theme].mainTasksHighlightColor}
        textColor={themes[this.props.theme].mainTasksTextColor}
        borderColor={themes[this.props.theme].mainTasksBorderColor}
        textFontSize={24}
        rightText={this.props.rightText?this.props.rightText:"Tomorrow"}
        leftText={this.props.leftText?this.props.leftText:"Today"}
        rightColor={themes[this.props.theme].mainColor}
        leftColor={themes[this.props.theme].mainColor}
        rightBorderColor={themes[this.props.theme].mainColor}
        leftBorderColor={themes[this.props.theme].mainColor}
        rightTextColor={themes[this.props.theme].tomorrowAccent}
        leftTextColor={themes[this.props.theme].todayAccent}
        footerItemColor={themes[this.props.theme].mainTasksSecondaryTextColor}
        footerItemSize={10}
        footerSeparatorColor={themes[this.props.theme].mainTasksTextColor}
        goalColor={themes[this.props.theme].mainTasksTextColor}
        goalTextColor={"#fff"}
        rightAction={this.props.rightAction}
        leftAction={this.props.leftAction}
        selectGoal={this.props.selectGoal}
        theme={this.props.theme}
        store={this.props.store}
        fontLoaded={this.props.fontLoaded} />
    )
  }
}

const styles = StyleSheet.create({
  taskContainer: {
    width: screenWidth,
    paddingLeft: 18,
    paddingRight: 18,
  },
  taskContainerFullWidth: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  task: {
    width: screenWidth-18*2,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 10,
    borderColor: "transparent",
  },
  taskFullWidth: {
    width: screenWidth,
    borderRadius: 0,
    padding: 16,
    paddingTop: 4,
    paddingBottom: 5,
  },
  taskText: {
    fontFamily: 'pt-mono-bold',
    fontSize: 20,
    textAlign: 'left',
    marginTop: 2,
    marginBottom: 3,
  },
  taskGoalsList: {
    marginBottom: 1,
    marginTop: 2,
  },
  taskGoal: {
    borderRadius: 4,
    height: 26,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 4,
    marginRight: 2,
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
    borderRadius: 4,
    position: 'absolute',
    left: 18,
    width: screenWidth-18*2,
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    borderWidth: 2,
  },
  taskUnderLayerFullWidth: {
    borderRadius: 0,
    left: 0,
    width: screenWidth,
    borderBottomWidth: 4,
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
    marginTop: 4,
    marginBottom: 2,
  },
  taskFooter: {
    flexDirection: 'row',
    height: 10,
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
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
  taskForm: {
    borderWidth: 2,
  },
  textInput: {
    fontFamily: 'pt-mono-bold',
    fontSize: 20,
    textAlign: 'left',
  },
  taskShadow: {
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
