import React, { Component } from 'react';
import * as axios from 'axios';
import { Page, RadioButton, Card, Stack, TextField } from '@shopify/polaris';
import { Container, Row, Col } from 'reactstrap';
import FulfilledOrder from './FulfilledOrder';
import Loading from './Loading';
import SearchInput, { createFilter } from 'react-search-input'
import ErrorMsgSearch from './errorMsgSearch';

const KEYS_TO_FILTER = ['order.order_number']
const QRCode = require('qrcode.react');

class FulfilledOrdersPage extends Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            mapping: {},
            products: {},
            shopDomain: "",
            isOrderListLoading: true,
            isMappingLoading: true,
            search: '',
            inputType: "number",
            isCheckedCus: false,
            isCheckedOrd: true,
            errorText: "No Result found"

        };
    }

    componentDidMount() {
        axios.get('/shopify/config/mapping')
            .then(response => {
                if (response.status == 200) {
                    this.setState({
                        mapping: response.data
                    });
                }
                this.setState({
                    isMappingLoading: false
                });

            }).catch(function (error) {
                console.error(error);
            });
        axios.get('/shopify/shop-api/fulfilled-orders')
            .then(response => {
                this.setState({
                    orders: response.data.fulfilledOrders,
                    shopDomain: response.data.shopDomain,
                    isOrderListLoading: false
                });
            }).catch(function (error) {
                console.error(error);
            });
    }

    // onKeyPress(event) {
    //     const keyCode = event.keyCode || event.which;
    //     const keyValue = String.fromCharCode(keyCode);
    //      if (/\+|-/.test(keyValue))
    //        event.preventDefault();
    //    }

    updateSearch(event) {
        this.setState({
            search: event.target.value.substr(0, 20),
        });
    }

    clickOrder() {
        this.setState({
            isCheckedCus: false,
            isCheckedOrd: true,
        });
    }

    clickCustomer() {
        this.setState({
            isCheckedCus: true,
            isCheckedOrd: false,
        });
    }

    render() {

        if (this.state.isOrderListLoading || this.state.isMappingLoading) {
            return <Loading />;
        }
        else {
            // All the order details

            if (this.state.isCheckedCus) {

                let orders = this.state.orders.filter(
                    (order) => {
                        let customer = "Admin created order";

                        if (order.customer) {
                            customer = order.customer.first_name + " " + order.customer.last_name;
                        }
                        const customer1 = customer.toLowerCase();
                        const customer2 = customer.toUpperCase();
                        return customer1.indexOf(this.state.search) !== -1 || customer2.indexOf(this.state.search) !== -1 || customer.indexOf(this.state.search) !== -1;
                    }
                );

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

                    let customer = "Admin created order";

                    if (order.customer) {
                        customer = order.customer.first_name + " " + order.customer.last_name;
                    }

                    orderArray.push({
                        id: order.id,
                        order_number: order.order_number,
                        lineItems: lineItems,
                        customer: customer,
                        created_at: order.created_at.substring(0, 10)
                    });
                });

            } else if (this.state.isCheckedOrd) {

                let orders = this.state.orders.filter(
                    (order) => {
                        return order.name.indexOf(this.state.search) !== -1;
                    }
                );

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

                    let customer = "Admin created order";

                    if (order.customer) {
                        customer = order.customer.first_name + " " + order.customer.last_name;
                    }

                    orderArray.push({
                        id: order.id,
                        order_number: order.order_number,
                        lineItems: lineItems,
                        customer: customer,
                        created_at: order.created_at.substring(0, 10)
                    });
                });
            } else {

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
            }


            let orders = this.state.orders.filter(
                (order1) => {
                    return order1.name.indexOf(this.state.search) !== -1;
                }
            );

            var inputStyle = {
                // marginLeft: '1%',
                // float: 'center',
                // fontSize: '14px',
                // marginTop: '1%',
                // marginBottom:'2%'
                marginLeft: '1%',
                float: 'center',
                fontSize: '14px',
                marginTop: '-4%',
                marginBottom: '1%',
                fontWeight: 400,
                lineHeight: "2.4rem",
                textTransform: "none",
                letterSpacing: "normal",
                position: "relative",
                display: "-ms-flexbox",
                display: "flex",
                msFlexAlign: "center",
                alignItems: "center",
                padding: "0 1.2rem",
                color: "#919eab",
                borderRadius: "4px"
            }

            var tableStyle = {
                backgroundColor: "white"
            }

            var filterStyle = {
                paddingBottom: 21,
                // marginTop:'-5%',
            }

            return (
                <Page title="Tracified Orders" separator>
                    <div className="filterWrapper" style={filterStyle}>
                        <Stack alignment="center" >
                            <Stack.Item>
                                <div style={{ padding: "0.4rem", marginBottom: 5, fontWeight: "bold", fontSize: "140%", paddingBottom: '9.5%' }}>
                                    Filter By :
                                </div>
                            </Stack.Item>
                            <Stack.Item>
                                <RadioButton

                                    id="id1"
                                    label="Order ID"
                                    checked={this.state.isCheckedOrd}
                                    onFocus={this.clickOrder.bind(this)}
                                />
                            </Stack.Item>
                            <Stack.Item>

                                <RadioButton
                                    label="Customer Name"
                                    checked={this.state.isCheckedCus}
                                    onFocus={this.clickCustomer.bind(this)}

                                />
                            </Stack.Item>
                            <Stack.Item>
                                <div className="searchText">
                                    <input
                                        type="text"
                                        value={this.state.search}
                                        onKeyPress={this.onKeyPress.bind(this)}
                                        onChange={this.updateSearch.bind(this)}
                                        style={inputStyle}
                                    />
                                </div>
                            </Stack.Item>

                        </Stack>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <td ><b>Order No</b></td>
                                <td ><b>Customer</b></td>
                                <td ><b>Order Item to View</b></td>
                                <td ><b>Trace</b></td>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                (!Array.isArray(orderArray) || !orderArray.length) ? (

                                    <ErrorMsgSearch errorMessage={this.state.errorText} />) : (

                                        orderArray.map((order, index) => {


                                            return (
                                                <FulfilledOrder
                                                    key={order.order_number}
                                                    order={order}
                                                    shopDomain={this.state.shopDomain}
                                                    mapping={this.state.mapping} />


                                            )


                                        }

                                        ))


                                /* {orderArray.map((order, index) => {

                                return (
                                    <FulfilledOrder
                                        key={order.order_number}
                                        order={order}
                                        shopDomain={this.state.shopDomain}
                                        mapping={this.state.mapping}
                                    />
                                )
                            })} */


                            }
                            <tfoot>
                                {/* {
                                
                                ( !Array.isArray(orderArray) || !orderArray.length)   ? (
                
                                    <ErrorMsgSearch errorMessage={this.state.errorText}/> ) : (
                                        "True"
                                    )
                                }  */}
                            </tfoot>

                        </tbody>
                    </table>
                </Page>

            );
        }
    }
}

export default FulfilledOrdersPage;
