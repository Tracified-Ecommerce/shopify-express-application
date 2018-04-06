import React, { Component } from 'react';

class ErrorMsgSearch extends Component {

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
