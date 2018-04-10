import React, { Component } from 'react';
import Collapse2 from './collapse2';
import * as axios from 'axios';
import { Row, Col, Card, Collapse } from 'reactstrap';
import { Thumbnail, Page, Button, Stack, TextStyle } from '@shopify/polaris';
import AlertBox from "./Alert";
import './untracifiedOrders_mediaQueries.css';
const QRCode = require('qrcode.react');


class CollapseMain extends Component {

    constructor(props) {
        super(props);
        this.onClick = this.props.onClick;
        this.fulfillOrder = this.fulfillOrder.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            collapseArray: this.props.collapseArray,
            isOpen: false,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({ collapseArray: props.collapseArray });
    }

    toggleAlert = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });

        console.log("orders being reset");
        this.props.resetOrders();
    }

    fulfillOrder() {
        const url = '/shopify/shop-api/orders/' + this.props.order.id + '/tracify';
        axios.get(url)
            .then(response => {
                this.setState({
                    alertHeading: "",
                    alertMessage: "Tracified details added successfully ",
                });
                this.setState({
                    isOpen: true,
                });
            }).catch((err) => {
                console.log(err);
            });
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {

        var isClosed = this.props.collapseArray[this.props.collapseArrayKey];
        var buttonText = this.props.collapseArray[this.props.collapseArrayKey] ? { text: "see less" } : { text: "see more" };
        let cardStyle = {
            backgroundColor: 'white',
            // margin: 10,
            padding: 10,
            boxShadow: "0.2px 0.2px 1px 0.5px rgba(0, 0, 0, .2)"
        
        };

        return (

            <Card className="collapasedView_Untracified" style={cardStyle}>
                <Row>
                    <Col sm="2" style={{ paddingBottom: 5, paddingTop: 5 }}>
                        <TextStyle variation="strong">{this.props.title}</TextStyle>
                    </Col>
                    <Col sm="3" style={{ paddingBottom: 5, paddingTop: 5 }}>
                        <TextStyle variation="subdued"><strong>Created on:</strong> {this.props.order.created_at}</TextStyle>
                    </Col>
                    <Col xs="3" sm="5" style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 0, width: 409 }}>
                        <TextStyle variation="subdued"><strong>Customer:</strong> {this.props.order.customer}</TextStyle>
                    </Col>
                    <Col className="exploreBtn" sm="2" style={{ paddingRight: 0, width: 130, display: "table-cell", verticalAlign: "middle"}}>
                        <Button
                            size="slim"
                            outline
                            onClick={(e) => { this.props.onClick(this.props.collapseArrayKey, isClosed) }}
                        >
                            {buttonText.text}
                        </Button>
                    </Col>
                </Row >
                <Collapse isOpen={this.state.collapseArray[this.props.collapseArrayKey]} style={{ marginTop: 8, borderTop: '2px solid rgba(0, 0, 0, .3)' }}>
                    <Row style={{ paddingTop: '1rem' }}>
                        <Col sm="12">
                            <Row style={{ padding: 20 }}>
                                <Col sm="3" style={{ paddingBottom: 20 }}>
                                    <Button primary onClick={this.fulfillOrder}>Mark as Tracified</Button>
                                </Col>
                                <Col sm="7">
                                </Col >
                                <Col sm="2">
                                    <QRCode value={this.props.qrVal} />
                                </Col >
                            </Row>
                            <Row style={{ paddingRight: 20, paddingLeft: 20 }}>
                                <Collapse2 itemArray={this.props.order.lineItems} products={this.props.productsProp} />
                            </Row>
                        </Col>
                    </Row>
                </Collapse>

                <AlertBox show={this.state.isOpen}
                    onClose={this.toggleAlert}
                    heading={this.state.alertHeading}
                    message={this.state.alertMessage}>
                </AlertBox>

            </Card>

        );
    }
}

export default CollapseMain;
