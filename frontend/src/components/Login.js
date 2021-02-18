import React, {Component} from "react"
import TwitterIcon from '@material-ui/icons/Twitter'
import { Button } from '@material-ui/core'
import { ValidatorForm , TextValidator } from 'react-material-ui-form-validator'
import MenuIcon from '@material-ui/icons/Menu';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from './action/auth.js'
class Login extends Component{
    
    constructor(props){
        super(props)
    }
    
    
    state ={
        username : '',
        passowrd : ''
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        // removes space
        this.setState({ [e.target.name]: e.target.value.trim()})
    }

    static PropTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
    }

    showSidebar = () => {
        this.props.sidebarMethod()
    }
    
    onSubmit = (e) => {

        e.preventDefault()
        this.props.login(this.state.username, this.state.password)
        
    }

    render(){
        const { username, password} = this.state

        if (this.props.isAuthenticated){
            return <Redirect to="/" />
        }

        return(
            <div className="tweet__Login">

                <div className="feed__header">
                    <div className="menu_button">
                        <MenuIcon onClick={this.showSidebar}/>
                    </div>
                    <h2>Login</h2>
                </div>
                <TwitterIcon className="twiterIcon__Login" />
                
                <div>
                    <label className="login_To">Log in to Network</label>
                </div>

                <div className="tweet__LoginForm">

                    <ValidatorForm ref="form" onSubmit={this.onSubmit} > 
                        
                        <div className="login__Username">
                            <TextValidator id="filled-basic" type="text" label="username" variant="filled" name="username" value={username} validators={['required',]} errorMessages={[ 'this field is required']} onChange={this.handleChange} />
                        </div>

                        <div className="login__Password">
                            <TextValidator id="filled-basic" type="password" label="password" variant="filled" name="password" value={password} validators={[ 'required']} errorMessages={[ 'this field is required']} onChange={this.handleChange}  />
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



export default connect(mapStateToProps, { login }) (Login) 