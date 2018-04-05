import React, { Component } from 'react';
import { Button, DisplayText, TextContainer } from '@shopify/polaris';

class Alert extends Component {
    render() {
      // Render nothing if the "show" prop is false
      if(!this.props.show) {
        return null;
      }
  
      // The gray background
      const backdropStyle = {
        position: 'fixed',
        top: 0,
        bottom: 0,
        zIndex: 30,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 50
      };
  
      // The modal "window"
      const modalStyle = {
        backgroundColor: '#fff',
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 20,
        maxWidth: 500,
        minHeight: 150,
        margin: '0 auto',
        padding: 30
      };

      const footerStyle = {
        position: "relative", 
        bottom: 0, 
        width: "100%", 
        height: "50px",
      };

      const closeBtnStyle ={
        margin: 'auto'
      };
  
      return (
        <div className="backdrop" style={backdropStyle}>
          <div className="alertBox" style={modalStyle}>
          <TextContainer>
          <DisplayText size="extraLarge">{this.props.heading}</DisplayText>
            <DisplayText size="small">{this.props.message}</DisplayText>  
          </TextContainer>
            
            <div className="alertFooter" style={footerStyle}>
            <Button className="closeBtn" style={closeBtnStyle} primary onClick={this.props.onClose} >
              Close
            </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  export default Alert