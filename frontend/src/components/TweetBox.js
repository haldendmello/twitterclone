import React, {Component} from "react"
import { Avatar, Button } from "@material-ui/core"
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import store from './store.js'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

class TweetBox extends Component{
    constructor(props){
        super(props)
    

        this.clearText = this.clearText.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    static propTypes = {
        auth: PropTypes.object.isRequired,

    };

    handleChange = (e) => {
        e.preventDefault()
        store.dispatch({ type: 'POST_UPDATE', data: e.target.value,})
               
    }

    clearText = () => {
        store.dispatch({ type: 'POST_UPDATE', data: '',})
        store.dispatch({ type: 'POST_ID', data: null,})
    }
    
 
    handleSubmit = (e) => {
        e.preventDefault()  

        // clear state is reamailnig so do it 

        const token = this.props.auth.token

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

        var post
        let post_check = this.props.auth.post_text
        if (post_check.trim() == '') {
            alert('Tweet Box is Empty')
        }else{
            if(this.props.auth.post_id == null ){
                post = this.props.auth.post_text
                const body = JSON.stringify({ post })   
                axios.post('/api/post-create ', body,config)
                    .then(res => {
                        store.dispatch({ type: 'POST_UPDATE', data: '',})
                        store.dispatch({ type: 'POST_ID', data: null,})
                        this.props.fetch_posts()
                })
            }else{
                post = this.props.auth.post_text
                const body = JSON.stringify({ post })   
                axios.post(`/api/post-update/${this.props.auth.post_id}`, body,config)
                    .then(res => {
                        store.dispatch({ type: 'POST_UPDATE', data: '',})
                        store.dispatch({ type: 'POST_ID', data: null,})
                        this.props.fetch_posts()
                })

            }
        
        }
        

    }   


    render(){
        let log_user
        if(localStorage.getItem("username")){
            log_user = localStorage.getItem("username")
        }else{
            log_user = ''
        }           

        return(
            <div className="tweetBox">
                <form onSubmit={this.handleSubmit}>

                    <div className="tweetBox__input">
                        {
                        log_user ? <Avatar>{log_user.charAt(0).toUpperCase()}</Avatar> : ''
                        }
                            
                        <input type="text" style={{paddingRight:'35px',outlineColor:'#50b7f5'}} onChange={this.handleChange} value={this.props.auth.post_text} placeholder="What's Happening ? "></input>
                        
                        {
                            this.props.auth.post_id != null || this.props.auth.post_text
                            ? 
                                <Tooltip title="Clear Text">
                                    <IconButton className="clear_text"><CloseIcon onClick={this.clearText} /></IconButton>
                                </Tooltip>
                            :
                                ""
                        }
                    
                    </div>
                    <Button type="submit" className="tweetBox__tweetButton">Tweet</Button>
                </form>
                
            </div>            
        )  
    }

}


const mapStateToProps = (state) => ({
    auth: state.auth,
  });

export default connect(mapStateToProps)(TweetBox)