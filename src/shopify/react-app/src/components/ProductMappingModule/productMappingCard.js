import React, { Component } from 'react';
import { Row, Col, Container,Button} from 'reactstrap';
// import {Page} from '@shopify/polaris';
// import './productMappingCard.css';
import './MediaQueriesSettings.css';
import './settingsPage.css';

class ProductMappingCard extends Component{
    render(){
        var cardStyle={
            backgroundColor:'white',
            width: '100%',
            boxShadow: '0 8px 6px -6px #22384f9c', 
            // marginLeft:'2%' ,
            // height:'88px',
            // marginTop: "-4%"
        }

        var saveBtnStyle={
            backgroundColor:"#5d6bc4", 
            color:"white"            
        }

        var tdStyle={
            width:'90%'
        }

        return(
            // <Page>
            <div className="cardProductMapping" style={cardStyle}>
                <Container fluid={true} className="no-right-padding">
                <Row>
                    <Col xs="8" sm="8" md="8" lg="8">
                      <p className="MappingDetails" style={{fontWeight:'bold',fontSize:'120%'}}>Product Mapping Details</p>
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4" className="saveBtn">
                      {/*<Button primary onClick={this.onSubmit} style={saveBtnStyle}>Save</Button>*/}
                    </Col>
                  </Row>
                <Container fluid={true} className="no-right-padding">
                  <Col xs="12" sm="12" md="12" lg="12" className="tblHeaders col-xs-12">
                    <Col xs="5" sm="5" md="5" lg="5" className="pName col-xs-5">Product Name</Col>
                    <Col xs="2" sm="2" md="2" lg="2" className="Pid col-xs-2">Product Item ID</Col>
                    <Col xs="3" sm="3" md="3" lg="3" className="tTitle col-xs-3">Tracified Item title</Col>
                    <Col xs="2" sm="2" md="2" lg="2" className="Permission col-xs-2">Permission</Col>
                  </Col>
                </Container>
                </Container>
            </div>
            // </Page>
        );
    }
}

export default ProductMappingCard;