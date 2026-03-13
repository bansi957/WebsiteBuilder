import {configureStore} from '@reduxjs/toolkit'
import userReducer from "./user_slice"
export const store=configureStore({
    reducer:{
        user:userReducer
    }
})