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
      this.flatListRef.scrollToIndex({index: i, viewPosition: 0.5, animated: true})
    }
  }
  handleScroll(e) {
    const contentOffset = !this.props.horizontal?e.nativeEvent.contentOffset.y:e.nativeEvent.contentOffset.x
    if(contentOffset<=0&&!this.state.reachedStart){
      this.setState({reachedStart: true, reachedEnd: false})
      this.startShadowOverlay.hide()
    }else if(contentOffset>=this.contentSize-this.size&&!this.state.reachedEnd){
      this.setState({reachedEnd: true, reachedStart: false})
      this.endShadowOverlay.hide()
    }else if(contentOffset>0&&contentOffset<this.contentSize-this.size&&(this.state.reachedStart||this.state.reachedEnd)){
      this.setState({reachedStart: false, reachedEnd: false})
      this.startShadowOverlay.show()
      this.endShadowOverlay.show()
    }
    if(this.props.onScroll){
      this.props.onScroll(e)
    }
  }
  render() {
    var {style, onScroll, ...props} = this.props;
    return (

      <View
        style={[style, {alignItems: 'center', justifyContent: 'center'}]}
        onLayout={(e)=>{
          this.size = !this.props.horizontal?e.nativeEvent.layout.height:e.nativeEvent.layout.width
        }}>
        {this.props.data.length>0?(
        <FlatList
          onContentSizeChange={(contentWidth, contentHeight)=>{
            this.contentSize = !this.props.horizontal?contentHeight:contentWidth
          }}
          onScroll={this.handleScroll}
          scrollEventThrottle={1}
          style={{flexGrow: 0}}
          ref={(ref) => {this.flatListRef = ref}}
          {...props}/>
        ):(
          typeof this.props.emptyState=="string"?(
            this.props.fontLoaded?(
              <Text style={[styles.emptyStateText, {color: this.props.emptyStateColor}, this.props.emptyStateSize?{fontSize: this.props.emptyStateSize}:null]}>{this.props.emptyState.toUpperCase()}</Text>
            ):null
          ):(this.props.emptyState)
        )}
        <ShadowOverlay ref={(ref)=>{this.startShadowOverlay=ref}} initiallyShown={!this.state.reachedStart&&this.props.data.length>0} horizontal={this.props.horizontal} color={this.props.overlayColor} size={this.props.overlaySize} />
        <ShadowOverlay ref={(ref)=>{this.endShadowOverlay=ref}} initiallyShown={!this.state.reachedEnd&&this.props.data.length>0} horizontal={this.props.horizontal} last={true} color={this.props.overlayColor} size={this.props.overlaySize} />
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
