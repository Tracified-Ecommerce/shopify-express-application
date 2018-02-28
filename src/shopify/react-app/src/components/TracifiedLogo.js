import React, {Component} from 'react';
import TraciLogo from '../assets/tracified_logo.png';

class TracifiedLogo extends Component{
    render(){
        var logoStyle={
            // height: '250px'             
        }

        var backStyle={
            backgroundColor:"black",
            textAlign: 'center'
        }

        var wrapperStyle={
            width:'100%'
        }

        return(
<<<<<<< HEAD
            <div style={wrapperStyle} >
                <div style={backStyle}>
                    <img src={TraciLogo} style={logoStyle}/>
                </div>
=======
            <div >
                <img src={TraciLogo} style={logoStyle}/>
>>>>>>> 2eb42889215fdd6533eb43288a80bb24aa2f5079
            </div>
        );
    }
}

export default TracifiedLogo;