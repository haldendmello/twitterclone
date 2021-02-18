// import { AccordionActions } from "@material-ui/core";

import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FIAL,
    POST_UPDATE,
    POST_ID,
    SIDEBAR_STATE,
   
} from '../action/Types.js'


const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    post_text: '',
    post_id: null,
    sidebar_state: false,
}



export default function(state = initialState, action){
    
    switch (action.type){

        case USER_LOADING:
            return{
                ...state,
                isLoading: true
            }
        
        case USER_LOADED:
            localStorage.setItem('username', action.payload.username)

            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            }

        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token)
        
            return {
                    ...state,
                    ...action.payload,
                    isAuthenticated: true,
                    isLoading: false,
            }


        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FIAL:
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            }
    
        case POST_UPDATE:
            return{
                ...state,
                post_text: action.data
            }

        case POST_ID:
            return{
                ...state,
                post_id: action.data,
            }
        
        

        default:
            return state
    }
}   