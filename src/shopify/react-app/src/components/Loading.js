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
            marginLeft:"10%",
            marginRight:"10%",
            marginTop:"10%",
            width:"80%",
            color:"teal"
        }

        var spinnerStyle={
            marginLeft:"30%",
            marginRight:"30%"
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
