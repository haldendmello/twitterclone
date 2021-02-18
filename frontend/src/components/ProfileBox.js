import React,  {  useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Avatar , Button, FormControlLabel, setRef } from '@material-ui/core'
import axios from 'axios'
import MenuIcon from '@material-ui/icons/Menu'



import { connect } from 'react-redux';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    orange: {
      width:'max(45px, min(135px, 22vw))',
      height:'max(45px, min(135px, 22vw))',
      position:'absolute',
      bottom:'max(-60px, -10vw)',
      marginLeft:'1vw',
      borderRadius:'50%',
      border: '4px  solid',
      fontSize:'7em', 

      '@media (max-width:672px)': {
        fontSize: '4rem',
      },
    },

  
}));


function ProfileBox (props){
  
    const classes = useStyles()


    const [is_following, setis_following] = useState([false])
    const [follower_count, setfollower_count] = useState([0])

    const showSidebar = () => {
      props.method()
    }
    
    useEffect(() => {
      setis_following(props.profiledata.is_following)
      setfollower_count(props.profiledata.follower_count)
    }, [])

    function toggel_follow(id){
      
      if(props.auth.token){
        // get token from state 
        const token = props.auth.token
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

        fetch(`/api/profile-follow/${id}`, 

        {method:'POST',
          headers: { 'Content-Type': 'application/json' },
          headers: {'Authorization': `Token ${props.auth.token}` }
    
        })

        setis_following(true)
        setfollower_count(prevfollower_count => prevfollower_count + 1)
        }
    }

    function toggel_unfollow(id){
    
      if(props.auth.token){
        // get token from state 
        const token = props.auth.token
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

        fetch(`/api/profile-unfollow/${id}`, 

          {method:'POST',
            headers: { 'Content-Type': 'application/json' },
            headers: {'Authorization': `Token ${props.auth.token}` }
    
          })
          setis_following(false)
          setfollower_count(prevfollower_count => prevfollower_count - 1)
      }
    }

    return(
      <>
        <div className="profileBox">
          
            <div className="feed__header">
              <div className="menu_button">
                <MenuIcon onClick={showSidebar}/>
              </div>  
              <h2>{props.profiledata.user}</h2>  
            </div>

            <div className="profile__Header">

                <div className="profile__Banner"></div>
                <span className="profile__Avatar">  
                    <Avatar className={classes.orange}>{props.profiledata.user.charAt(0).toUpperCase()}</Avatar>

                </span>

              {
                !props.auth.user ? ''

                : props.auth.user.username == props.profiledata.user ? ''

                : is_following == false ? <Button id="followbutton" onClick={() => toggel_follow(props.profiledata.id) } className="follow__Button">Follow </Button>

                : is_following == true ? <Button id="followbutton" onClick={() => toggel_unfollow(props.profiledata.id) }  className="follow__Button">UnFollow</Button>

                : ''
              }
            </div>

            <div className="profile__Bio">
              <p className="profile__UserName">{props.profiledata.user}</p>
              <p className="profile__User">@{props.profiledata.user}</p>
              <p className="profile__Joined">joined {props.profiledata.timestamp}</p>
            </div>

            <div className="profile__Follow">
              <p className="profile__Following">{props.profiledata.following_count} following</p>
              <p className="profile__Folowers" >{follower_count} followers</p>
            </div>
        </div>
          
      

      </>
    )

}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProfileBox)
