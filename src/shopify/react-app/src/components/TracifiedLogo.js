import React, {Component} from 'react';
import TraciLogo from '../assets/tracified_logo.png';

class TracifiedLogo extends Component{
    render(){
        var logoStyle={
            height: '100px'             
        }

        var backStyle={
            backgroundColor:"black",
            textAlign: 'center'
        }

        return(
            <div style={backStyle}>
                <img src={TraciLogo} style={logoStyle} alt={"tracified-logo"}/>
            </div>
        );
    }
}

export default TracifiedLogo;