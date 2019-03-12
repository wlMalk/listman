import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { themes } from './Themes'
import { HEADER_HEIGHT } from './helpers'

export class Header extends React.PureComponent {
  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={[styles.button, {alignItems: 'flex-start'}]} activeOpacity={.5}>
          <FontAwesome name="navicon" size={28} color={themes[this.props.theme].mainTitles} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.onLogoPress} style={styles.logoContainer} activeOpacity={.5}>
          {this.props.fontLoaded ? (
          <Text style={[styles.logo, {color: themes[this.props.theme].mainTitles}]}>{"LISTMAN"}</Text>
          ):null}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {alignItems: 'flex-end'}]} activeOpacity={.5}>
          <FontAwesome name="gear" size={28} color={themes[this.props.theme].mainTitles} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    paddingLeft: 18,
    paddingRight: 18,
  },
  logoContainer: {
    flex: 1,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'pt-mono-bold',
    fontSize: 24,
    letterSpacing: 7,
    textAlign: 'center',
  },
  button: {
    justifyContent: 'center',
    width: 60,
    height: HEADER_HEIGHT,
  }
});
