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


            <Card key={this.props.order.order_number} title={this.props.title} sectioned subdued={false}>
                <Row>
                    <div class="untacified_card" >
                        <Col sm="10" class="">

                            <List type="bullet">
                                <List.Item>Customer  : {this.props.order.customer}</List.Item>
                                <List.Item>Created At: {this.props.order.created_at}</List.Item>
                            </List>
                        </Col>
                        <Col sm="2">
                            <QRCode value={this.props.qrVal} />
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
