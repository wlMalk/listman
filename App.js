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

    var store = new Store(today, tomorrow, (store)=>{this.setState({store:store})})
    store.load()

    store.onCreateTodayTask = () => {this.container.setViewingToday();this.container.todayTasksList.scrollTo(0, true)}
    store.onCreateTomorrowTask = () => {this.container.setViewingTomorrow();this.container.tomorrowTasksList.scrollTo(0, true)}
    store.onCreateLaterTask = () => {this.container.setViewingLater();this.container.laterTasksList.scrollTo(0, true)}

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
  }
  render() {
    return (
      <Container ref={(ref)=>{this.container = ref}} theme={this.state.store.settings.theme} store={this.state.store} fontLoaded={this.state.fontLoaded} />
    );
  }
}
