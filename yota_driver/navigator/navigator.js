import { StackNavigator } from 'react-navigation'

import Home from '../src/screens/Home'

const Navigator = StackNavigator({
  Home: { screen: Home }
},
{
  headerMode: 'none'
})

export default Navigator
