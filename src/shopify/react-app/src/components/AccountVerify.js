import React, { Component } from 'react';
import '@shopify/polaris/styles.css';
import { Row, Col } from 'reactstrap';
import * as axios from 'axios';
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
            tempToken: ""
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onChange(token, id) {
        this.setState({
            tempToken: token
        });
    }

    onClick() {

        const temporaryToken = this.state.tempToken;
        console.log("temp token is :"+temporaryToken);
        axios.post(
            '/shopify/verify/account/verify',
            {
                tempToken: temporaryToken 
            })
        .then((response) => {
            // alert("Account verified successfully " + result.data);
            window.location.replace('/shopify/main-view');
            // window.location.href = response.redirect;
            console.log(response);
        }).catch((err) =>{
            alert("Account verification Failed, PLease Try re-entering the temperory access token");
            console.log(err);
        });
    }

    render() {
        return (
            <Page>
                <Card title="Tracified Account Connection ">
                    <FormLayout>
                        <Card.Section>
                            <p> Looks like you haven't connected a Tracified Account yet.</p>
                            <p> Please Contact your Tracified Admin and submit the temporary token here to connect an account for further proceedings</p><br/>
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
            </Page>
        );
    }
}

export default AccountVerify;
