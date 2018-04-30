import React, { Component } from 'react';
import untracifiedItemList from './untracifiedItemList';
import * as axios from 'axios';
import { Container, Row, Col, Card } from 'reactstrap';
import { Thumbnail, Page, List, Button, Stack, Select, ResourceList } from '@shopify/polaris';
import loading from '../loading';
const QRCode = require('qrcode.react');

class tracifiedContentTbls extends Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            products: {},
            isOrderListloading: true
        };
    }

    componentDidMount() {
        axios.get('/shopify/shop-api/products')
            .then(response => {
                const products = response.data.products;
                this.setState({ products: response.data.products });
            }).catch((error) => {
                console.log(error);
              });
        axios.get('/shopify/shop-api/fulfilled-orders')
            .then(response => {
                this.setState({
                    orders: response.data.tracifiedContentTbls,
                    isOrderListloading: false
                });
            }).catch((error) => {
                console.log(error);
              });
    }


    render() {

        if (this.state.isOrderListloading) {
            return <loading loadMsg=" Please wait. loading item traceability..."/> ;
        }
        else {
            // All the order details
            var orders = this.state.orders;

            var orderArray = [];
            orders.forEach((order) => {
                var items = order.line_items;
                var lineItems = [];
                items.forEach(item => {
                    lineItems.push({
                        id: item.id,
                        title: item.title,
                        quantity: item.quantity,
                        variant_title: item.variant_title,
                        product_id: item.product_id
                    });
                });

                const customer = order.customer.first_name + " " + order.customer.last_name;

                orderArray.push({
                    id: order.id,
                    order_number: order.order_number,
                    lineItems: lineItems,
                    customer: customer,
                    created_at: order.created_at.substring(0, 10)
                });
            });



            return (
                <Page title="UnTracified Orders" separator>
                        {orderArray.map((order, index) => {
    const qrValue = order.order_number.toString();
    const title = "Order No: " + order.order_number;
    return (
        <Card key={order.order_number}>

            <Row>
                <Col sm="2">
                <span>{title}</span>
                </Col>
                <Col sm="3">
                <span>Customer : {order.customer}</span>                                    
                </Col>
                <Col sm="4">
                <Select
                    options={[
                        'two',
                        'three',
                        {
                            label: 'four',
                            value: '4',
                        },
                    ]}
                    placeholder="Select an Item to view"
                />
                </Col>
                <Col sm="3">
                <Button>View Trace More Timeline</Button>
                
                </Col>
            </Row>
        </Card>
    )
})}
                </Page>
            );
        }
    }
}

export default tracifiedContentTbls;

