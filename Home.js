import React from 'react';
import { Font, Constants } from 'expo';
import { LayoutAnimation, Dimensions, Animated, Keyboard, KeyboardAvoidingView, UIManager, findNodeHandle, StatusBar, SafeAreaView, StyleSheet, View, Platform } from 'react-native';

import { ShadowOverlay } from './ShadowOverlay';
import { Task } from './Tasks';
import { GoalsList } from './Goals';
import { CountersList } from './Counters';
import { Bar } from './Bar';
import { Collapsible } from './Collapsible';

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

export default class Home extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        mainViewHeight: 0,
        editingTaskText: false,
        scene: "HOME",
        scenePayload: null,
        selectedGoal: null,
      }
      this.selectGoal = this.selectGoal.bind(this)
    }
    setScene(scene,payload){
      if(this.state.editingTaskText){
        Keyboard.dismiss()
      }
      if(scene!=this.state.scene||(scene==this.state.scene&&payload!=this.state.scenePayload&&payload!=null)){
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
        this.tomorrowCollapsible.default()
        this.tasksCollapsible.default()
        LayoutAnimation.configureNext(animationConfig)
        this.setState({selectedGoal: null, scene:HOME, scenePayload:null});
      }
    }
    selectGoal(goal){
      this.setScene(GOAL, goal)
    }
    getSelectedCounter(){
      if(
        this.state.scene==ALL||
        this.state.scene==REMAINING||
        this.state.scene==COMPLETED||
        this.state.scene==RECURRING
      ){
        return this.state.scene
      }
      return null
    }
    // onCreatingTask(forTomorrow){
    //   Animated.spring(this.state.dragY, {         //This will make the draggable card back to its original position
    //      toValue: !forTomorrow?0:100
    //   }).start();
    //   this.props.datastore.createTask(forTomorrow)
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
      return (
        <KeyboardAvoidingView behavior="padding" enabled>
        <View style={{width: '100%', height: '100%'}}>
          <View style={{backgroundColor:themes[this.props.theme].mainColor,width: '100%', height: '50%',position:'absolute',top:0}}></View>
          <View style={{backgroundColor:themes[this.props.theme].tomorrowColor,width: '100%', height: '50%',position:'absolute',bottom:0}}></View>
            <StatusBar backgroundColor={themes[this.props.theme].mainColor} barStyle="dark-content"/>
            <SafeAreaView style={{flex: 1,paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0}}>
              <View style={styles.header}>
              </View>
              <View
                style={{flex: 1}}
                ref={ref => this.mainView = ref}
                onLayout={(event) => {
                    UIManager.measure(findNodeHandle(this.mainView), function(x,y,width,height,px,py){
                      this.setState({mainViewHeight:parseInt(height)});
                    }.bind(this))
                }}>
                <GoalsList
                  goals={this.props.datastore.getGoals()}
                  selectGoal={this.selectGoal}
                  selected={this.state.selectedGoal}
                  theme={this.props.theme}
                  fontLoaded={this.props.fontLoaded} />
                <Collapsible ref={(ref)=>{this.tasksCollapsible = ref}} heights={[0,this.state.mainViewHeight/2-GOALS_HEIGHT-HEADER_HEIGHT/2-COUNTERS_HEIGHT-5,this.state.mainViewHeight-65*2-5-GOALS_HEIGHT-COUNTERS_HEIGHT-5]} style={{backgroundColor: themes[this.props.theme].mainColor}}>
                  <View style={{flex:1}}>
                    {this.props.datastore.tasks.map((task)=>(
                      <Task
                        key={task.id}
                        task={task}
                        showDayIndicators={true}
                        verticalSpace={5}
                        color={themes[this.props.theme].mainTasksColor}
                        highlightColor={themes[this.props.theme].mainTasksHighlightColor}
                        textColor={themes[this.props.theme].mainTasksTextColor}
                        borderColor={themes[this.props.theme].mainTasksBorderColor}
                        textFontSize={30}
                        rightText="Tomorrow"
                        leftText="Today"
                        rightColor={themes[this.props.theme].tomorrowColor}
                        leftColor={themes[this.props.theme].todayColor}
                        rightTextColor={themes[this.props.theme].tomorrowAccent}
                        leftTextColor={themes[this.props.theme].todayAccent}
                        footerItemColor="#000"
                        footerItemSize={10}
                        footerSeparatorColor="#aaa"
                        goalColor={themes[this.props.theme].mainTasksTextColor}
                        goalTextColor={"#fff"}
                        rightAction={(task)=>{}}
                        leftAction={(task)=>{}}
                        selectGoal={this.selectGoal}
                        theme={this.props.theme}
                        datastore={this.props.datastore}
                        fontLoaded={this.props.fontLoaded} />
                    ))}
                  </View>
                  <ShadowOverlay color={themes[this.props.theme].mainColor} size={100} last={true} initiallyShown={true} />
                </Collapsible>
                <CountersList
                  onAllPress={()=>{this.setScene(ALL,null)}}
                  onRemainingPress={()=>{this.setScene(REMAINING,null)}}
                  onCompletedPress={()=>{this.setScene(COMPLETED,null)}}
                  onRecurringPress={()=>{this.setScene(RECURRING,null)}}
                  selected={this.getSelectedCounter()}
                  all={this.props.datastore.getTasksCount()}
                  remaining={this.props.datastore.getRemainingCount()}
                  completed={this.props.datastore.getCompletedCount()}
                  recurring={this.props.datastore.getRecurringCount()}
                  theme={this.props.theme}
                  fontLoaded={this.props.fontLoaded} />
                <Collapsible alwaysOnIndices={[1]} flexible={true} ref={(ref)=>{this.todayCollapsible = ref}} style={{backgroundColor: themes[this.props.theme].todayColor, borderTopColor: themes[this.props.theme].todayAccent, borderTopWidth: 5, borderBottomWidth: 5, borderBottomColor:themes[this.props.theme].todayAccent}}>
                  <View style={{flex:1}}></View>
                  <Bar theme={this.props.theme} forTomorrow={false} date={new Date()} count={this.props.datastore.counts.today} total={this.props.datastore.totals.today} onPress={()=>{this.setScene(TODAY,null)}} creator={()=>{this.onCreatingTask(false)}} fontLoaded={this.props.fontLoaded} ref={ref => this.todayBar = ref} />
                </Collapsible>
                <Collapsible alwaysOnIndices={[1]} ref={(ref)=>{this.tomorrowCollapsible = ref}} initialStage={"closed"} heights={[65,65,this.state.mainViewHeight-70-GOALS_HEIGHT-5-COUNTERS_HEIGHT]} style={{backgroundColor: themes[this.props.theme].tomorrowColor, borderTopWidth: 5, borderTopColor:themes[this.props.theme].tomorrowAccent}}>
                  <View style={{flex:1}}></View>
                  <Bar theme={this.props.theme} forTomorrow={true} date={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)} count={this.props.datastore.counts.tomorrow} total={this.props.datastore.totals.tomorrow} onPress={()=>{this.setScene(TOMORROW,null)}} creator={()=>{this.onCreatingTask(true)}} fontLoaded={this.props.fontLoaded} ref={ref => this.tomorrowBar = ref} />
                </Collapsible>
              </View>
            </SafeAreaView>
          </View>
          </KeyboardAvoidingView>
      );
    }
  }

  const styles = StyleSheet.create({
    header: {
      height: HEADER_HEIGHT,
    }
  });
