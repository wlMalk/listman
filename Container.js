import React from 'react';
import { Font, Constants } from 'expo';
import { LayoutAnimation, Dimensions, Animated, Keyboard, KeyboardAvoidingView, UIManager, findNodeHandle, StatusBar, SafeAreaView, StyleSheet, View, Platform } from 'react-native';

import { ShadowOverlay } from './ShadowOverlay';
import { EmptyList } from './EmptyList';
import { TasksList, TodoTask, TodayTask, TomorrowTask, NowTask } from './Tasks';
import { GoalsList } from './Goals';
import { CountersList } from './Counters';
import { Bar } from './Bar';
import { Collapsible } from './Collapsible';
import { Header } from './Header';

import { animationConfig, GOALS_HEIGHT, HEADER_HEIGHT, COUNTERS_HEIGHT } from './helpers'
import { themes } from './Themes'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HOME      = "HOME";
const TODAY     = "TODAY";
const TOMORROW  = "TOMORROW";
const GOAL      = "GOAL";
const GOALS     = "GOALS";
const ALL       = "ALL";
const COMPLETED = "COMPLETED";
const REMAINING = "REMAINING";
const RECURRING = "RECURRING";

export default class Container extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        mainViewHeight: 0,
        editingTaskText: false,
        scene: HOME,
        scenePayload: null,
        selectedGoal: null,
      }
      this.selectGoal = this.selectGoal.bind(this)

      this.onEditingTodayTask = this.onEditingTodayTask.bind(this)
      this.onEditingTomorrowTask = this.onEditingTomorrowTask.bind(this)
      this.onEditingLaterTask = this.onEditingLaterTask.bind(this)
    }
    setViewingHome() {
      this.setScene(HOME, null)
      this.goalsList.scrollTo({x: 0, animated: true})
      this.countersList.listRef.scrollTo({x: 0, animated: true})
    }
    setViewingToday() {
      if(this.state.scene!=TODAY){
        this.setScene(TODAY, null)
      }
    }
    setViewingTomorrow() {
      if(this.state.scene!=TOMORROW){
        this.setScene(TOMORROW, null)
      }
    }
    setViewingAll() {
      if(this.state.scene!=ALL){
        this.setScene(ALL, null)
      }
    }
    setScene(scene,payload){
      if(this.state.editingTaskText){
        Keyboard.dismiss()
      }
      if(scene!=HOME&&(scene!=this.state.scene||(scene==this.state.scene&&payload!=this.state.scenePayload&&payload!=null))){
        if(scene==TODAY){
          this.todayCollapsible.open()
          this.tomorrowCollapsible.close()
          this.tasksCollapsible.close()
        }else if(scene==TOMORROW){
          this.todayCollapsible.close()
          this.tomorrowCollapsible.open()
          this.tasksCollapsible.close()
        }else if(scene==GOAL){
          this.todayCollapsible.close()
          this.tomorrowCollapsible.close()
          this.tasksCollapsible.open()
          LayoutAnimation.configureNext(animationConfig)
          this.setState({selectedGoal: payload, scene:GOAL, scenePayload:payload});
          return
        }else{
          this.todayCollapsible.close()
          this.tomorrowCollapsible.close()
          this.tasksCollapsible.open()
        }
        LayoutAnimation.configureNext(animationConfig)
        this.setState({selectedGoal: null, scene:scene,scenePayload:payload});
      }else{
        this.todayCollapsible.default()
        this.tomorrowCollapsible.close()
        this.tasksCollapsible.default()
        LayoutAnimation.configureNext(animationConfig)
        this.setState({selectedGoal: null, scene:HOME, scenePayload:null});
      }
    }
    isSceneNotIn(a) {
      for(var i=0; i<a.length; i++) {
        if(this.state.scene==a[i]) {
          return false
        }
      }
      return true
    }
    isSceneIn(a) {
      for(var i=0; i<a.length; i++) {
        if(this.state.scene==a[i]){
          return true
        }
      }
      return false
    }
    selectGoal(goal){
      this.setScene(GOAL, goal)
    }
    getSelectedCounter(){
      if(this.isSceneIn([ALL,REMAINING,COMPLETED,RECURRING])){
        return this.state.scene
      }
      return null
    }
    onEditingTodayTask(index){
      this.todayTasksList.list.flatListRef.getNode().scrollToIndex({index: index, viewPosition: 0.1, animated: true})
    }
    onEditingTomorrowTask(index){
      this.tomorrowTasksList.list.flatListRef.getNode().scrollToIndex({index: index, viewPosition: 0.1, animated: true})
    }
    onEditingLaterTask(index){
      this.laterTasksList.list.flatListRef.getNode().scrollToIndex({index: index, viewPosition: 0.1, animated: true})
    }
    // onCreatingTask(forTomorrow){
    //   Animated.spring(this.state.dragY, {         //This will make the draggable card back to its original position
    //      toValue: !forTomorrow?0:100
    //   }).start();
    //   this.props.store.createTask(forTomorrow)
    // }
    // onEditingTask(forTomorrow){
    //   this.setState({editingTaskText:true})
    // }
    // onEditingTaskEnd(forTomorrow){
    //   this.setState({editingTaskText:false})
    // }
    // returnToPrevious(){
    //   Animated.spring(this.state.dragY, {         //This will make the draggable card back to its original position
    //      toValue: this.state.viewingToday?0:this.state.viewingTomorrow?100:50
    //   }).start();
    // }
    render() {

      var mainTasks = []
      var mainTasksTotal = 0
      if(this.isSceneIn([HOME,ALL,REMAINING,COMPLETED,RECURRING])){
        if(this.isSceneIn([HOME,ALL])){
          mainTasks = this.props.store.getAllTasks()
          mainTasksTotal = this.props.store.getAllTasksTotal()
        } else if(this.state.scene == REMAINING){
          mainTasks = this.props.store.getRemainingTasks()
          mainTasksTotal = this.props.store.getRemainingTasksTotal()
        } else if(this.state.scene == COMPLETED){
          mainTasks = this.props.store.getCompletedTasks()
          mainTasksTotal = this.props.store.getCompletedTasksTotal()
        } else if(this.state.scene == RECURRING){
          mainTasks = this.props.store.getRecurringTasks()
          mainTasksTotal = this.props.store.getRecurringTasksTotal()
        }
      }

      const nowTask = this.props.store.getNowTask()


      return (
        <KeyboardAvoidingView behavior="padding" enabled>
        <View style={{width: '100%', height: '100%'}}>
          <View style={{backgroundColor:themes[this.props.theme].headerColor,width: '100%', height: '50%',position:'absolute',top:0}}></View>
          <View style={{backgroundColor:themes[this.props.theme].tomorrowColor,width: '100%', height: '50%',position:'absolute',bottom:0}}></View>
            <StatusBar backgroundColor={themes[this.props.theme].headerColor} barStyle={(Platform.OS=="ios"?"dark":"light")+"-content"}/>
            <SafeAreaView style={{flex: 1,paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0}}>
              <Header onLogoPress={()=>{this.setViewingHome()}} theme={this.props.theme} fontLoaded={this.props.fontLoaded} />
              <View
                style={{flex: 1}}
                ref={ref => this.mainView = ref}
                onLayout={(event) => {
                    UIManager.measure(findNodeHandle(this.mainView), function(x,y,width,height,px,py){
                      this.setState({mainViewHeight:parseInt(height)});
                    }.bind(this))
                }}>
                <GoalsList
                  ref={(ref)=>{this.goalsList = ref}}
                  count={this.props.store.getGoalsCount()}
                  goals={this.props.store.getGoals()}
                  selectGoal={this.selectGoal}
                  selected={this.state.selectedGoal}
                  theme={this.props.theme}
                  fontLoaded={this.props.fontLoaded} />
                <Collapsible onOpen={()=>{this.laterTasksList.scrollTo(0, true)}} onDefault={()=>{this.laterTasksList.scrollTo(0, true)}} alwaysOnIndices={[2]} opacityIndices={[{index: 0, when: 0, opacity: mainTasksTotal>0?.45:1}]} ref={(ref)=>{this.tasksCollapsible = ref}} heights={[COUNTERS_HEIGHT+5,this.state.mainViewHeight/2-GOALS_HEIGHT-HEADER_HEIGHT/2,this.state.mainViewHeight-65*2-5-GOALS_HEIGHT]} style={{backgroundColor: themes[this.props.theme].mainColor}}>
                  <View style={{flex: 1}}>
                    <TasksList
                      ref={(ref)=>{this.laterTasksList=ref}}
                      startOffset={12}
                      endOffset={12}
                      scrollEnabled={this.isSceneNotIn([HOME,TODAY,TOMORROW])}
                      tasks={mainTasks}
                      renderItem={({item, index}) => (
                        <TodoTask
                          index={index}
                          onEditingTask={this.onEditingLaterTask}
                          editable={this.isSceneNotIn([HOME,TODAY,TOMORROW])}
                          scrollable={this.isSceneNotIn([HOME,TODAY,TOMORROW])}
                          last={index==mainTasksTotal}
                          key={item.id}
                          task={item}
                          rightAction={this.props.store.scheduleTaskForTomorrow}
                          leftAction={this.props.store.scheduleTaskForToday}
                          selectGoal={this.selectGoal}
                          theme={this.props.theme}
                          store={this.props.store}
                          fontLoaded={this.props.fontLoaded} />
                      )}
                      overlayColor={themes[this.props.theme].mainColor}
                      emptyState={(
                        <EmptyList
                        color={themes[this.props.theme].mainTitles}
                        title="No tasks yet!"
                        subtitle="tap on (+) to add new tasks"
                        onPress={this.props.store.createLaterTask}
                        fontLoaded={this.props.fontLoaded}/>
                      )}
                      fontLoaded={this.props.fontLoaded}
                    />
                  </View>
                  {this.isSceneIn([HOME])?(
                  <ShadowOverlay color={themes[this.props.theme].mainColor} size={100} start={1} end={0} last={true} initiallyShown={true} />
                  ):null}
                  <CountersList
                    creator={this.props.store.createLaterTask}
                    ref={(ref)=>{this.countersList = ref}}
                    onAllPress={()=>{this.setScene(ALL,null)}}
                    onRemainingPress={()=>{this.setScene(REMAINING,null)}}
                    onCompletedPress={()=>{this.setScene(COMPLETED,null)}}
                    onRecurringPress={()=>{this.setScene(RECURRING,null)}}
                    selected={this.getSelectedCounter()}
                    all={this.props.store.getAllTasksTotal()}
                    remaining={this.props.store.getRemainingTasksTotal()}
                    completed={this.props.store.getCompletedTasksTotal()}
                    recurring={this.props.store.getRecurringTasksTotal()}
                    theme={this.props.theme}
                    fontLoaded={this.props.fontLoaded} />
                </Collapsible>
                <Collapsible onOpen={()=>{this.todayTasksList.scrollTo(0, false)}} onDefault={()=>{this.todayTasksList.scrollTo(0, false)}} alwaysOnIndices={[1]} flexible={true} ref={(ref)=>{this.todayCollapsible = ref}} style={{backgroundColor: themes[this.props.theme].todayColor, borderTopColor: themes[this.props.theme].todayAccent, borderTopWidth: 5, borderBottomWidth: 5, borderBottomColor:themes[this.props.theme].todayAccent}}>
                  <View style={{flex:1, justifyContent: 'center'}}>
                    {this.isSceneIn([HOME])?
                      this.props.store.getTodayTasksCount()>0&&nowTask!=null?(
                      <NowTask
                        editable={true}
                        task={nowTask}
                        rightAction={this.props.store.scheduleTaskForTomorrow}
                        leftAction={this.props.store.completeTask}
                        selectGoal={this.selectGoal}
                        theme={this.props.theme}
                        store={this.props.store}
                        fontLoaded={this.props.fontLoaded} />
                    ):null:null}
                    <TasksList
                      ref={(ref)=>{this.todayTasksList=ref}}
                      backgroundColor={themes[this.props.theme].todayColor}
                      startOffset={25}
                      endOffset={90}
                      tasks={this.props.store.getTodayTasks()}
                      startOverScrollColor={Platform.OS==='ios'?themes[this.props.theme].todayAccent:null}
                      renderItem={({item, index}) => (
                        <TodayTask
                          onEditingTask={this.onEditingTodayTask}
                          editable={true}
                          scrollable={true}
                          last={index==this.props.store.getTodayTasksCount()-1}
                          key={item.id}
                          task={item}
                          index={index}
                          rightAction={this.props.store.scheduleTaskForTomorrow}
                          leftAction={this.props.store.completeTask}
                          selectGoal={this.selectGoal}
                          theme={this.props.theme}
                          store={this.props.store}
                          fontLoaded={this.props.fontLoaded} />
                      )}
                      noEndOverlay={true}
                      overlayColor={themes[this.props.theme].todayColor}
                      emptyState={(
                        <EmptyList color={themes[this.props.theme].todaySecondary} title="No tasks for today!" subtitle="tap on (+) to add new tasks" onPress={this.props.store.createTodayTask} fontLoaded={this.props.fontLoaded}/>
                      )}
                      fontLoaded={this.props.fontLoaded}
                    />
                  </View>
                  <Bar theme={this.props.theme} closed={this.state.scene!=TODAY} forTomorrow={false} date={this.props.store.getTodayDate()} count={this.props.store.getTodayTasksCount()} total={this.props.store.getTodayTasksTotal()} onPress={()=>{this.setScene(TODAY,null)}} creator={this.props.store.createTodayTask} fontLoaded={this.props.fontLoaded} ref={ref => this.todayBar = ref} />
                  <ShadowOverlay color={themes[this.props.theme].todayColor} size={100} start={.6} end={.05} last={true} initiallyShown={true} />
                </Collapsible>
                <Collapsible onOpen={()=>{this.tomorrowTasksList.scrollTo(0, false)}} onDefault={()=>{this.tomorrowTasksList.scrollTo(0, false)}} alwaysOnIndices={[1]} ref={(ref)=>{this.tomorrowCollapsible = ref}} initialStage={"closed"} heights={[65,65,this.state.mainViewHeight-70-GOALS_HEIGHT-5-COUNTERS_HEIGHT]} style={{backgroundColor: themes[this.props.theme].tomorrowColor, borderTopWidth: 5, borderTopColor:themes[this.props.theme].tomorrowAccent}}>
                  <View style={{flex:1}}>
                    <TasksList
                      ref={(ref)=>{this.tomorrowTasksList=ref}}
                      backgroundColor={themes[this.props.theme].tomorrowColor}
                      startOffset={25}
                      endOffset={90}
                      tasks={this.props.store.getTomorrowTasks()}
                      startOverScrollColor={Platform.OS==='ios'?themes[this.props.theme].tomorrowAccent:null}
                      renderItem={({item, index}) => (
                        <TomorrowTask
                          onEditingTask={this.onEditingTomorrowTask}
                          editable={true}
                          scrollable={true}
                          last={index==this.props.store.getTomorrowTasksTotal()-1}
                          key={item.id}
                          task={item}
                          index={index}
                          rightAction={this.props.store.scheduleTaskForLater}
                          leftAction={this.props.store.scheduleTaskForToday}
                          selectGoal={this.selectGoal}
                          theme={this.props.theme}
                          store={this.props.store}
                          fontLoaded={this.props.fontLoaded} />
                      )}
                      noEndOverlay={true}
                      overlayColor={themes[this.props.theme].tomorrowColor}
                      emptyState={(
                        <EmptyList color={themes[this.props.theme].tomorrowSecondary} title="No tasks for tomorrow!" subtitle="tap on (+) to add new tasks" onPress={this.props.store.createTomorrowTask} fontLoaded={this.props.fontLoaded}/>
                      )}
                      fontLoaded={this.props.fontLoaded}
                    />
                  </View>
                  <Bar theme={this.props.theme} closed={this.state.scene!=TOMORROW} forTomorrow={true} date={this.props.store.getTomorrowDate()} count={this.props.store.getTomorrowTasksTotal()} total={this.props.store.settings.tasksPerDay} onPress={()=>{this.setScene(TOMORROW,null)}} creator={this.props.store.createTomorrowTask} fontLoaded={this.props.fontLoaded} ref={ref => this.tomorrowBar = ref} />
                  <ShadowOverlay color={themes[this.props.theme].tomorrowColor} size={100} start={.6} end={.05} last={true} initiallyShown={true} />
                </Collapsible>
              </View>
            </SafeAreaView>
          </View>
          </KeyboardAvoidingView>
      );
    }
  }
