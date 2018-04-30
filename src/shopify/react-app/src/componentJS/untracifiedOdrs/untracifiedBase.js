import React, { Component } from 'react';
import * as axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import { Thumbnail, Card, Page, List, RadioButton, Button, Stack, TextField } from '@shopify/polaris';
import loading from '../loading';
// import CollapseMain from './CollapseMain';
import untracifiedOdrCard from './untracifiedOdrCard';
import errorMsg from '../errorMsg';
import './styleCSS/untracifiedOdrs/untracifiedOrders_mediaQueries.css'

class Part2Cards extends Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            products: {},
            isOrderListloading: true,
            search: '',
            isExpanded: true,
            isCheckedCus: false,
            isCheckedOrd: true,
            errorText: "No Result Found"
        };
    }

    componentDidMount() {
        axios.get('/shopify/shop-api/products')
            .then(response => {
                const products = response.data.products;
                this.setState({ products: response.data.products });
            }).catch(function (error) {
                console.log(error);
            });

        axios.get('/shopify/shop-api/orderCount')
            .then(response => {
                console.log("order count is : " + response.data.orderCount);
                console.log("page count is : " + response.data.pageCount);
                const pageCount = response.data.pageCount;
                for (let i = 1; i <= pageCount; i++) {
                    const orderPageURL = "/shopify/shop-api/orders/" + i;
                    axios.get(orderPageURL)
                        .then(response => {
                            console.log("got orders from backend");
                            console.log(JSON.stringify(response.data));
                            let updatedOrderArray = this.state.orders;
                            updatedOrderArray = updatedOrderArray.concat(response.data.orders);
                            this.setState({
                                orders: updatedOrderArray,
                                isOrderListloading: false,
                            });
                        }).catch(function (error) {
                            console.log(error);
                        });
                }

            }).catch(function (error) {
                console.log(error);
            });

    }

    resetOrders = () => {
        this.setState({
            isOrderListloading: true
        });
        axios.get('/shopify/shop-api/orders')
            .then(response => {
                this.setState({
                    orders: response.data.orders,
                    isOrderListloading: false
                }, () => {
                    this.setState({
                        search: ""
                    });
                });
            }).catch((error) => {
                console.log(error);
            });
    }

    updateSearch(event) {
        this.setState({
            search: event.target.value.substr(0, 20),

        });
    }

    clickOrder() {
        this.setState({
            isCheckedCus: false,
            isCheckedOrd: true,
            search: ""

        });
    }

    clickCustomer() {
        this.setState({
            isCheckedCus: true,
            isCheckedOrd: false,
            search: ""

        });
    }


    render() {

        if (this.state.isOrderListloading) {
            return <loading loadMsg=" Please wait. loading your orders from Shopify..." />;
        }
        else {

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
                console.log(orderArray);


            }

            else if (this.state.isCheckedOrd) {


                let orders = this.state.orders.filter(
                    (order) => {
                        return order.name.indexOf(this.state.search) !== -1;
                    }
                );
                console.log(orders);

                console.log(orders);

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

                console.log(orderArray);


            }

            else {
                var orders = this.state.orders;


                console.log(orders);

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



                console.log(orderArray);
            }

            var inputStyle = {
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
                borderRadius: "4px",
                height: "30px",
                paddingLeft: "5%"
            }

            var toggleBtnStyle = {
                paddingBottom: "10px",
                marginLeft: "5%",
                width: "105%"
            }

            return (
                <div className="pageWrapper">
                    <Page title="UnTracified Orders" separator>
                        <Stack
                            distribution="trailing"
                        >

                            <div className="toggleBtn" style={toggleBtnStyle}>
                                <Stack.Item>
                                </Stack.Item>
                            </div>

                        </Stack>
                        <div className="untraciFilterBy" style={{ paddingBottom: 5, textAlign: "center" }}>
                            <Stack alignment="center" >
                                <Stack.Item>
                                    <div style={{ marginBottom: 5, fontWeight: "bold", fontSize: "140%", paddingBottom: '9%' }}>
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
                                    <div className="searchOdrs">
                                        <input
                                            type="text"
                                            value={this.state.search}
                                            onChange={this.updateSearch.bind(this)}
                                            style={inputStyle}
                                        />
                                    </div>
                                </Stack.Item>

                            </Stack>
                        </div>


                        {
                            (!Array.isArray(orderArray) || !orderArray.length) ? (


                                <errorMsg errorMessage={this.state.errorText} />) : (

                                    orderArray.map((order, index) => {
                                        const qrValue = order.order_number.toString();
                                        const title = "Order ID: " + order.order_number;

                                        console.log("correct 1");

                                        if (this.state.isExpanded) {
                                            console.log("correct 1= uncollapased");
                                            return (
                                                <Uncollapsed
                                                    key={index}
                                                    order={order}
                                                    productsProp={this.state.products}
                                                    resetOrders={this.resetOrders}
                                                    qrVal={qrValue}
                                                    title={title}
                                                />

                                            );
                                        }

                                    })

                                )
                        }

                    </Page>
                </div>
            );
        }
    }
}

export default Part2Cards;
