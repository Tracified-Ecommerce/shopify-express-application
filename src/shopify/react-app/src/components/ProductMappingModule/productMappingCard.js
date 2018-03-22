import React, { Component } from 'react';
import { Row, Col, Container,Button} from 'reactstrap';
// import {Button} from '@shopify/polaris';
import './productMappingCard.css';

class ProductMappingCard extends Component{
    render(){
        var cardStyle={
            backgroundColor:'white',
            width: '260%',
            boxShadow: '0 8px 6px -6px #22384f9c',            
        }

        var saveBtnStyle={
            backgroundColor:"#5d6bc4", 
            color:"white",
            // marginLeft: "-30%"
        }

        var tdStyle={
            // marginLeft:'-10%',
            width:'90%'
        }

        return(
            
            <div className="cardProductMapping" style={cardStyle}>
                
                <tr style={tdStyle}>
                    <td>
                        <div className="mappingDetailsDiv" style={tdStyle}>    
                            <p className="MappingDetails" style={{fontWeight:'bold',fontSize:'120%'}}>Product Mapping Details</p>
                         </div>
                    </td>
                    <td className="saveBtn">
                      <Button onClick={this.onSubmit} style={saveBtnStyle}>Save</Button>
                    </td>
                </tr>
                
                <tr >
                  <Row className="tblHeaders" >
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