import React, { Component } from 'react';

class Alert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    render() {
        // Render nothing if the "show" prop is false
        if(!this.props.show) {
          return null;
        }
    
        // The gray background
        const backdropStyle = {
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: 50
        };
    
        // The modal "window"
        const modalStyle = {
          backgroundColor: '#fff',
          borderRadius: 5,
          maxWidth: 500,
          minHeight: 300,
          margin: '0 auto',
          padding: 30
        };
    
        return (
          <div className="alertBackdrop" style={backdropStyle}>
            <div className="alertModal" style={modalStyle}>
              {this.props.children}
    
              <div className="footer">
                <button onClick={this.props.onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

export default Alert;