import React, { Component } from 'react';
import { Row, Col, Container,Button} from 'reactstrap';
// import {Button} from '@shopify/polaris';
import './productMappingCard.css';

class ProductMappingCard extends Component{
    render(){
        var cardStyle={
            backgroundColor:'white',
            width: '250%'            
        }

        var saveBtnStyle={
            backgroundColor:"#5d6bc4", 
            color:"white"
        }

        return(
            
            <div className="cardProductMapping" style={cardStyle}>
                <tr>
                    <td>
                      <p className="MappingDetails" style={{fontWeight:'bold',fontSize:'120%'}}>Product Mapping Details</p>
                    </td>
                    <td className="saveBtn">
                      <Button primary onClick={this.onSubmit} style={saveBtnStyle}>Save</Button>
                    </td>
                  </tr>
                <tr >
                  <Row className="tblHeaders">
                    <Col sm="5" xs="5" className="pName">Product Name</Col>
                    <Col sm="2" xs="2" className="Pid">Product Item ID</Col>
                    <Col sm="3" xs="3"className="tTitle">Tracified Item title</Col>
                    <Col sm="2" xs="2" className="Permission">Permission</Col>
                  </Row>
                </tr>
            </div>
        );
    }
}

export default ProductMappingCard;