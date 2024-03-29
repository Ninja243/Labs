import { AsyncStorage } from "react-native";
import devTools from "remote-redux-devtools";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import reducer from "../reducers";
import devToolsEnhancer from 'remote-redux-devtools';
//import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
//import AsyncStorage from '@react-native-community/async-storage'; 

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducer);

export default function configureStore(onCompletion) {
  const enhancer = compose(
    applyMiddleware(thunk),
    devTools({
      name: "Labs",
      realtime: true
    })
  );

  let store = createStore(persistedReducer, enhancer);
  let persistor = persistStore(store, null, onCompletion);

  return store;
}
