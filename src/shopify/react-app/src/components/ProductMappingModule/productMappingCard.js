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
                <ProductMappingCard/>
            </div>
        );
    }
}

export default ProductMappingCard;