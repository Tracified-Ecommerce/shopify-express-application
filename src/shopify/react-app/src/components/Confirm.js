import React, { Component } from 'react';
import { Button, DisplayText,TextStyle, TextContainer } from '@shopify/polaris';
import './confirm.css';

class Confirm extends Component {
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
        zIndex: 200,
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
        maxWidth: 448,
        minHeight: 150,
        margin: '0 auto',
        padding: 30
      };

      const footerStyle = {
        position: "relative", 
        bottom: 0, 
        width: "100%", 
        height: "50px",
        textAlign: "center"
      };

      var spaceBetweenHeadingStyle={
        height:"10%"
      }
         
      return (
        <div className="backdrop" style={backdropStyle}>
          <div className="alertBox" style={modalStyle}>
          <TextContainer>
            <DisplayText size="small" element="h1">{this.props.heading}</DisplayText>
            <div className="spaceBetweenHeading"></div>
            <TextStyle variation="subdued">{this.props.message}</TextStyle>  
          </TextContainer>

           <hr/> 
           
            <div className="alertFooter" style={footerStyle}>
            <Button className="confirmBtn" primary onClick={this.props.onConfirm} icon="save">
              Confirm
            </Button>

            {/* <div className="CloseBtn"> */}
              <Button className="cancelBtn" primary onClick={this.props.onCancel} icon="cancel">
                Cancel
              </Button>
            {/* </div> */}
            </div>
          </div>
        </div>
      );
    }
  }

  export default Confirm