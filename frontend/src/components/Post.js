import React, {Component} from "react"
import { Avatar } from "@material-ui/core"
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import RepeatIcon from '@material-ui/icons/Repeat';
import { Button } from "@material-ui/core"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';  

import store from './store.js'

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const ITEM_HEIGHT = 48;
class Post extends Component{
    constructor(props){
        super(props)

        this.change = this.change.bind(this)
        this.handelLike = this.handelLike.bind(this)
        this.handeldisLike = this.handeldisLike.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.deletePost = this.deletePost.bind(this)

        this.state = {
            like: this.props.postdata.is_like,
            count_like: this.props.postdata.like_count,
            anchorEl: null,
        }
    
    }   

    static propTypes = {
        auth: PropTypes.object.isRequired,

    }

    handleClick = (event) => {

        this.setState({
            anchorEl: event.currentTarget
        })
    }

    handleClose(){

        this.setState({
            anchorEl: null
        })
    }

    deletePost(id){
        this.handleClose()
        if(this.props.auth.token){
            // get token from state 
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
    
            fetch(`/api/post-delete/${id}`, 
    
            {method:'POST',
              headers: { 'Content-Type': 'application/json' },
              headers: {'Authorization': `Token ${this.props.auth.token}` }
        
            })

            this.props.fetch_posts()
    
        }
    }


    change(id, post){
        this.handleClose()
        store.dispatch({ type: 'POST_UPDATE', data: post,})
        store.dispatch({ type: 'POST_ID', data: id,})

        window.scroll({
            top: 0,  
            behavior: 'smooth',
        })

    }
    
    handelLike(id){
        if(this.props.auth.token){
            // get token from state 
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
    
            fetch(`/api/post-like/${id}`,
    
            {method:'PUT',
              headers: { 'Content-Type': 'application/json' },
              headers: {'Authorization': `Token ${this.props.auth.token}` }
        
            })

            this.setState({
                like:true
            })
            this.setState(prevState => ({
                count_like: prevState.count_like + 1,
            }))
    
        }
        
    }

    handeldisLike(id){
        if(this.props.auth.token){
            // get token from state 
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
    
            fetch(`/api/post-dislike/${id}`, 
    
            {method:'PUT',
              headers: { 'Content-Type': 'application/json' },
              headers: {'Authorization': `Token ${this.props.auth.token}` }
        
            })
            this.setState({
                like:false
            })
            this.setState(prevState => ({
                count_like: prevState.count_like - 1,
            }))
            
    
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
            <div className="post">
                <div className="post_avatar" >
                    <Avatar >{this.props.postdata.user.charAt(0).toUpperCase()}</Avatar>
                </div>
                <div className='post__body'>
                    <div className="post__header">
                        <div className="post__headerText">
                            <h3>
                                <Link to={`profile/${this.props.postdata.user}`} style={{color:"black"}} >
                                    {this.props.postdata.user} 
                                </Link>
                                <span className="post__headerSpecial">
                                    @{this.props.postdata.user}. {this.props.postdata.time}
                                </span>
                                {
                                    log_user == this.props.postdata.user 
                                    ?   <span className="post_edit">
                                            {/* <Button onClick={() => this.change(this.props.postdata.id, this.props.postdata.post)} >edit</Button> */}
                                            <IconButton
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={this.handleClick}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={this.state.anchorEl}
                                                keepMounted
                                                open={Boolean(this.state.anchorEl)}
                                                onClose={this.handleClose}
                                                PaperProps={{
                                                style: {
                                                    maxHeight: ITEM_HEIGHT * 4.5,
                                                    width: '20ch',
                                                },
                                                }}
                                            >
                                                <MenuItem onClick={() => this.change(this.props.postdata.id, this.props.postdata.post)}>Edit.</MenuItem>
                                                <MenuItem onClick={() => this.deletePost(this.props.postdata.id)}>Delete.</MenuItem>
                                            </Menu>
                                        
                                        </span>

                                   
                                    :''
                                }
                                
                            </h3>
                        </div>

                        <div className="post__headerDescription">
                            <p>{this.props.postdata.post}</p>
                        </div>
                    </div>
                    <div className="post__footer">
                        <div className="post__LikeButton">
                            {
                                this.state.like == false
                                ? <FavoriteIcon onClick={() => this.handelLike(this.props.postdata.id)} fontSize="small" />
                                : <FavoriteIcon onClick={() => this.handeldisLike(this.props.postdata.id)} fontSize="small" style={{ color: red[500] }} />

                            }

                            <span className="post__Like" >{this.state.count_like}</span>
                        </div>
                        <ChatBubbleOutlineOutlinedIcon fontSize="small"/>
                        <RepeatIcon fontSize="small"/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
  });

export default connect(mapStateToProps)(Post)