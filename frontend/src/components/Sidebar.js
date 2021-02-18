import React , {Component} from "react"
import TwitterIcon from '@material-ui/icons/Twitter'
import SidebarOption from "./SidebarOption"
import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import { Button } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import { Link, NavLink } from 'react-router-dom'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logout } from './action/auth.js'


class Sidebar extends Component{
    constructor(props){
        super(props)


        
    }


    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
    };


    render(){
        const { isAuthenticated, user } = this.props.auth

        var url_user = ''

        user ? url_user = user.username  : url_user =''
        



        const user_login = (
            <>
                <Link to="/login" style={{ textDecoration:"none" , color:"black"}}> <SidebarOption sidebardata={{text:"Log in", icon: <LockOpenIcon />, }} /> </Link> 
                <Link to="/signup" style={{ textDecoration:"none" , color:"black"}} ><SidebarOption sidebardata={{text:"Sign up", icon:<VpnKeyIcon />, }} /> </Link>
            </>
        )   

        const user_logout = (
            <>
                <Link to="/following" style={{ textDecoration:"none", color:"black"}}><SidebarOption sidebardata={{ text:"Following", icon:<SearchIcon /> }} />  </Link>
                <Link to={`/profile/${url_user}`} style={{ textDecoration:"none" , color:"black"}}><SidebarOption  sidebardata={{ text:"Profile", icon:<PermIdentityIcon />,}} /></Link>
                <a onClick={this.props.logout}><SidebarOption  sidebardata={{ text:"Logout", icon:<ExitToAppIcon /> }} /></a>
            </>
        )
        return(
            <div className="sidebar">
                <TwitterIcon className="sidebar__twitterIcon" />
                
                <Link to="/" style={{ textDecoration:"none" , color:"black"}} > <SidebarOption sidebardata={{ text:"Home", icon:<HomeIcon />}} />  </Link>
  
                {isAuthenticated ? user_logout : user_login }
        
            </div>
        ) 
    }

}

const mapStateToProps = (state) => ({
    auth: state.auth,
  });

export default connect(mapStateToProps, {logout})(Sidebar)