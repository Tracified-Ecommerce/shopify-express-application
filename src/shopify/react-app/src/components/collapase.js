import React, { Component } from 'react';
import { Container, Collapse, Row, Col } from 'reactstrap';
import { Button, Card, ResourceList, Thumbnail, Stack } from '@shopify/polaris';
import * as axios from 'axios';
import { isUndefined } from 'util';
import AlertBox from "./Alert";

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
    }

    fulfillOrder(){
        // const url = '/shopify/shop-api/orders/' + this.props.orderID + '/tracify';
        // axios.get(url)
        // .then(response => {
            this.setState({
                alertHeading: "",
                alertMessage: "Tracified details added successfully ",
            });
            this.setState({
                isOpen: true,
            });
            this.props.resetOrders();
        // }).catch((err) => {
        //         console.log(err);
        //     });
    }

    render() {
        var markTracifiedStyle={
            marginLeft: '-10%',
            // width: '25%',
            marginTop: '-4%',
            // position:'fixed'
        }
        console.log("collapse products");
        console.log("type of reset order() : " +    typeof this.props.resetOrders)
        let resourceThumbnails = [];
        let resourceList = this.props.itemArray.map((resItem, index) => {
            let productImage = "no/image";
            if (!isUndefined(this.props.products.length) && !isUndefined(this.props.products)) {
                console.log(this.props.products.length);
                const product = this.props.products.filter((product) => {
                    return product.id == resItem.product_id
                });

                if (!isUndefined(product[0])) {
                    productImage = product[0].images[0].src;
                    if(resourceThumbnails.length < 5){
                        resourceThumbnails.push(                        
                            <Thumbnail
                            key={resourceThumbnails.length}
                            source={product[0].images[0].src}
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

       

        return (
            <div>
                <Container>
                {/* <Collapse isOpen={this.state.collapsed}> */}
                <Stack alignment="baseline" wrap={false}> {resourceThumbnails} </Stack>
                {/* </Collapse> */}
                    <Row>
                        <Col sm="12">
                        {/*<Col sm="7">*/}
                            {/*<Row>*/}
                                {/*<Col sm="10">*/}
                                <Col sm="3">
                                    <Button plain onClick={this.toggleCollapse} >{this.state.collapsed ? " Show Items \u25BC" : " Hide Items \u25B2"}</Button>
                                </Col>
                                <Col sm="6">
                                </ Col>
                                <Col sm="3" style={markTracifiedStyle}>
                                    <Button primary onClick={this.fulfillOrder} >Mark as Tracified</Button>
                                </Col>
                                {/*</Col>*/}
                            {/*</Row>*/}
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

