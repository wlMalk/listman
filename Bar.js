import React from 'react';
import { Animated, LayoutAnimation, TouchableOpacity, StyleSheet, Text, View, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { animationConfig, pad } from './helpers'
import { themes } from './Themes'

var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";

export class Bar extends React.PureComponent {
  render() {
    return (
      <Animated.View style={[styles.bar, this.props.style]}>
        <TouchableOpacity activeOpacity={.5} style={{flex:1, flexDirection:'row'}} onPress={this.props.onPress}>
          <View style={[{flex:1,flexDirection:'row',height:60, paddingLeft: 44},!this.props.forTomorrow?{paddingTop:7,paddingBottom:14}:{paddingTop:15,paddingBottom:7}]}>
            {this.props.fontLoaded ? (
              <Text style={{fontFamily: 'pt-mono-bold',fontSize:33,color:!this.props.forTomorrow?themes[this.props.theme].todayAccent:themes[this.props.theme].tomorrowAccent,textAlign:'left'}}>{!this.props.forTomorrow?"Today".toUpperCase():"Tomorrow".toUpperCase()}</Text>
            ) : null }
            {this.props.fontLoaded ? (
              <Text style={[{fontFamily: 'pt-mono-bold',fontSize:12,color:!this.props.forTomorrow?themes[this.props.theme].todayAccent:themes[this.props.theme].tomorrowAccent,textTransform:'uppercase',position:'absolute',left:44,textAlign:'left'}, !this.props.forTomorrow?{bottom:6}:{top:7}]}>{weekdays[this.props.date.getDay()].toUpperCase()+"|"+pad(this.props.date.getDate(),2)+"-"+pad(this.props.date.getMonth()+1,2)+"-"+this.props.date.getFullYear()}</Text>
            ) : null }
            {this.props.fontLoaded ? (
              <View style={{flexDirection: 'row',alignItems:'baseline'}}>
                <Text style={{color: !this.props.forTomorrow?themes[this.props.theme].todayContrast:themes[this.props.theme].tomorrowContrast,fontFamily: 'pt-mono-bold',fontSize:33, marginLeft:5,textAlign:'left'}}>{this.props.count}</Text>
                <Text style={{color: !this.props.forTomorrow?themes[this.props.theme].todaySecondary:themes[this.props.theme].tomorrowSecondary,fontFamily: 'pt-mono-bold',fontSize:20,textAlign:'left',paddingBottom:Platform.OS=='android'?5:2}}>/{this.props.total}</Text>
              </View>
            ) : null }
          </View>
          {this.props.fontLoaded ? (
            <View style={{alignItems:'center',justifyContent:'center',width:44,height:60,position:'absolute',left:0,top:0,textAlign:'left'}}>
              <FontAwesome name={this.props.closed?"chevron-up":"chevron-down"} size={24} color={!this.props.forTomorrow?themes[this.props.theme].todaySecondary:themes[this.props.theme].tomorrowSecondary} />
            </View>
          ) : null }
        </TouchableOpacity>
        {this.props.fontLoaded ? (
          <TouchableOpacity activeOpacity={.5} onPress={()=>{LayoutAnimation.configureNext(animationConfig);this.props.creator()}} style={{alignItems:'center',justifyContent:'center',width:80,paddingLeft:20,height:60,position:'absolute',right:0,top:0,textAlign:'right'}}><Text style={{color: !this.props.forTomorrow?themes[this.props.theme].todayContrast:themes[this.props.theme].tomorrowContrast,fontFamily: 'pt-mono-bold',fontSize:40}}>+</Text></TouchableOpacity>
        ) : null }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    zIndex: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    paddingLeft: 8,
    paddingRight: 18,
    flexDirection: 'row',
  },
});
