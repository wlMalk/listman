import React from 'react';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo';

export class ShadowOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shown: props.initiallyShown,
      s: new Animated.Value(!props.initiallyShown?0:100),
    }
  }
  show() {
    this.setState({shown: true})
    Animated.timing(this.state.s, {
      toValue: 100,
      duration: 250,
    }).start()
  }
  hide() {
    this.setState({shown: false})
    Animated.timing(this.state.s, {
      toValue: 0,
      duration: 250,
    }).start()
  }
  render() {
    var start = !this.props.horizontal?{x:.5,y:this.props.start?this.props.start:.45}:{x:this.props.start?this.props.start:.45,y:.5}
    var end = !this.props.horizontal?{x:.5,y:this.props.end?this.props.end:0}:{x:this.props.end?this.props.end:0,y:.5}
    if(!this.props.last){
      start = !this.props.horizontal?{x:.5,y:this.props.end?this.props.end:.55}:{x:this.props.end?this.props.end:.55,y:.5}
      end = !this.props.horizontal?{x:.5,y:this.props.start?this.props.start:1}:{x:this.props.start?this.props.start:1,y:.5}
    }

    var opacity = this.state.s.interpolate({
        inputRange: [0,100],
        outputRange: [0,1]
    })
    var size = this.state.s.interpolate({
        inputRange: [0,100],
        outputRange: [0,this.props.size]
    })

    return (
      <Animated.View pointerEvents="none" style={[
          {opacity: opacity},
          {
            height: !this.props.horizontal?size:"100%",
            width: this.props.horizontal?size:"100%",
            position: 'absolute',
          },
          !this.props.horizontal?(!this.props.last?{top: 0}:{bottom: 0}):(!this.props.last?{left: 0}:{right: 0})
        ]}>
        <LinearGradient
          pointerEvents="none"
          colors={[this.props.color, this.props.color+"00"]}
          start={start}
          end={end}
          style={{
            height: "100%",
            width: "100%",
          }}>
        </LinearGradient>
      </Animated.View>
    )
  }
}
