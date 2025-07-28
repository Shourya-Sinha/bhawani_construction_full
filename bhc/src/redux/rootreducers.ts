import { combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import companyAuthReducer from './slices/Company/companyAuthSlice.ts';
import workerAuthReducer from './slices/Worker/workerAuthSlice.ts';
import companyAllOthersReducer from './slices/Company/companyAllOtherSlice.ts';
import workerOtherReducer from './slices/Worker/workerOtherAllSlices.ts';


const rootPersistConfig={
  key:"root",
  storage:AsyncStorage,
  keyPrefix:"redux-",
  version:1,
  whitelist:[],
};

const rootReducer = combineReducers({
    companyAuth:companyAuthReducer,
    companyOther:companyAllOthersReducer,
    workerAuth:workerAuthReducer,
    workerOther:workerOtherReducer,
});

export {rootPersistConfig,rootReducer};