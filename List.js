import React from 'react';
import { ScrollView, FlatList, StyleSheet, Text, View } from 'react-native';

import { ShadowOverlay } from './ShadowOverlay';

export class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reachedStart: true,
      reachedEnd: false,
    }

    this.contentSize = 0
    this.size = 0

    this.flatListRef = null

    this.handleScroll = this.handleScroll.bind(this)
  }
  scrollToIndex(i) {
    if(i==this.props.data.length-1){
      this.flatListRef.scrollToEnd({animated: true})
    }else{
      this.flatListRef.scrollToIndex({index: i, viewPosition: .5, animated: true})
    }
  }
  scrollTo(v) {
    this.flatListRef.scrollToOffset(v)
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
  render() {
    var {style, onScroll, ...props} = this.props;
    return (

      <View
        style={style}
        onLayout={(e)=>{
          this.size = !this.props.horizontal?e.nativeEvent.layout.height:e.nativeEvent.layout.width
        }}>
        {this.props.data.length>0?(
        <FlatList
          contentContainerStyle={!this.props.horizontal?{paddingTop: this.props.startOffset?this.props.startOffset:0, paddingBottom: this.props.endOffset?this.props.endOffset:0}:{paddingLeft: this.props.startOffset?this.props.startOffset:0, paddingRight: this.props.endOffset?this.props.endOffset:0}}
          nestedScrollEnabled={true}
          onContentSizeChange={(contentWidth, contentHeight)=>{
            this.contentSize = !this.props.horizontal?contentHeight:contentWidth
          }}
          onScroll={this.handleScroll}
          scrollEventThrottle={1}
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
        <ShadowOverlay ref={(ref)=>{this.endShadowOverlay=ref}} initiallyShown={!this.state.reachedEnd&&this.props.data.length>0} horizontal={this.props.horizontal} last={true} color={this.props.overlayColor} size={this.props.overlaySize} />
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
  }
});
