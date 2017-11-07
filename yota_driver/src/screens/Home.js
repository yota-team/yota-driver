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
import MapView from 'react-native-maps'
import { Accelerometer, Gyroscope } from 'react-native-sensors'
import axios from 'axios'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      latitude: 0,
      longitude: 0,
      error: null,
      car_id: '59fda4375254c414ec370484'
    }
  }

  render() {
    return (
      <View>
        <TouchableHighlight onPress={ () => this.postCurrentPosition() }>
          <Text>TAP HER TO POST!</Text>
        </TouchableHighlight>
        <Text>car_id: {this.state.car_id}</Text>
      <Text>latitude: {this.state.latitude}</Text>
    <Text>longitude: {this.state.longitude}</Text>
      </View>
    )
  }

  componentDidMount() {
    this.getCoordinate()
    this.watchSpeed()
    // this.watchPosition()
  }

  watchSpeed() {
    const accelerationObservable = new Accelerometer({
      updateInterval: 10000 // defaults to 100ms
    })

    let lat = this.state.latitude
    let lng = this.state.longitude

    // Normal RxJS functions
    accelerationObservable
      .map(({ x, y, z }) => x + y + z)
      .filter(speed => speed < 10)
      .subscribe(speed => {
        this.getCoordinate()
        // this.postCurrentPosition()
        console.log(`You moved your phone with ${speed}`)
      });

    // setTimeout(() => {
    //   accelerationObservable.stop();
    // }, 1000);
  }

  watchPosition() {
    navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        })
        console.log('ini position di watch:', position)
      },
      (error) => {
        this.setState({ error: error.message })
        console.log(error)
      },
      { enableHighAccuracy: true, timeout: 1000}
    )
  }

  getCoordinate() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('posisi sekarang:', position)
        // alert(JSON.stringify(position))
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      (error) => {
        // alert(JSON.stringify(error))
        this.setState({ error: error.message })
      },
      { enableHighAccuracy: true, timeout: 10000},
    );
  }

  postCurrentPosition() {
    axios({
      method: 'post',
      url: `http://yota.achim.my.id/positions`,
      data: {
        car: this.state.car_id,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      }
    })
    .then(response => {
      console.log(response)
      // alert(JSON.stringify(response, null, 2))
    })
    .catch(err => {
      console.log(err)
      // alert(JSON.stringify(err, null, 2))
    })
  }
}

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin,
    username: state.username,
    password: state.password
  }
}
const ConnectedComponent = connect(mapStateToProps, null)(Home)
export default ConnectedComponent;
