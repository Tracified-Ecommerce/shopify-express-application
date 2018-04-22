import React, { Component } from 'react';
import {
    Spinner,
    DisplayText,
    TextStyle
} from '@shopify/polaris';

class Loading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var loadingMsgStyle={
            marginLeft:"10%",
            marginRight:"10%",
            marginTop:"10%",
            width:"80%"
        }

        var spinnerStyle={
            marginTop:"10%",
            marginLeft:"20%",
            marginRight:"20%"
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
