import React, { Component } from 'react';
import {
    Spinner,
    DisplayText,
    TextStyle
} from '@shopify/polaris';
import './Loading.css';

class Loading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var loadingMsgStyle={
            marginLeft:"auto",
            marginRight:"auto",
            marginTop:"10%",
            width:"40%",
            textAlign:"center"
        }

        var spinnerStyle={
            width:"10%",
            marginLeft:"auto",
            marginRight:"auto"
        }

        return (
            <div className="loadingMsg" style={loadingMsgStyle}>
                <DisplayText  size="small"                >
                    <TextStyle variation="subdued">{this.props.loadMsg}</TextStyle>
                </DisplayText><br />
                <div className="spinnerClass" style={spinnerStyle}>
                    <Spinner
                        size="large"
                        color="teal"
                        accessibilityLabel="Loading"
                    />
                </div>
            </div>
        );
    }
}


export default Loading;
