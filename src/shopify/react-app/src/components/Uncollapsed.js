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

        var markAsTracifiedBtnStyle={
            padding:"10px",
        }
        console.log("uncollapsed rendered");
        return (
            <div className="cardUntracifiedExpand">
            <Card className="cardHeader" key={this.props.order.order_number} title={this.props.title} sectioned subdued={false}>
                <Row id="unfulfillContent">    
                        <Col sm="10"  className="unfulfillColLeft" >
                            <div className="list_col" >
                                <List type="bullet" id="untracified_list" >
                                    <List.Item className="Listitem_class">Customer  : {this.props.order.customer}</List.Item>
                                    <List.Item className="Listitem_class">Created At: {this.props.order.created_at}</List.Item>
                                </List>
                            </div>
                        </Col>
                        <Col sm="3" className="QR_col" >
                            <QRCode className="QRcode" value={this.props.qrVal} />
                        </Col>
                </Row>
                <Row id="unfulfillproducts">
                    <CollapaseCards  itemArray={this.props.order.lineItems} style={markAsTracifiedBtnStyle} resetOrders={this.props.resetOrders} products={this.props.productsProp} orderID={this.props.order.id} />
                </Row>
            </Card>
            </div>
        );
    }
}

export default Uncollapsed;
