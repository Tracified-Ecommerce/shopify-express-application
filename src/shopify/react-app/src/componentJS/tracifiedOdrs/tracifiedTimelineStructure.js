/**
 * @name tracifiedTimelineStructre.js
 * @description This is the basic timeline structure. The timeline will appear when a 
 * user clicks "View Tracemore Timeline" for the traceability enabled items in 
 * Tracified orders page.
 **/

import React, { Component } from 'react';
import loading from './loading';
import * as axios from 'axios';
import {
    Spinner,
    Card,
    Page
} from '@shopify/polaris';
import { Row, Col, Container } from 'reactstrap';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import tracifiedTimelineContent from './tracifiedTimelineContent';
import errorPage from '../errorPage';
import { isEmpty } from "lodash";
import './styleCSS/tracifiedOdrs/tracifiedOdrs-MediaQueries.css';

class TraceTimeLine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeline: "",
            istimelineloading: true,
            errorArray: [],
            filteredTimeline: [],
            isError: false,
        };
    }


    componentDidMount() {
        const traceURL = "/shopify/tracified/trace/" + this.props.match.params.orderID + "/" + this.props.match.params.itemID;
        axios({
            method: 'get',
            url: traceURL,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        })
            .then(response => {
                const responseData = JSON.parse(response.data);
                let timeline = responseData.tabs[2];
                let itms = timeline.items;

                this.setState({
                    timeline: timeline,
                    istimelineloading: false,
                }, () => {
                    this.setState({
                        filteredTimeline: this.state.timeline.items.filter(stage => !isEmpty(stage.data))
                    });
                });
            }).catch((error) => {

                if (error.response) {
                    var errorMessageObj = {};

                    if (error.response.data.error.startsWith("<")) {
                        errorMessageObj = { err: "internal server error" }
                    } else {
                        errorMessageObj = JSON.parse(error.response.data.error);
                    }

                    console.log("timeline status : " + error.response.status + "timeline error : " + errorMessageObj.err);

                    const error1 = {
                        errorStatus: error.response.status,
                        errorMessage: errorMessageObj.err
                    };

                    let tempErrorArray = []
                    tempErrorArray.push(error1);

                    this.setState({
                        errorArray: tempErrorArray,
                        isError: true,
                    });

                    this.setState({
                        istimelineloading: false,
                    });
                } else {
                    console.error("error in timeline : " + error);
                }
            });

    }

    render() {

        let timelineTopStyle = {
            backgroundColor: 'rgba(0,0,0,0.8)',
            height: 90,
            width: 220,
            marginLeft: 10,
            padding: 10,
            position: "sticky",
            top: "0px",
            zIndex: 200,
        };

        let paramTitle = this.props.match.params.itemName;
        let capitalizedTitle = paramTitle.charAt(0).toUpperCase() + paramTitle.slice(1);

        if (this.state.istimelineloading) {
            return <loading loadMsg=" Please wait. loading item traceability..."/>;
        }
        else if (this.state.isError) {
            console.log("inside timeline iserror block");
            console.log("errorArrray : " + this.state.errorArray);
            return <ErrorPage errors={this.state.errorArray} />;
        } else {
            return (
                <div className="traceTimelineWrapper" style={{ backgroundColor: '#f4f6f8' }}>
                    <div style={timelineTopStyle}>
                        <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '5px', fontSize: '15px' }}>
                            <span style={{ color: 'white' }}>
                                Traci
                            </span>
                            <span style={{ color: 'green' }}>
                                fied
                            </span>
                        </h1>

                        <p style={{ color: 'white', fontSize: 14, textAlign: 'center', marginBottom: 1 }}>Order ID:&nbsp;{this.props.match.params.orderID}</p>
                        <p style={{ color: 'white', fontSize: 14, textAlign: 'center', marginBottom: 1 }}>Item Name:&nbsp;{capitalizedTitle}</p>

                    </div>
                    <div style={{ paddingLeft: 30 }}>
                        <Timeline>
                            {this.state.filteredTimeline.map((stage, index) => {

                                let titleText = (index + 1) + ". " + stage.title;
                                let descriptionText = stage.description;

                                var ico = (<svg height="30" width="30" >
                                    <image width="30" height="30" xlinkHref={stage.icon} />
                                </svg>);

                                var stageData = stage.data;

                                return (
                                    <TimelineEvent
                                        key={index}
                                        title={titleText}
                                        titleStyle={{ fontSize: 17, fontWeight: "bold" }}
                                        subtitle={descriptionText}
                                        subtitleStyle={{ fontSize: 15 }}
                                        icon={ico}
                                        contentStyle={{ fontSize: 13 }}
                                        bubbleStyle={{ border: "none" }}
                                    >

                                        <div id={index}>
                                            <tracifiedTimelineContent
                                                data={stageData}
                                                componentID={"component" + index}
                                            />
                                        </div>
                                    </TimelineEvent>
                                );
                            })}
                        </Timeline>
                    </div>
                </div>
            );
        }
    }
}

export default TraceTimeLine;
