/**
 * @name accountVerify.js
 * @description ...........
 **/

import React, { Component } from 'react';
import '@shopify/polaris/styles.css';
import { Row, Col } from 'reactstrap';
import * as axios from 'axios';
import AlertBox from "./Alert";
import {
    AccountConnection,
    Page,
    TextField,
    Button,
    TextStyle,
    VisuallyHidden,
    Heading,
    FormLayout,
    Card

} from '@shopify/polaris';


class AccountVerify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tempToken: "",
            isOpen: false,
            alertHeading: "dummy status",
            alertMessage: "dummy message",
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    toggleAlert = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onChange(token, id) {
        this.setState({
            tempToken: token
        });
    }

    onClick() {

        const temporaryToken = this.state.tempToken;
        axios.post('/shopify/verify/account/verify', {
            tempToken: temporaryToken
        })
            .then((response) => {
                this.setState({
                    alertHeading: "",
                    alertMessage: "Your Tracified Account was verified successfully ",
                });
                this.setState({
                    isOpen: true,
                });
                window.location.replace('/shopify/main-view');
                // window.location.href = response.redirect;
            }).catch((err) => {
                console.log("err status for modal is : " + err.response.status);
                console.log("err status for modal is : " + err.response.data.message);
                this.setState({
                    alertHeading: err.response.status,
                    alertMessage: err.response.data.message,
                });
                this.setState({
                    isOpen: true,
                });
                console.log("error is : " + JSON.stringify(err.response));
            });
    }

    render() {
        return (
            <Page>
                <Card title="Tracified Account Connection ">
                    <FormLayout>
                        <Card.Section>
                            <p> Looks like you haven't connected a Tracified Account yet.</p>
                            <p> Please Contact your Tracified Admin and submit the temporary token here to connect an account for further proceedings</p><br />
                            <Row>
                                <Col sm="10" offset="2">
                                    <TextField onChange={this.onChange} value={this.state.tempToken} label="Enter the access token:" />
                                </Col>
                                <Col sm="2" offset="2">
                                    <Button primary onClick={this.onClick}>Connect</Button>
                                </Col>
                            </Row>
                        </Card.Section>
                    </FormLayout>
                    <Row>
                    </Row>
                </Card>
                <AlertBox show={this.state.isOpen}
                    onClose={this.toggleAlert}
                    heading={this.state.alertHeading}
                    message={this.state.alertMessage}>
                </AlertBox>
            </Page>
        );
    }
}

export default AccountVerify;
