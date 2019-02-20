import React from 'react';
import { Font } from 'expo';
import { StyleSheet, Text, View } from 'react-native';

import Home from './Home'
import { Datastore } from './Datastore';

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fontLoaded: false,
      datastore: new Datastore((datastore)=>{this.setState({datastore:datastore})}),
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'pt-mono-regular': require('./assets/fonts/PT_Mono/regular.ttf'),
      'pt-mono-bold': require('./assets/fonts/PT_Mono/bold.ttf'),
    });
    this.setState({ fontLoaded: true });
    this.state.datastore.load()
    var id = this.state.datastore.createTask()
    this.state.datastore.editTask(id, "rfgtrg")
  }
  render() {
    return (
      <Home theme={this.state.datastore.theme} datastore={this.state.datastore} fontLoaded={this.state.fontLoaded} />
    );
  }
}
