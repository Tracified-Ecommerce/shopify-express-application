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
            marginLeft:"auto",
            marginRight:"auto",
            width:"100%"
        }

        return (
            <div className="loadingMsg" style={loadingMsgStyle}>
                <DisplayText  size="small"                >
                    <TextStyle variation="subdued">{this.props.loadMsg}</TextStyle>
                </DisplayText><br />
                <div style={{ padding: '0 0 0 10%' }}>
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
