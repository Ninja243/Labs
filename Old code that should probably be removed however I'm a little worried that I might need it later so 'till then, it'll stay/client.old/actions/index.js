export function increment(){
  return {type: "INCREMENT"}
}

export function logIn(profile) { 
  return {type: "LOG_IN"}
}

export function logOut(profile) {
  return {type: "LOG_OUT"}
}

// export {
//   getStuff,
//   getStuffAsync,
//   openStuff
// } from "./exampleActions";
