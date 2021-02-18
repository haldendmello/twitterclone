import React, {Component} from "react"
import TwitterIcon from '@material-ui/icons/Twitter'
import { Button } from '@material-ui/core'
import { ValidatorForm , TextValidator } from 'react-material-ui-form-validator'

import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import { register } from './action/auth.js'
import { createMessage } from './action/messages.js'
import { connect } from 'react-redux'
import MenuIcon from '@material-ui/icons/Menu';

class Signup extends Component{
    

    state = {
        username : '',
        email : '',
        password : '',
        password2 : '',
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        // removes space
        this.setState({ [e.target.name]: e.target.value.trim()})
    }

    showSidebar = () => {
        this.props.sidebarMethod()
    }

    componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
    }

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
    };

    onSubmit = (e) => {
        e.preventDefault()
        const { username, email, password, password2 } = this.state;
        
        if(password != password2){
            this.props.createMessage({ passwordNotMatch: 'Password do not match'})
        }else{ 
            const newUser = {
                username,
                email,
                password,
            }

            this.props.register(newUser)
        }

    }


    render(){

        if (this.props.isAuthenticated){
            return <Redirect to="/" />
        }

        const { username, email, password, password2 } = this.state

        return(
            <div className="tweet__Signup">

                <div className="feed__header">
                    <div className="menu_button">
                        <MenuIcon onClick={this.showSidebar}/>  
                    </div>                    
                    <h2>Sign Up</h2>
                </div>
                <TwitterIcon className="twiterIcon__Login" />
                
                <div>
                    <label className="login_To">Create your account</label>
                </div>

                <div className="tweet__SignupForm">

                    <ValidatorForm ref="form" onSubmit={this.onSubmit} >
                        
                        <div className="signup__Username">
                            <TextValidator id="filled-basic" label="username" type="text" variant="filled" name="username" value={username} validators={['required',]} errorMessages={[ 'this field is required']} onChange={this.handleChange} />
                        </div>

                        <div className="signup__Email">
                            <TextValidator id="filled-basic" label="email" type="email" variant="filled" name="email" value={email} validators={['required','isEmail']} errorMessages={['this field is required', 'email is not valid']} onChange={this.handleChange}/>
                        </div>

                        <div className="signup__Password">
                            <TextValidator id="filled-basic" label="pasword" type="password" variant="filled" name="password" value={password} validators={[ 'required']} errorMessages={[ 'this field is required']} onChange={this.handleChange}/>
                        </div>

                        <div className="signup__ConPassword">
                            <TextValidator id="filled-basic" label="confirm password" type="password" name="password2" variant="filled" value={password2} validators={['isPasswordMatch', 'required']} errorMessages={['password mismatch', 'this field is required']} onChange={this.handleChange}/>
                        </div>


                        <div >
                            <Button type="submit" variant="outlined" className="login__Submit" >Submit</Button>
                        </div>

                    </ValidatorForm>

                </div>

            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, {register, createMessage})( Signup )