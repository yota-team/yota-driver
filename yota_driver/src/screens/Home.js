import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  Button,
  Image,
  Modal
} from 'react-native';
import { connect } from 'react-redux'
import MapView from 'react-native-maps'
// import { Accelerometer, Gyroscope } from 'react-native-sensors'
import axios from 'axios'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      date: new Date(),
      latitude: 0,
      longitude: 0,
      error: null,
      car_id: '59fda4375254c414ec370484',
      isActive: false,
      speed: 0
    }
  }

  componentDidMount() {
    // this.getCoordinate()
    // this.watchSpeed()
    this.watchPosition()
  }

  render() {
    return (
      <View style={styles.container}>
        { this.showActivateButton() }
        <Text>is active: { JSON.stringify(this.state.isActive) }</Text>
        <Text>date/time: { JSON.stringify(this.state.date) }</Text>
        <Text>car_id: {this.state.car_id}</Text>
        <Text>latitude: {this.state.latitude}</Text>
        <Text>longitude: {this.state.longitude}</Text>
        <Text>speed: {this.state.speed}</Text>
      </View>
    )
  }

  watchPosition() {
    // console.log(navigator.geolocation)
    navigator.geolocation.watchPosition(success => {
      this.setState({
        date: new Date(),
        latitude: success.coords.latitude,
        longitude: success.coords.longitude,
        error: null,
        speed: success.coords.speed
      })
      if (this.state.isActive && speed > 3) {
        alert(`Your speed greater than 3 (${success.coords.speed})`)
      }
      console.log(success.coords)
    },
    error => {
      console.log(error)
    })
  }

  showActivateButton() {
    if (this.state.isActive) {
      return (
        <View>
          <TouchableHighlight onPress={ () => this.toggleStatusActive() }>
            <Image
              style={{width: 100, height: 100}}
              source={require('../img/off.png')}
            />
          </TouchableHighlight>
        </View>
      )
    } else {
      return (
        <View>
          <TouchableHighlight onPress={ () => this.toggleStatusActive() }>
            <Image
              style={{width: 100, height: 100}}
              source={require('../img/on.png')}
            />
          </TouchableHighlight>
        </View>
      )
    }
  }

  toggleStatusActive() {
    this.setState({isActive: !this.state.isActive})
  }

  // watchSpeed() {
  //   const accelerationObservable = new Accelerometer({
  //     updateInterval: 100 // defaults to 100ms
  //   })
  //
  //   // Normal RxJS functions
  //   accelerationObservable
  //     .map(({ x, y, z }) => x + y + z)
  //     .filter(speed => speed > 0)
  //     .subscribe(speed => {
  //       if (this.state.isActive && speed < 10) {
  //         console.log(`You moved your phone with ${speed}`)
  //         console.log(`Your data post to yota-API`)
  //         this.getCoordinate()
  //         // this.postCurrentPosition()
  //       } else {
  //         console.log(`You moved your phone with ${speed}`)
  //       }
  //     });
  //
  //   // setTimeout(() => {
  //   //   accelerationObservable.stop();
  //   //   console.log('acc.stop() run');
  //   // }, 1000);
  // }

  // getCoordinate() {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       // console.log('state sekarang:', this.state)
  //       // alert(JSON.stringify(position))
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         error: null
  //       })
  //     },
  //     (error) => {
  //       // alert(JSON.stringify(error))
  //       this.setState({ error: error.message })
  //     },
  //     { enableHighAccuracy: true, timeout: 10000},
  //   );
  // }

  postCurrentPosition() {
    this.getCoordinate()
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
      console.log('response axios:', response.data)
      alert(`Your data post to yota-API`)
    })
    .catch(err => {
      console.log('error axios:', err)
      alert(`error axios:`, JSON.stringify(err, null, 2))
    })
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
