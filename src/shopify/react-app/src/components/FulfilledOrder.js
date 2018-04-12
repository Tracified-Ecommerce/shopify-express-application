import React, { Component } from 'react';
import { Button, Select } from '@shopify/polaris';
import * as axios from 'axios';
import { EmbeddedApp, Alert, Modal } from '@shopify/polaris/embedded';
import './tracifiedOdrs_MediaQueries.css';

class FulfilledOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalURL: "",
            timelineText: "View Tracemore Timeline",
            orderNumber: this.props.order.order_number,
            productID: this.props.order.lineItems[0].product_id,
            modalOpen: false,
            alertOpen: false,
            itemName: "",
            itemEnable: "",
            traceButtonDisable: true,
            itemID: this.props.mapping.hasOwnProperty(this.props.order.lineItems[0].product_id) ? (this.props.mapping[this.props.order.lineItems[0].product_id][1] ? this.props.mapping[this.props.order.lineItems[0].product_id][1] : "noTraceabilityItem") : "noTraceabilityItem"
        };
        this.itemID = "";
        this.onSelectItem = this.onSelectItem.bind(this);
        this.onTraceSelect = this.onTraceSelect.bind(this);

    }

    onSelectItem(productID, orderNumber) {
        const mapping = this.props.mapping;
        let tempItemID = "noTraceabilityItem";
        console.log(this.state.itemID);

        if (mapping.hasOwnProperty(productID) && mapping[productID][1]) {
            // if the item exists in the mapping reasiign the temporary itemID
            tempItemID = mapping[productID][0];
        }
        this.setState({
            itemID: tempItemID,
            productID: productID,
            itemEnable: productID

        });

        console.log("productID inside state for order - " + orderNumber + " is : " + this.state.productID);

        if (tempItemID == "noTraceabilityItem") { // if the item ID was not reassigned (i.e: if the item is not available in mapping)
            this.setState({
                traceButtonDisable: true,
                timelineText: "Traceability Not Enabled"
            });
            console.log(this.state.traceButtonDisable);
        }
        else if (this.placeholder == "Select an item") {
            this.setState({
                traceButtonDisable: true,
                timelineText: "View Tracemore Timeline"
            });
        }
        else {
            this.setState({
                traceButtonDisable: false,
                timelineText: "View Tracemore Timeline"
            });

        }
    }



    onTraceSelect() {

        console.log("Button clicked , itemID is :" + this.state.itemID);
        if (this.state.itemID == "noTraceabilityItem") {
            this.setState({
                traceButtonDisable: true,
                // timelineText:"no traceability"                
            });
            // this.state.timelineText="no traceability";
            console.log("inside onTraceSelect() No traceability data added");
        }
        else {
            console.log("inside onTraceSelect() Traceability data added");
            this.setState({
                traceButtonDisable: true,
                // timelineText:"see timeline"
            });
            // this.state.timelineText="see timeline";
            console.log("inside onTraceSelect() product id is : " + this.state.productID);
            const url = '/shopify/shop-api/item/' + this.state.productID;
            axios.get(url)
                .then(response => {
                    console.log("inside onTraceSelect() product selected is : " + response.data.product.handle);
                    let itemName = response.data.product.handle;
                    this.setState({
                        itemName: itemName
                    }, () => {
                        this.setState({ modalOpen: true });
                    });
                }).catch((error) => {
                    console.log(error);
                });

            // this.setState({ modalOpen: true });
        }
    }

    componentDidMount() {

        const url = '/shopify/shop-api/item/' + this.state.productID;
        axios.get(url)
            .then(response => {
                let itemName = response.data.product.handle;
                this.setState({
                    itemName: itemName
                });
            }).catch((error) => {
                console.log(error);
            });

    }

    render() {
        const order = this.props.order;
        let itemOptions = [
            {
                value: "noItem",
                label: "Select an item"
            }
        ];
        order.lineItems.forEach(item => {

            itemOptions.push({
                value: item.product_id,
                label: item.title
            });
        });
        console.log("productId is : " + this.state.productID);
        console.log("array is :" + itemOptions);
        const shopOrigin = "https://" + this.props.shopDomain;
        let modalURL = "/shopify/trace/" + this.state.orderNumber + "/" + this.state.itemID + "/" + this.state.itemName;

        var commonCusOdrStyle = {
            padding: "2%"
        }

        return (
            <tr>
                <td style={commonCusOdrStyle}>
                    <div className="orderNo">
                    {order.order_number}
                    </div>
                </td>
                <td style={commonCusOdrStyle}>
                    <div className="cusName">
                    {order.customer}
                    </div>
                </td>
                <td>
                    <div className="selectWrapper">
                        <Select
                            options={itemOptions}
                            placeholder="Select an item"
                            id={order.order_number}
                            onChange={this.onSelectItem}
                            value={this.state.itemEnable}
                        />
                    </div>
                </td>
                <td>
                    <div className="timelineBtnWrapper">
                        <Button
                            ariaControls="timelineBtn"
                            children={this.state.timelineText}
                            // size="slim"
                            onClick={this.onTraceSelect}
                            disabled={this.state.traceButtonDisable}
                        ></Button>
                    </div>
                    <div className="timelineModal">
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
                                    onAction: () => this.setState({ modalOpen: false, traceButtonDisable: false }),
                                }}
                                onClose={() => this.setState({ modalOpen: false, traceButtonDisable: false })}
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
                    </div>
                </td>
            </tr>
        );
    }
}

export default FulfilledOrder;
