import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { themes } from './Themes'
import { HEADER_HEIGHT } from './helpers'

export class Header extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.props.onLogoPress} style={styles.logoContainer} activeOpacity={.5}>
          {this.props.fontLoaded ? (
          <Text style={[styles.logo, {color: themes[this.props.theme].mainTitles}]}>{"LISTISTIST"}</Text>
          ):null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} activeOpacity={.5}>
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
    paddingLeft: 6,
    paddingRight: 6,
  },
  logoContainer: {
    flex: 1,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  logo: {
    fontFamily: 'pt-mono-bold',
    fontSize: 24,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: HEADER_HEIGHT,
  }
});
