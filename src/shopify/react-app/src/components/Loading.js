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
       
        return (
            <div className="loadingMsg">
                <DisplayText  size="small">
                    <TextStyle variation="subdued">{this.props.loadMsg}</TextStyle>
                </DisplayText><br />
                <div className="spinnerClass" >
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
