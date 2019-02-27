import React from 'react';
import { Font } from 'expo';
import { UIManager, Platform, StyleSheet, Text, View } from 'react-native';

import Container from './Container'
import { Store } from './datastore/Store';

export default class App extends React.Component {
  constructor(props){
    super(props)

    var today = new Date()
    var tomorrow = new Date(today.getTime()+24*60*60*1000)

    var today = new Date();
    var tomorrow = new Date(today.getTime())
    tomorrow.setDate(today.getDate() + 1);

    const store = new Store(today, tomorrow, (store)=>{this.setState({store:store})})

    store.onCreateTodayTask = () => {this.container.setViewingToday()}
    store.onCreateTomorrowTask = () => {this.container.setViewingTomorrow()}
    store.onCreateLaterTask = () => {this.container.setViewingLater()}

    this.state = {
      fontLoaded: false,
      store: store,
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'pt-mono-regular': require('./assets/fonts/PT_Mono/regular.ttf'),
      'pt-mono-bold': require('./assets/fonts/PT_Mono/bold.ttf'),
    });
    this.setState({ fontLoaded: true });
    this.state.store.load()
  }
  render() {
    return (
      <Container ref={(ref)=>{this.container = ref}} theme={this.state.store.settings.theme} store={this.state.store} fontLoaded={this.state.fontLoaded} />
    );
  }
}
