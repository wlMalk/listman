import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export class EmptyList extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.emptyListContainer} disabled={this.props.disabled} onPress={this.props.onPress} activeOpacity={.5}>
        <View style={styles.emptyList}>
          {(typeof this.props.hideIcon==='undefined')||!this.props.hideIcon?(
          <FontAwesome name={this.props.icon?this.props.icon:"plus-circle"} size={36} color={this.props.color} />
          ):null}
          {this.props.fontLoaded&&this.props.title?(
          <Text style={[styles.emptyTitle, {color: this.props.color}]}>{this.props.title.toUpperCase()}</Text>
          ):null}
          {this.props.fontLoaded&&this.props.subtitle?(
          <Text style={[styles.emptySubtitle, {color: this.props.color}]}>{this.props.subtitle.toUpperCase()}</Text>
          ):null}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'pt-mono-bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  emptySubtitle: {
    marginTop: 4,
    fontFamily: 'pt-mono-bold',
    fontSize: 10,
    textAlign: 'center',
  },
});
