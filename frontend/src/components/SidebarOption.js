
import React , {Component} from "react"
import { Link } from "react-router-dom"

class SidebarOption extends Component{
    constructor(props){
        super(props)
    }




    render(){

        return(
            // <div className={ window.location.pathname == this.props.sidebardata.active_F ? 'sidebarOption--active' : '' } >

            <div className={`sidebarOption ${this.props.active && 'sidebarOption--active'}`}>

                {this.props.sidebardata.icon}
                <h2> {this.props.sidebardata.text}</h2>
              

            </div>
            
        )
    }
}


export default SidebarOption