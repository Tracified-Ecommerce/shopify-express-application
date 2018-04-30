import React, { Component } from 'react';

class ErrorPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const errorCardStyle = { border: "3px solid #e84040", margin: 10 };
        const errorHeadingStyle = { backgroundColor: "#e84040", color: "white", padding: 10 };
        let errorNoun = this.props.errors.length == 1 ? "error" : "errors";

        return (

            <div className="errorMsg-page" style={errorCardStyle}>
                <div style={errorHeadingStyle}><span style={{ fontSize: "25px" }}>&#9888;</span> Oops! Tracified has encountered the following {errorNoun}</div><br />
                {
                    this.props.errors.map(error => {
                        return (<div style={{ paddingLeft: 10, paddingBottom: 10 }}>
                            <p className="tracerrorMsg"><span className="tracerrorstatus" style={{ fontWeight: "bold" }}>{error.errorStatus} : </span>{error.errorMessage}</p>
                        </div>);
                    })
                }
            </div>

        );
    }
}


export default ErrorPage;
