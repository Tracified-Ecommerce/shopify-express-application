/**
 * @name untracifiedOdrCard.js
 * @description All the orders are displays as a card in untracified orders page. It 
 * can easily filter  & check required order details & also have a QR code to the 
 * order fulfilment.
 **/

import React, { Component } from 'react';
import untracifiedItemList from './untracifiedItemList';
import * as axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import { Thumbnail, Card, Page, List } from '@shopify/polaris';
import loading from '../loading';
import './untracifiedOdrs/untracifiedOrders_mediaQueries.css';
const QRCode = require('qrcode.react');

class untracifiedOdrCard extends Component {

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
                            <QRCode className="QRcode" size={140} value={this.props.qrVal} />
                        </Col>
                </Row>
                <Row id="unfulfillproducts">
                    <untracifiedItemList  itemArray={this.props.order.lineItems} style={markAsTracifiedBtnStyle} resetOrders={this.props.resetOrders} products={this.props.productsProp} orderID={this.props.order.id} />
                </Row>
            </Card>
            </div>
        );
    }
}

export default untracifiedOdrCard;
