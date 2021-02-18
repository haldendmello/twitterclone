import axios from 'axios'

import { returnErrors } from './messages'

import  {
    USER_LOADED,  
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
} from './Types.js'

import store from '../store.js'

// check token and load user 

export const loadUser = () => (dispatch, getState) => {
    // user loading

    dispatch({ type: USER_LOADING })

    // get token from state 

    const token = getState().auth.token

    // headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // if token, add to headers config
    if(token){
        config.headers['Authorization'] = `Token ${token}`
    }

    axios.get('/api/user', config)
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
                
            })
            
        }).catch(err => {
            dispatch( returnErrors(err.response.data, err.response.status))
            
            dispatch({
                type: AUTH_ERROR,
            })
        })
        
}



// LOGIN USER 

export const login = (username, password) => (dispatch) => {
   

    // headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    // request body

    const body = JSON.stringify({ username, password })

    axios.post('/api/login', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS, 
                payload: res.data,
                
            })
        }).catch(err => {
            dispatch( returnErrors(err.response.data, err.response.status))
            
            dispatch({
                type: LOGIN_FAIL,
            })
        })

        
        
        
}


// Register User


export const register = ({ username, email, password }) => (dispatch) => {
    // Headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  
    // Request Body
    const body = JSON.stringify({ username, email, password })
  
    axios.post('/api/register', body, config)
        .then((res) => {
            dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
            })
        }).catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status))

            dispatch({
            type: REGISTER_FAIL,
            })
      
    })
}




// logout user

export const logout = () => (dispatch, getState) => {
    
    // get token from state

    const token = getState().auth.token

    // headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // if token, add to headers config
    if(token){
        config.headers['Authorization'] = `Token ${token}`
    }

    axios.post('/api/logout',null, config)
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS,
         
            })
        }).catch(err => {
            dispatch( returnErrors(err.response.data, err.response.status))
            
            
        })

}