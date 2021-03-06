import React, { Component } from 'react';
import { Button, DisplayText, TextStyle , TextContainer , } from '@shopify/polaris';
import './alert.css';
import { Container, Row, Col } from 'reactstrap';

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
        maxWidth: 450,
        minHeight: 150,
        margin: '0 auto',
        padding: 25
      };

      const footerStyle = {
        position: "relative", 
        bottom: 0, 
        width: "100%", 
        // height: "50px",
        textAlign: "center"
      };

      const closeBtnStyle ={
        margin: 'auto'
      };

      var spaceBetweenHeadingStyle={
        height:"10%"
      }

      var spaceBetweenContentStyle={
        height:"10%"
      }
  
      return (
        <div className="backdrop" style={backdropStyle}>
          <div className="alertBox" style={modalStyle}>
          <TextContainer>
            <Container>
            <Row className="heading_row">
              <Col xs="6"className="alertHleft">
                  <DisplayText size="small" element="h1">{this.props.heading}</DisplayText>
              </Col>
              <Col xs="3" className="alertHright"> 
                <div className="Mat_clsose_Icon"> 
                  <Button className="Mat_close_IconBtn" onClick={this.props.onClose} icon="cancel"></Button>
                  </div>
              </Col>
              </Row>
              <Row> 
                <Col className="alertmessage">   
                <div className="spaceBetweenHeading"></div>
                <TextStyle variation="subdued">{this.props.message}</TextStyle> 
                </Col>
            </Row>
            </Container> 
          </TextContainer>
            
            <div className="alertFooter" style={footerStyle}>
            <Button className="closeBtn" style={closeBtnStyle} primary onClick={this.props.onClose}>
              {this.props.closeBtnText}
            </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  export default Alert