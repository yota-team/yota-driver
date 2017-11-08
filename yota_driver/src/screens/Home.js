import React from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  Button,
  Image
} from 'react-native';
import { Text } from 'react-native-elements'
import { connect } from 'react-redux'
import axios from 'axios'
import Modal from 'react-native-modalbox'

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

  showActiveStatus() {
    if (this.state.isActive) {
      return <Text h3 style={{color: '#99D83A'}}>ON DRIVING</Text>
    } else {
      return <Text h3 style={{color: '#2A589E'}}>START</Text>
    }
  }

  render() {
    return (
      <View style={styles.container}>
        { this.showActivateButton() }
        { this.showActiveStatus() }

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#343D33', borderRadius: 5, paddingVertical: 20, paddingHorizontal: 50 }}>

          <Text style={{ fontWeight: 'bold', color: 'white' }}>Speed:</Text>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>{(this.state.speed * 3.6).toFixed(2)} km/h</Text>

          <Text style={{ marginTop: 15, fontWeight: 'bold', color: 'white' }}>Latitude:</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{this.state.latitude.toFixed(6)}</Text>

          <Text style={{ marginTop: 15, fontWeight: 'bold', color: 'white' }}>Longitude:</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{this.state.longitude.toFixed(6)}</Text>

        </View>

        <Modal
          style={[styles.modal, styles.modal1]}
          ref={"modal1"}
        >
          <Text style={{ color: '#000' }}>Your position posted.</Text>
        </Modal>

      </View>
    )
  }

  // countFiveSeconds() {
  //   let totalSpeedPerFiveSeconds = 0
  //   if (this.state.isActive) {
  //     for (var i = 0; i < 5; i++) {
  //       setTimeout(function(){ console.log(`iter ${i+1}`) }, 3000);
  //     }
  //     if (this.state.isActive && totalSpeedPerFiveSeconds / 5 < 1) {
  //       // this.postCurrentPosition()
  //       console.log('should post now!')
  //     }
  //   }
  // }

  watchPosition() {
    // console.log(navigator.geolocation)
    navigator.geolocation.watchPosition(position => {
      this.setState({
        date: new Date(),
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        speed: position.coords.speed
      })
      if (this.state.isActive && this.state.speed < 3) {
        this.postCurrentPosition()
        console.log(`Your speed lower than 3 m/s (${this.state.speed})`)
      } else if (this.state.speed >= 3) {
        console.log(`Your speed greater than m/s 3 (${this.state.speed})`)
      }
    },
    error => {
      console.log(error)
    }, { enableHighAccuracy: true })
  }

  showActivateButton() {
    if (this.state.isActive) {
      return (
        <View>
          <TouchableHighlight onPress={ () => this.toggleStatusActive() }>
            <Image
              style={{width: 100, height: 100, marginBottom: 10}}
              source={require('../img/on.png')}
            />
          </TouchableHighlight>
        </View>
      )
    } else {
      return (
        <View>
          <TouchableHighlight onPress={ () => this.toggleStatusActive() }>
            <Image
              style={{width: 100, height: 100, marginBottom: 10}}
              source={require('../img/YOTA-LOGO.png')}
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
    // this.getCoordinate()
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
      this.refs.modal1.open()
      setTimeout(() => {
        this.refs.modal1.close()
      }, 2000)
      console.log('response axios:', response.data)
      // alert(JSON.stringify(response.data, null, 2))
    })
    .catch(err => {
      console.log('error axios:', err)
    })
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  modal1: {
    height: 70,
    width: 200,
    backgroundColor: "#fff"
  }
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
