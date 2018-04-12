import React, { Component } from 'react';
import { Container, Collapse, Row, Col } from 'reactstrap';
import { Button, Card, ResourceList, Thumbnail, Stack } from '@shopify/polaris';
import * as axios from 'axios';
import { isUndefined } from 'util';
import AlertBox from "./Alert";
import './collaps_mediaQueries.css';
// import '.'

class CollapaseCard extends Component {
    constructor(props) {
        super(props);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.fulfillOrder = this.fulfillOrder.bind(this);
        this.state = {
            collapsed: true,
            isOpen: false,
        };
    }

    toggleCollapse() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    toggleAlert = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });

        console.log("orders being reset");
        this.props.resetOrders();
    }

    fulfillOrder() {
        const url = '/shopify/shop-api/orders/' + this.props.orderID + '/tracify';
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

    render() {
        console.log("collapse products");
        console.log("type of reset order() : " + typeof this.props.resetOrders)
        let resourceThumbnails = [];
        let resourceList = this.props.itemArray.map((resItem, index) => {
            let productImage = "no/image";
            if (!isUndefined(this.props.products.length) && !isUndefined(this.props.products)) {
                console.log(this.props.products.length);
                const product = this.props.products.filter((product) => {
                    return product.id == resItem.product_id
                });

                if (!isUndefined(product[0])) {
                    if (!isUndefined(product[0].images[0])) {
                        productImage = product[0].images[0].src;
                    }
                    if (resourceThumbnails.length < 5) {
                        resourceThumbnails.push(
                            <Thumbnail
                                key={resourceThumbnails.length}
                                source={productImage}
                                alt={" Image"}
                            />
                        );
                    }
                    else if (resourceThumbnails.length == 5) {
                        resourceThumbnails.push(<p key={resourceThumbnails.length}><b>. . .</b></p>);
                    }

                }
            }

            let resource = {
                url: '#',
                media: <Thumbnail
                    source={productImage}
                    alt={resItem.title + " Image"}
                />,
                attributeOne: resItem.title,
                attributeTwo: resItem.variant_title,
                attributeThree: resItem.quantity,
            }

            return (
                resource
            );


        });

        var markAsTracifiedBtnStyle={
            marginTop: "-4%",
            textAlign: "center",
            marginLeft: "0%",
            paddingRight: "1% !important"
        }

        return (
            <div>
                <Container fluid={true}>
                    <Stack alignment="baseline" wrap={false}> {resourceThumbnails} </Stack>
                    <Row noGutters={true}>
                        <Col sm="10" className="showItems_column">
                            <Button plain onClick={this.toggleCollapse} >{this.state.collapsed ? " Show Items \u25BC" : " Hide Items \u25B2"}</Button>
                        </Col>
                        <Col sm="6">
                        </ Col>
                        <Col sm="2" style={markAsTracifiedBtnStyle}>
                            <Button primary onClick={this.fulfillOrder} >Mark as Tracified</Button>
                        </Col>
                    </Row>
                </Container>
                <Collapse isOpen={!this.state.collapsed}>
                    <ResourceList
                        items={resourceList}
                        renderItem={(item, index) => {
                            return <ResourceList.Item key={index} {...item} />;
                        }}
                    />

                </Collapse>
                <AlertBox show={this.state.isOpen}
                    onClose={this.toggleAlert}
                    heading={this.state.alertHeading}
                    message={this.state.alertMessage}>
                </AlertBox>
            </div>
        );
    }
}

export default CollapaseCard;

