import React, { Component } from 'react';
import CollapaseCards from './collapase';
import * as axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import { Thumbnail, Card, Page, List } from '@shopify/polaris';
import Loading from './Loading';
import './untracifiedOrders_mediaQueries.css';
const QRCode = require('qrcode.react');

class Uncollapsed extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    
    render() {
        
        return (
            <Card id="cardHeader" key={this.props.order.order_number} title={this.props.title} sectioned subdued={false}>
                <Row id="unfulfillContent">
                        
                        <Col sm="10"  className="unfulfillColLeft" >
                            <List type="none" id="untracified_list" >
                                <List.Item>Customer  : {this.props.order.customer}</List.Item>
                                <List.Item>Created At: {this.props.order.created_at}</List.Item>
                            </List>
                        </Col>
                        <Col sm="2" >
                            <QRCode value={this.props.qrVal} />
                        </Col>
                </Row>
                <Row id="unfulfillproducts">
                    <CollapaseCards itemArray={this.props.order.lineItems} resetOrders={this.props.resetOrders} products={this.props.productsProp} orderID={this.props.order.id} />
                </Row>
            </Card>
        );
    }
}

export default Uncollapsed;
