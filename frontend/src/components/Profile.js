import React,  { useState, useEffect } from "react"
import ProfileBox from "./ProfileBox"
import TweetBox from "./TweetBox"
import Post from "./Post"
import axios from 'axios'
import {
    useParams
  } from "react-router-dom";

import { connect } from 'react-redux';

import { colors } from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"


  
function Profile(props){

    const [profile, setprofile] = useState([])  //state of profile user

    const [posts, setPosts] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [currentpage, setCurrentpage] = useState(1)
    let { username } = useParams();
    
    let Current_page = currentpage

    useEffect(() => {   
        fetch_posts()
        fetch_user()
        console.log('clicked sidebar profile')
      },[])

    const scroll_Top = () => {
        window.scroll({
            top: 0,  
            behavior: 'smooth',
        })
    }

    
    const handlePageChange = (event, value) => {
        let num = value
        Current_page = num
        setCurrentpage(num)
        
        fetch_posts()

        scroll_Top();

    }

    function fetch_user(){
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
          axios.get(`/api/profile/${username}`, config)
          .then(res => {
            setprofile(res.data)
          })
          
    
        }else{
    
            axios.get(`/api/profile/${username}`)
            .then(res => {
                setprofile(res.data)
            })
        
        }

      }



   

    function fetch_posts(){

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
        axios.get(`/api/posts/${username}?page=${Current_page}`, config)
            .then(res => {
                setPosts(res.data.results)
                setPageCount(Math.ceil((res.data.count)*10/100))

            })
    }
    
    let log_user
    if(localStorage.getItem("username")){
        log_user = localStorage.getItem("username")
    }else{
        log_user = ''
    }

    let endmessage

    if (posts.length == 0){
        if (log_user == username) {
            endmessage = (
                <div className="error_message" >
                    You don't have any post's yet
                </div>
            )
        }else{
            endmessage = (
                <div className="error_message" >
                    No post's exist's
                </div>   
            )
        }
    }else{
        if (pageCount <= 1) {
            endmessage = (
                ''
            )
        }else{
            endmessage = (
                <Pagination
                    count={pageCount}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlePageChange}
                    siblingCount={0}
                />
            )
        }
    }

    

   
    
    return(
        <div className="tweet__Profile">
            {
                profile.map(prouser => <ProfileBox profiledata={{id: prouser.id, user: prouser.user, follower_count: prouser.follower_count, following_count: prouser.following_count, is_following: prouser.is_following, timestamp: prouser.timestamp}} method={props.sidebarMethod} />)

            }
            {
            log_user == username ? <TweetBox fetch_posts={fetch_posts} /> : ''
            }
 
            {
                posts.map(post => <Post fetch_posts={fetch_posts} postdata={{ id: post.id, user: post.user , post: post.post , like_count: post.like_count, is_like: post.is_like, time: post.timestamp}} /> )
            }
        
            {endmessage}
            
        </div>
    )
    
}

const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  
export default connect(mapStateToProps)(Profile)