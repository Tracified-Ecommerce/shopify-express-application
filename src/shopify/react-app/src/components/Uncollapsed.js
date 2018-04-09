import React, { Component } from 'react';
import CollapaseCards from './collapase';
import * as axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import { Thumbnail, Card, Page, List } from '@shopify/polaris';
import Loading from './Loading';
import 'untracifiedOrders_mediaQueries.css';
const QRCode = require('qrcode.react');

class Uncollapsed extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        return (

        <div class="order_card" >
            <Card key={this.props.order.order_number} title={this.props.title} sectioned subdued={false}>
                <Row>
                    <div class="untacified_card" >
                        <Col sm="10" class="">
                            <div class="cardHeading_bullets">
                            <List type="bullet">
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
            </div>
        );
    }
}

export default Uncollapsed;
