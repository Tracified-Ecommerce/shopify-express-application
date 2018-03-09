import React, { Component } from 'react';
import { Button, Select } from '@shopify/polaris';
import * as axios from 'axios';
import { EmbeddedApp, Alert, Modal } from '@shopify/polaris/embedded';

class FulfilledOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderNumber: this.props.order.order_number,
            productID: this.props.order.lineItems[0].product_id,
            modalOpen: false,
            alertOpen: false,
            itemName: "",
            traceButtonDisable: true,
            itemID: this.props.mapping.hasOwnProperty(this.props.order.lineItems[0].product_id) ? (this.props.mapping[this.props.order.lineItems[0].product_id][1] ? this.props.mapping[this.props.order.lineItems[0].product_id][1] : "noTraceabilityItem") : "noTraceabilityItem"
        };
        this.onSelectItem = this.onSelectItem.bind(this);
        this.onTraceSelect = this.onTraceSelect.bind(this);
    
    }

    onSelectItem(productID, orderNumber) {
        const mapping = this.props.mapping;
        let itemID = "noTraceabilityItem";
        console.log(itemID);

        if (mapping.hasOwnProperty(productID) && mapping[productID][1]) {
            itemID = mapping[productID][0];
        }
        this.setState({
            itemID: itemID,
            productID: productID,

        });

        if (this.state.itemID == "noTraceabilityItem") {
            this.setState({
                traceButtonDisable: true
            });
            console.log(this.state.traceButtonDisable);
        } else {
            this.setState({
                traceButtonDisable: false
            });

        }
    }



    onTraceSelect() {
        if (this.state.itemID == "noTraceabilityItem") {
            this.setState({ traceButtonDisable: true });
        }
        else {

            const url = '/shopify/shop-api/item/' + this.state.productID;
            axios.get(url)
                .then(response => {
                    this.setState({
                        itemName: response.data.product.handle
                    });
                }).catch((error) => {
                    console.log(error);
                });

            this.setState({ modalOpen: true });
        }
    }

    componentDidMount() {

        const url = '/shopify/shop-api/item/' + this.state.productID;
        axios.get(url)
            .then(response => {
                this.setState({
                    itemName: response.data.product.handle
                });
            }).catch((error) => {
                console.log(error);
            });

    }

    render() {
        const order = this.props.order;
        var itemOptions = [{

            value:"noItem",
            label:"No Item"
        }];
        order.lineItems.forEach(item => {

            itemOptions.push({
                value: item.product_id,
                label: item.title
            });
        });
        const shopOrigin = "https://" + this.props.shopDomain;
        const modalURL = "/shopify/trace/" + this.state.orderNumber + "/" + this.state.itemID + "/" + this.state.itemName;
        return (
            <tr>
                <td>
                    {order.order_number}
                </td>
                <td>
                    {order.customer}
                </td>
                <td>
                    <Select
                        options={itemOptions}
                        placeholder="Select an Item to view"
                        id={order.order_number}
                        onChange={this.onSelectItem}
                        value={this.state.productID}
                    />
                </td>
                <td>
                    <Button
                        size="slim"
                        onClick={this.onTraceSelect}
                        disabled={this.state.traceButtonDisable}
                    >View Trace More Timeline</Button>
                    <EmbeddedApp
                        apiKey="7f3bc78eabe74bdca213aceb9cfcc1f4"
                        shopOrigin={shopOrigin}
                    >
                        <Modal
                            src={modalURL}
                            width="large"
                            open={this.state.modalOpen}
                            title="Tracified - Trust Through Traceability"
                            primaryAction={{
                                content: 'Close',
                                onAction: () => this.setState({ modalOpen: false }),
                            }}
                            onClose={() => this.setState({ modalOpen: false })}
                        />
                    </EmbeddedApp>
                    <EmbeddedApp
                        apiKey="7f3bc78eabe74bdca213aceb9cfcc1f4"
                        shopOrigin={shopOrigin}
                    >
                        <Alert
                            title="Tracified"
                            open={this.state.alertOpen}
                            confirmContent="Close"
                            onConfirm={() => this.setState({ alertOpen: false, alertConfirmed: true })}
                        >
                            Traceability Not available for this Product!
                        </Alert>
                    </EmbeddedApp>
                </td>
            </tr>
        );
    }
}

export default FulfilledOrder;
