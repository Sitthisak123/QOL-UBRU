// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import rootReducer from './reducers';

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['key1', 'key2'],//Things you want to persist
//   blacklist: ['key3', 'key4'],//Things you don't want to persist
// };

// // Middleware: Redux Persist Persisted Reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = configureStore({
//   reducer: persistedReducer,
// });
// export const persistor = persistStore(store);