/**
 * @name tracifiedLogo.js
 * @description Component which contain tracified logo.  
 **/

import React, {Component} from 'react';
import TraciLogo from '../assets/tracified_logo.png';
import './styleCSS/tracifiedLogo-MediaQueries.css';

class TracifiedLogo extends Component{
    render(){
        var backStyle={
            backgroundColor:"black",
            textAlign: 'center'
        }

        var wrapperStyle={
            height:'50%',
            textAlign: 'center'
        }

        return(
            <div className="LogoWrapper" style={backStyle}>
                <img src={TraciLogo} />
            </div>
        );
    }
}

export default TracifiedLogo;