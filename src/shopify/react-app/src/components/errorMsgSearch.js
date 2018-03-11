import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ErrorMsgSearch extends Component {

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


export default ErrorMsgSearch;
