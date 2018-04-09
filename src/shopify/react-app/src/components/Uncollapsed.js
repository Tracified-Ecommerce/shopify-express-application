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
        var unfulfillStyle={
            textAlign:"center"
        }

        return (
            <Card key={this.props.order.order_number} title={this.props.title} sectioned subdued={false}>
                <Row id="unfulfillContent" style={unfulfillStyle}>
                    <div>
                        <Col sm="10" >
                            <div class="cardHeading_list">
                            <List type="bullet" class="cardHeading_bullets">
                                <List.Item>Customer  : {this.props.order.customer}</List.Item>
                                <List.Item>Created At: {this.props.order.created_at}</List.Item>
                            </List>
                            </div>
                        </Col>
                        <Col sm="2">
                        <div class="qrcode_div">
                            <QRCode value={this.props.qrVal} />
                            </div>
                        </Col>
                    </div>
                </Row>
                <Row>
                    <CollapaseCards itemArray={this.props.order.lineItems} resetOrders={this.props.resetOrders} products={this.props.productsProp} orderID={this.props.order.id} />
                </Row>
            </Card>
        );
    }
}

export default Uncollapsed;
