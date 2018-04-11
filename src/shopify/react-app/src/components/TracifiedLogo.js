import React, {Component} from 'react';
import TraciLogo from '../assets/tracified_logo.png';
import './MediaQueries_Logo.css';

class TracifiedLogo extends Component{
    render(){
        var logoStyle={
            height: '150px' ,
            width: '550px'                    
        }

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
                <img src={TraciLogo} style={logoStyle}/>
            </div>
        );
    }
}

export default TracifiedLogo;