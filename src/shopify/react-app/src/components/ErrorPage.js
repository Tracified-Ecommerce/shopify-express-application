import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TraciLogo from '../assets/TracifiedLogo.png';
import AlertBox from "./Alert";

class ErrorPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        }
    }

    toggleModal = () => {
        this.setState({
          isOpen: !this.state.isOpen
        });
      }

    render() {
        var logoStyle={
            height:'250px',
            width:'100%',
        }

        return (
            <div className="App">
                <button onClick={this.toggleModal}>
                Open the AlertBox
                </button>
                <AlertBox show={this.state.isOpen}
                    onClose={this.toggleModal}
                    heading={this.props.errorStatus}
                    message={this.props.errorMessage}>
                Here's some content for the AlertBox
                </AlertBox>
            {/* </div>
            <div className="errorMsg-page">
            <div className="banner">
                    <img src={TraciLogo} style={logoStyle}/>
                </div>
                <p className="status">{this.props.errorStatus}</p>
                <p className="msg">{this.props.errorMessage}</p> */}
            </div>
        );
    }
}


export default ErrorPage;
