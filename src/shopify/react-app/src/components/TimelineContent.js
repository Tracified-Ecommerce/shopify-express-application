import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button, Stack } from '@shopify/polaris';
import { isObject } from 'util';
import { isEmpty, isNull, isArray } from "lodash";
import './timelineMediaQueries.css';
import './timelineContent.css';

class TimelineContent extends Component {

    render() {

        var stageData = this.props.data;
        

        return (
            <div className="timelineContentWrapper">

                {/* <div className="componentClass" style={divStyle} id={this.props.componentID} > */}
                <div className="componentClass" id={this.props.componentID} >
                    {

                        Object.keys(stageData).map(function (key) {

                            const subGroup = stageData[key];
                            let newTitle = "";

                            if (subGroup.hasOwnProperty("value")) {

                                if (isObject(subGroup.value)) {
                                    console.log("found an artifact");
                                    return (
                                        <div className="GroupWrapperClass" key={key + key} >
                                            <div >
                                                <span style={{ fontWeight: 'bold', fontSize: 14, color: 'green' }}>
                                                    &#8227; {subGroup.title} : 
                                                    </span>
                                            </div>
                                            <ul className="timelineList">
                                                {
                                                    Object.keys(subGroup.value).map((attributeKey) => {
                                                        const artifactAttribute = subGroup.value[attributeKey];
                                                        console.log("artifact attribute - " + JSON.stringify(artifactAttribute));

                                                        if (isNull(artifactAttribute.value)) {
                                                            return <div style={{ display: "none" }}></div>
                                                        } else {
                                                            return (
                                                                <li className="timelineListItem">
                                                                    <div className="artifactValue" key={key} >
                                                                        <span className="artifactValueTitle">&#8227; {artifactAttribute.title} :</span> {artifactAttribute.value}
                                                                    </div>
                                                                </li>

                                                            )
                                                        }

                                                    })
                                                }
                                            </ul>

                                        </div>);

                                } else {
                                    console.log("not an object : " + subGroup.value);
                                    if (isNull(subGroup.value)) {
                                        return <div style={{ display: "none" }}></div>
                                    } else {
                                        return (
                                            <div className="compClass" key={key} >
                                            
                                                <span className="compSpanClass" >&#8227; {subGroup.title} : </span><span className="innerSpanClass">{subGroup.value}</span>
                                            </div>
                                        )
                                    }

                                }
                            } else {

                                return (
                                    <div className="GroupWrapperClass" key={key} >
                                        <div >
                                            <span style={{ fontWeight: 'bold', fontSize: 14, color: 'green' }}>
                                                &#8227; {stageData[key].title} :
                                    </span>
                                        </div>
                                        <ul className="timelineList">
                                            {/* <Row> */}
                                            {
                                                Object.keys(subGroup).map((innerKey) => {

                                                    if (isObject(subGroup[innerKey])) {
                                                        console.log("found an object subGroup[innerKey] : " + JSON.stringify(subGroup[innerKey]));
                                                        if (isNull(subGroup[innerKey].value)) {
                                                            return <div style={{ display: "none" }}></div>
                                                        } else if (isArray(subGroup[innerKey].value)) {
                                                            console.log("FOUND ARRAY !!!!!");
                                                            console.log("subGroup[innerKey].value :"+subGroup[innerKey].value);
                                                            let valueTimelineStage = "" ;
                                                            console.log("valueTimelineStage :"+valueTimelineStage);
                                                            
                                                            for (let i = 0; i < subGroup[innerKey].value.length; i++) {
                                                                // const element = subGroup[innerKey].value[i];
                                                                if (i == ((subGroup[innerKey].value.length)-1)){
                                                                    console.log("if condition@@@@@@@@@@@" );
                                                                    valueTimelineStage +=  subGroup[innerKey].value[i].toString()+"  ";
                                                                }else {
                                                                    valueTimelineStage +=   subGroup[innerKey].value[i].toString()+", ";
                                                                }
                                                                
                                                            }

                                                            return (
                                                                <div key={innerKey}>

                                                                    <li className="timelineListItem">
                                                                        <div className="compClass">
                                                                            <span className="compSpanClass" >&#8227; {subGroup[innerKey].title}</span> : <span className="innerSpanClass">{valueTimelineStage}</span>                                                                           
                                                                        </div>
                                                                    </li>

                                                                </div>
                                                            )
                                                        } else  if (isNull(subGroup[innerKey].title)) {
                                                            console.log("handled no title #######################");
                                                            return (
                                                                <li className="timelineListItem">
                                                                    <div key={innerKey}>
                                                                        <div className="compClass">
                                                                            <span className="innerSpanClass">{subGroup[innerKey].value}</span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        } else {
                                                            return (
                                                                <li className="timelineListItem">
                                                                    <div key={innerKey}>
                                                                        <div className="compClass">
                                                                            <span className="compSpanClass" >&#8227; {subGroup[innerKey].title}</span> : <span className="innerSpanClass">{subGroup[innerKey].value} </span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        }
                                                
                                                        console.log("found a non object subGroup[innerKey] : " + subGroup[innerKey]);
                                                        
                                                    }
                                                    return null;

                                                })
                                            }
                                        </ul>

                                    </div>
                                );

                            }

                        })
                    }
                </div>

            </div>
        );


    }

}

export default TimelineContent;