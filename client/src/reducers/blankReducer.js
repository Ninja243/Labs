const initialState = {
  i: 0,
  profile: []
}
const blankReducer = function (state = initialState, action) {
  //console.log("Reducer ->",action);
  switch(action.type){
    case "INCREMENT":
      return {
        ...state,
        i: state.i+1
      }
    case "LOG_IN":
      console.log("A");
      console.log(action.payload);
      return {
        ...state,
        profile: action.payload
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
