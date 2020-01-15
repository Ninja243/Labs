const initialState = {
  i: 0,
  profile: {
    name: null,
    given_name: null,
    family_name: null,
    nickname: null,
    email: null,
  }
}
const blankReducer = function(state = initialState, action) {
  switch(action.type){
    case "INCREMENT":
      return {
        ...state,
        i: state.i+1
      }
    case "LOG_IN":
      return {
        ...state,
        profile: action.payload
      }
    case "LOG_OUT":
      return {
        ...state,
        profile: {
          name: null,
          given_name: null,
          family_name: null,
          nickname: null,
          email: null,
        }
      }
    default: return state;
  }
}

export default blankReducer;
