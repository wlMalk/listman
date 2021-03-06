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
      o: new Animated.Value(stageValue),
      stage: stageValue,
    }
  }
  setValue(v, callback){
    if(v==this.state.stage){
      return
    }
    if(v==1&&this.props.onOpen){
      this.props.onOpen(this.state.stage)
    }else if(v==0&&this.props.onDefault){
      this.props.onDefault(this.state.stage)
    }else if(v==-1&&this.props.onClose){
      this.props.onClose(this.state.stage)
    }
    if(!this.props.flexible){
      Animated.spring(this.state.c, {
         toValue: v,
         // easing: Easing.ease,
         // duration: 250,
      }).start(callback);
    }
    Animated.timing(this.state.o, {
      toValue: v,
      duration: 200,
    }).start()
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
    var opacity = this.state.o.interpolate({
        inputRange: [-1,0,1],
        outputRange: [0,1,1]
    })
    var children = Array.isArray(this.props.children)?Array.from(this.props.children):this.props.children
    if(this.props.opacityIndices){
      for(var i = 0; i<this.props.opacityIndices.length; i++){
        var op = this.state.o.interpolate({
            inputRange: [-1,0,1],
            outputRange: [
              this.props.opacityIndices[i].when==-1?this.props.opacityIndices[i].opacity:1,
              this.props.opacityIndices[i].when==0?this.props.opacityIndices[i].opacity:1,
              this.props.opacityIndices[i].when==1?this.props.opacityIndices[i].opacity:1,
            ]
        })
        children[this.props.opacityIndices[i].index] = (
          <Animated.View key={this.props.opacityIndices[i].index} style={{flex:1,opacity: op}}>
            {children[this.props.opacityIndices[i].index]}
          </Animated.View>
        )
      }
    }
    var alwaysOn = []
    if(this.props.alwaysOnIndices){
      for(var i = 0; i<this.props.alwaysOnIndices.length; i++){
        alwaysOn.push(this.props.children[this.props.alwaysOnIndices[i]])
      }
      for(var i = 0; i<this.props.alwaysOnIndices.length; i++){
        children.splice(this.props.alwaysOnIndices[i], 1)
      }
    }
    return (
      <Animated.View style={[this.props.style, this.props.flexible?{flex: 1}:{height: height}]}>
        <Animated.View style={{flex:1, opacity: opacity, overflow: 'hidden'}}>
          {children}
        </Animated.View>
        {alwaysOn}
      </Animated.View>
    )
  }
}
