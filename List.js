import React from 'react';
import { Animated, ScrollView, FlatList, StyleSheet, Text, View } from 'react-native';

import { ShadowOverlay } from './ShadowOverlay';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollAnimation: new Animated.Value(0),
      scrolling: false,
      reachedStart: true,
      reachedEnd: false,
    }

    this.contentSize = 0
    this.size = 0

    this.flatListRef = null

    this.handleScroll = this.handleScroll.bind(this)
    this.handleScrollBegin = this.handleScrollBegin.bind(this)
    this.handleScrollEnd = this.handleScrollEnd.bind(this)
  }
  scrollToIndex(i, pos) {
    if(typeof pos === 'undefined'||pos==null){
      pos = .5
    }
    if(i==this.props.data.length-1){
      this.flatListRef.getNode().scrollToEnd({animated: true})
    }else{
      this.flatListRef.getNode().scrollToIndex({index: i, viewPosition: pos, animated: true})
    }
  }
  scrollTo(v) {
    if(this.flatListRef){
      this.flatListRef.getNode().scrollToOffset(v)
    }
  }
  scrollToEnd(v) {
    if(this.flatListRef){
      this.flatListRef.getNode().scrollToEnd(v)
    }
  }
  handleScroll(e) {
    const startOffset = 0
    const endOffset = this.props.endOffset?this.contentSize-this.size+(this.props.startOffset?this.props.startOffset:0)+this.props.endOffset:this.contentSize-this.size
    const contentOffset = !this.props.horizontal?e.nativeEvent.contentOffset.y:e.nativeEvent.contentOffset.x
    if(contentOffset<=startOffset&&!this.state.reachedStart&&!this.props.noStartOverlay){
      this.setState({reachedStart: true})
      this.startShadowOverlay.hide()
    }
    if(contentOffset>=endOffset&&!this.state.reachedEnd&&!this.props.noEndOverlay){
      this.setState({reachedEnd: true})
      this.endShadowOverlay.hide()
    }
    if(this.state.reachedStart||this.state.reachedEnd){
      if(contentOffset>startOffset&&this.state.reachedStart&&!this.props.noStartOverlay){
        this.setState({reachedStart: false})
        this.startShadowOverlay.show()
      }
      if(contentOffset<endOffset&&this.state.reachedEnd&&!this.props.noEndOverlay){
        this.setState({reachedEnd: false})
        this.endShadowOverlay.show()
      }
    }
    if(this.props.onScroll){
      this.props.onScroll(e)
    }
  }
  handleScrollBegin(){
    this.setState({scrolling: true})
  }
  handleScrollEnd(){
    this.setState({scrolling: false})
  }
  render() {
    var {style, onScroll, ...props} = this.props;
    return (

      <View
        style={[style, {flex: 1, justifyContent: 'center', overflow: this.props.overflowVisible?'visible':'hidden'}]}
        onLayout={(e)=>{
          this.size = !this.props.horizontal?e.nativeEvent.layout.height:e.nativeEvent.layout.width
        }}>
        {this.props.startOverScrollColor?(
          <View style={[styles.startOverScroll, {backgroundColor: this.props.startOverScrollColor, height: this.props.data.length&&this.state.scrolling>0?'50%':0}]}></View>
        ):null}
        {this.props.data.length>0?(
        <AnimatedFlatList
          onScrollBeginDrag={this.handleScrollBegin}
          onMomentumScrollEnd={this.handleScrollEnd}
          style={{backgroundColor:'transparent',overflow: this.props.overflowVisible?'visible':'hidden'}}
          contentContainerStyle={[!this.props.horizontal?{paddingTop: this.props.startOffset?this.props.startOffset:0, paddingBottom: this.props.endOffset?this.props.endOffset:0}:{paddingLeft: this.props.startOffset?this.props.startOffset:0, paddingRight: this.props.endOffset?this.props.endOffset:0}, {overflow: this.props.overflowVisible?'visible':'hidden'}, this.props.startOverScrollColor?{backgroundColor:this.props.backgroundColor, minHeight: '100%'}:null]}
          nestedScrollEnabled={true}
          onContentSizeChange={(contentWidth, contentHeight)=>{
            this.contentSize = !this.props.horizontal?contentHeight:contentWidth
          }}
          onScroll={Animated.event(
        [{
            nativeEvent: {
                contentOffset: {
                    y: this.state.scrollAnimation
                }
            }
        }],{
          useNativeDriver: true,
          listener: this.handleScroll,
        })}
          scrollEventThrottle={16}
          ref={(ref) => {this.flatListRef = ref}}
          {...props}/>
        ):(
          typeof this.props.emptyState=="string"?(
            this.props.fontLoaded?(
              <Text style={[styles.emptyStateText, {color: this.props.emptyStateColor}, this.props.emptyStateSize?{fontSize: this.props.emptyStateSize}:null]}>{this.props.emptyState.toUpperCase()}</Text>
            ):null
          ):(this.props.emptyState)
        )}
        {!this.props.noStartOverlay?(
        <ShadowOverlay ref={(ref)=>{this.startShadowOverlay=ref}} initiallyShown={!this.state.reachedStart&&this.props.data.length>0} horizontal={this.props.horizontal} color={this.props.overlayColor} size={this.props.overlaySize} />
        ):null}
        {!this.props.noEndOverlay?(
        <ShadowOverlay ref={(ref)=>{this.endShadowOverlay=ref}} initiallyShown={!this.state.reachedEnd} horizontal={this.props.horizontal} last={true} color={this.props.overlayColor} size={this.props.overlaySize} />
        ):null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  emptyStateText: {
    fontFamily: 'pt-mono-bold',
    fontSize: 14,
    textAlign: 'center',
  },
  startOverScroll: {
    position: 'absolute',
    top: 0,
    width: '100%',
  }
});
