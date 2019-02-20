import React from 'react';
import { Animated, Easing, View } from 'react-native';

export class Collapsible extends React.Component {
  constructor(props){
    super(props)
    var stageValue = 0
    if(this.props.initialStage=="opened"){
      stageValue = 1
    }else if(this.props.initialStage=="closed"){
      stageValue = -1
    }
    this.state = {
      c: new Animated.Value(stageValue),
      stage: stageValue,
    }
  }
  setValue(v, callback){
    if(!this.props.flexible){
      Animated.spring(this.state.c, {
         toValue: v,
         // easing: Easing.ease,
         // duration: 250,
      }).start(callback);
    }
    this.setState({stage:v})
  }
  default(callback){
    this.setValue(0,callback)
  }
  open(callback){
    this.setValue(1,callback)
  }
  close(callback){
    this.setValue(-1,callback)
  }
  render(){
    var height = !this.props.flexible?this.state.c.interpolate({
        inputRange: [-1,0,1],
        outputRange: [this.props.heights[0],this.props.heights[1],this.props.heights[2]]
    }):null;
    return (
      <Animated.View style={[this.props.style, this.props.flexible?{flex: 1}:{height: height}]}>
      {this.props.children}
      </Animated.View>
    )
  }
}
