const defaultState = {
  isLogin: true,
  username: '',
  password: ''
}

const Reducer = (state=defaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {...state, user: action.payload.user, password: action.payload.password, isLogin: action.payload.isLogin}
      
    default:
        return state
  }
}

export default Reducer
