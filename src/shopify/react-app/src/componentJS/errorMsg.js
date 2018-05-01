/**
 * @name errorMsg.js
 * @description This component is responsible for displaying error messages in plugin pages as embedded messages.
 **/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class errorMsg extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="errorMsg-page">
                <div className="banner">
                </div>
                <p className="status">{this.props.errorStatus}</p>
                <p className="msg">{this.props.errorMessage}</p>
            </div>
        );
    }
}


export default errorMsg;
