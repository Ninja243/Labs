const initialState = {
  i: 0,
  profile: [],
  ready: false
}
const blankReducer = function (state = initialState, action) {
  //console.log("Reducer ->",action);
  switch(action.type){
    case "INCREMENT":
      //console.log("Increment reducer");
      return {
        ...state,
        i: state.i+1
      }
    case "LOG_IN":
      //console.log("LogIn Reducer ->", action.payload);
      return Object.assign({}, state, {
        profile: [
          ...state.profile,
          action.payload
        ]
      })
    case "APP_READY":
      return {
        ...state,
        ready: action.payload
      }
    case "LOG_OUT":
      return {
        ...state,
        profile: []
      }
    default: return state;
  }
}

export default blankReducer;
