export function increment(){
  return {type: "INCREMENT"}
}

export function logIn(profile) { 
  //console.log("Action -> ", profile);
  return {type: "LOG_IN", payload: profile}
}

export function setReady(bool) { 
  return {type: "APP_READY", payload: bool}
}

export function logOut() { 
  return {type: "LOG_OUT"}
}

// export {
//   getStuff,
//   getStuffAsync,
//   openStuff
// } from "./exampleActions";
