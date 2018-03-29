import React, { Component } from 'react';
import { Row, Col, Container,Button} from 'reactstrap';
// import {Button} from '@shopify/polaris';
import './productMappingCard.css';

class ProductMappingCard extends Component{
    render(){
        var cardStyle={
            backgroundColor:'white',
            width: '360%'            
        }

        var saveBtnStyle={
            backgroundColor:"#5d6bc4", 
            color:"white"
        }

        return(
            
            <div className="cardProductMapping" style={cardStyle}>
                <Container>
                <Row>
                    <Col xs="8" sm="8" md="8" lg="8">
                      <p className="MappingDetails" style={{fontWeight:'bold',fontSize:'120%'}}>Product Mapping Details</p>
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4" className="saveBtn">
                      {/*<Button primary onClick={this.onSubmit} style={saveBtnStyle}>Save</Button>*/}
                    </Col>
                  </Row>
                <Container >
                  <Col xs="12" sm="12" md="12" lg="12" className="tblHeaders">
                    <Col xs="5" sm="5" md="5" lg="5" className="pName">Product Name</Col>
                    <Col xs="2" sm="2" md="2" lg="2" className="Pid">Product Item ID</Col>
                    <Col xs="3" sm="3" md="3" lg="3" className="tTitle">Tracified Item title</Col>
                    <Col xs="2" sm="2" md="2" lg="2" className="Permission">Permission</Col>
                  </Col>
                </Container>
                </Container>
            </div>
        );
    }
}

export default ProductMappingCard;