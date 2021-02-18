import React ,{Component} from "react"
import TweetBox from "./TweetBox"
import Post from "./Post"
import axios from 'axios'

import { loadUser } from './action/auth.js'
import store from './store.js'

import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import Pagination from "@material-ui/lab/Pagination"

import MenuIcon from '@material-ui/icons/Menu';



class Feed extends Component{

    constructor(props){
        super(props)

        this.state = {
            posts: [],
            page_count: 1,  
            current_page: 1,
        }
         
        

        this.fetch_posts = this.fetch_posts.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.scroll_Top = this.scroll_Top.bind(this)
        this.showSidebar = this.showSidebar.bind(this)

    }

    static propTypes = {
        auth: PropTypes.object.isRequired,

    };

    scroll_Top = () => {
        
        window.scroll({
            top: 0,  
            behavior: 'smooth',
        })
    }

    showSidebar = () => {
        this.props.sidebarMethod()
    }

    
    componentDidMount(){
        // loading posts
        store.dispatch(loadUser())
        this.fetch_posts()

    }


    handlePageChange = (e, value) => {
        let num = value
        this.setState({ current_page: num }, () => {
            this.fetch_posts()
            this.scroll_Top()
        }); 
  
    }
    


    fetch_posts = () => {
        
        if ( this.props.data.name == "allposts"){
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

            axios.get(`api/posts-all?page=${this.state.current_page}`,config)
                .then(res => {
                    this.setState({ posts: res.data.results})
                    this.setState({ page_count: (Math.ceil((res.data.count)*10/100))})
                })
    
        }else if( this.props.data.name == "following"){

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


            axios.get(`api/following?page=${this.state.current_page}`, config)
                .then(res => {
                    this.setState({ page_count: (Math.ceil((res.data.count)*10/100))})
                    this.setState({ posts: res.data.results})


                })

        }
    }

 

    render(){
        let log_user
        if(localStorage.getItem("username")){
            log_user = localStorage.getItem("username")
        }else{
            log_user = ''
        }

        const {user} = this.props.auth

        let endmessage

        if ( this.state.posts.length  == 0 ){
            endmessage = (
            <div className="error_message"> 
                you haven't followed anyone
            </div>
        )
        }else{
            if ( this.state.page_count <= 1){
                endmessage = ('')
            }else{
                endmessage = (
                    <Pagination
                    count={this.state.page_count}
                    variant="outlined"
                    shape="rounded"
                    onChange={(e, value) => this.handlePageChange(e, value)}
                    siblingCount={0}
                />
                )
            }
        }

        

        return(
            <div className="feed">
                {/* header */}


                <div className="feed__header">
                    <div className="menu_button"  >
                            <MenuIcon onClick={this.showSidebar}/>
                    </div>
                    <h2>{this.props.data.posts}</h2>
                </div>

                {/* tweet box */}

                {
                    !log_user ? ''
                    :this.props.data.name != 'allposts' ? ''
                    :<TweetBox fetch_posts={this.fetch_posts}/> 
                }

                {/* Post */}
                {
                    this.state.posts.map(post => <Post fetch_posts={this.fetch_posts} postdata={{id:post.id , user: post.user , post: post.post , like_count: post.like_count, is_like: post.is_like, time: post.timestamp}} /> )
                }
                
                {endmessage}

            </div>            
        )   

    }
    
}
const mapStateToProps = (state) => ({
    auth: state.auth,
  });

export default connect(mapStateToProps)(Feed)