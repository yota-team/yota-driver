import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  Button
} from 'react-native';
import { connect } from 'react-redux'

class Home extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <View>
        <Text>INI KOMPONEN HOME</Text>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin,
    username: state.username,
    password: state.password
  }
}
const ConnectedComponent = connect(mapStateToProps, null)(Home)
export default ConnectedComponent;
