import React,  {  useState, useEffect }from "react"
import { render } from "react-dom"

import Sidebar from "./Sidebar"
import Feed from "./Feed"
import Signup from './Signup'
import Login from './Login'
import Profile from './Profile'
import PrivateRoute from './PrivateRoute.js'   

import store from './store.js'
import { Provider } from 'react-redux'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    
} from 'react-router-dom'

import { loadUser } from './action/auth.js'

import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'

import { makeStyles, useTheme } from '@material-ui/core/styles'

import { connect } from 'react-redux'

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },    
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
      // padding: theme.spacing(1),
    },
}));


function App(props){ 

    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();

    const [mobileOpen, setMobileOpen] = React.useState(false)


    useEffect(() => {   
        store.dispatch(loadUser())
        
    },[])

    const container = window !== undefined ? () => window().document.body : undefined;

    
    const menuOpen = () => {
        setMobileOpen(!mobileOpen);
    }

    return (
        <div className='app'>
            <Provider store={store}>
                <Router>  

                        <nav className={classes.drawer} aria-label="mailbox folders">

                            <Hidden smUp implementation="css">
                                <Drawer
                                    container={container}
                                    variant="temporary"
                                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                                    open={mobileOpen}
                                    onClose={menuOpen}
                                    classes={{
                                    paper: classes.drawerPaper,
                                    }}
                                    ModalProps={{
                                    keepMounted: true, // Better open performance on mobile.
                                    }}
                                >
                                <Sidebar/>
                                </Drawer>
                            </Hidden>



                            <Hidden xsDown implementation="css">
                                <Drawer
                                    classes={{
                                    paper: classes.drawerPaper,
                                    }}
                                    variant="permanent"
                                    open
                                >
                                    <Sidebar/>
                                </Drawer>
                            </Hidden>
                        </nav>

                        <Switch>
                            <main className={classes.content}>
                                <Route path="/" exact component={() => <Feed sidebarMethod={menuOpen} data={{posts: "All Posts" , name:"allposts" , }} />} />
                                <PrivateRoute path="/following" component={() => <Feed sidebarMethod={menuOpen} data={{posts: "Following Posts", name:"following"}} />} />                           
                                <Route path="/profile/:username" component={() => <Profile sidebarMethod={menuOpen} data={{posts: "userposts"}} ></Profile>} />
                                <Route path="/login" component={() => <Login sidebarMethod={menuOpen} /> } />
                                <Route path="/signup" component={() => <Signup sidebarMethod={menuOpen} /> } />
                            </main>
                        </Switch>

                </Router>
            </Provider>
            
        </div>
    )  
        
}
const appdiv = document.getElementById("root")
render(<App />,appdiv)

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(App)