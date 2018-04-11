import React, {Component} from 'react';
import TraciLogo from '../assets/tracified_logo.png';

class TracifiedLogo extends Component{
    render(){
        var logoStyle={
            height: '165px' ,
            width: '100%'
                    
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
            <div style={backStyle}>
                <img src={TraciLogo} style={logoStyle}/>
            </div>
        );
    }
}

export default TracifiedLogo;