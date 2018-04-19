import React, { Component } from 'react';
import { Container, Row, Col} from 'reactstrap';
import { Button, Stack } from '@shopify/polaris';
import { isObject } from 'util';
import { OverflowDetector } from 'react-overflow';
import { isEmpty, isNull, isArray } from "lodash";
import './timelineMediaQueries.css';
import './timelineContent.css';

class TimelineContent extends Component {

    constructor(props) {
        super(props);
        // this.height = 0;
        // this.onClick = this.props.onClick;
        // this.state = {
        //     collapseArray: this.props.collapseArray,
        //     isCollsapsible: false
        // };
    }

    // componentWillReceiveProps(props) {
    //     this.setState({ collapseArray: props.collapseArray });  
    // }

    // componentDidMount() {
    //     this.height = document.getElementById(this.props.componentID).clientHeight+15;
    //     if(this.height > 112) {
    //         this.setState({isCollsapsible:true});
    //     }  
    // }

    render() {

        var stageData = this.props.data;
        // var isClosed = this.props.collapseArray[this.props.collapseArrayKey];
        // var buttonText = this.props.collapseArray[this.props.collapseArrayKey] ? {text: "see less \u25B2"} : {text: "see more  \u25BC"};
        // var divStyle = this.state.isCollsapsible ? (!this.state.collapseArray[this.props.collapseArrayKey] ? {overflow:"hidden", height:120, transition: 'all 0.7s ease-in-out'} : {overflow:"hidden", height:this.height, transition: 'all 0.7s ease-in-out'}) : {} ;
        // var buttonCode = <p></p>;
        // var seeMoreStyle = !this.props.collapseArray[this.props.collapseArrayKey] ? {background: 'linear-gradient(rgba(255,255,255,1), white)', position:'relative', bottom:'0px', boxShadow:'0px -8px 10px -1px rgba(255,255,255,1)'}: {};

        // if(this.state.isCollsapsible){
        //     buttonCode =     <Button plain 
        //                             onClick={(e) => {this.props.onClick(this.props.collapseArrayKey, isClosed)}} 
        //                     >
        //                         {buttonText.text}
        //                     </Button>
        // }
        
        return(
            <div className="timelineContentWrapper">
                    
                {/* <div className="componentClass" style={divStyle} id={this.props.componentID} > */}
                <div className="componentClass" id={this.props.componentID} >
                { 
                    
                    Object.keys(stageData).map(function (key) {
                        
                        const subGroup = stageData[key];
                            let newTitle = "";

                        if(subGroup.hasOwnProperty("value")){

                            if(isObject(subGroup.value)) {
                                return <div>
                                        {
                                            Object.keys(subGroup.value).map((attributeKey) => {
                                                const artifactAttribute = subGroup.value[attributeKey];
                                                console.log("artifact attribute - " + JSON.stringify(artifactAttribute));

                                                if (isNull(artifactAttribute.value)) {
                                                    return <div style={{ display: "none" }}></div>
                                                } else {
                                                    return (
                                                        
                                                        <div className="artifactValue" key={key} > <span className="artifactValueTitle">&#8227; {artifactAttribute.title} :</span> {artifactAttribute.value}</div>
                                                    )
                                                }

                                            })
                                        }
                                    </div>;
                            } else {
                                if (isNull(subGroup.value)) {
                                    return <div style={{ display: "none" }}></div>
                                } else {
                                    return (
                                        <div className="compClass" key={key} > <span className="compSpanClass" >&#8227; {subGroup.title} :</span> {subGroup.value}</div>
                                    )
                                }
                            }
                        } else {

                            return(
                                <div className="wrapperClass" key={key} style={{boxShadow:'0px 1px 5px 1px rgba(189,189,189,0.52)', margin:7, padding:5, borderRadius:4, backgroundColor:'#fafafa',marginBottom:'4%'}}>
                                <div style={{minHeight:24}}>
                                    <span style={{fontWeight:'bold', fontSize: 14, color:'green'}}>
                                        &#8227; {stageData[key].title} :
                                    </span>
                                </div>
                                    <Row>
                                    {
                                        Object.keys(subGroup).map((innerKey)=>{
                                
                                            if(isObject(subGroup[innerKey])){
                                                console.log("found an object subGroup[innerKey] : " + JSON.stringify(subGroup[innerKey]));
                                                if (isNull(subGroup[innerKey].value)) {
                                                    return <div style={{ display: "none" }}></div>
                                                } else if (isArray(subGroup[innerKey].value)) {
                                                    console.log("FOUND ARRAY");
                                                    let flag = 0;
                                                    return (
                                                        <Col key={innerKey} xs='12' sm='6'>
                                                            {
                                                                subGroup[innerKey].value.map(x => {
                                                                    flag++;
                                                                    if(flag == 1) {
                                                                        return <div className="keyClass"><span className="spanClass" >{subGroup[innerKey].title}</span> : <span className="innerSpanClass">{x}</span></div>
                                                                    } else {
                                                                        newTitle = subGroup[innerKey].title.replace(/[a-zA-z0-9]/g, "\u2007");
                                                                        return <div className="keyClass"><span className="spanClass" >{newTitle}</span> : <span className="innerSpanClass">{x}</span></div>
                                                                    }
                                                                })
                                                            }
                                                        </Col>
                                                    )
                                                    // return (

                                                    // )
                                                } else {
                                                    return (
                                                        <Col key={innerKey} xs='12' sm='6'>
                                                            <div className="keyClass"><span className="spanClass" >{subGroup[innerKey].title}</span> : <span className="innerSpanClass">{subGroup[innerKey].value}</span></div>
                                                        </Col>
                                                    )
                                                }
                                            } else {
                                                console.log("found a non object subGroup[innerKey] : " + subGroup[innerKey]);
                                            }
                                            return null;
                                            
                                        })
                                    }
                                    </Row>
                                    
                                </div>       
                            );
                           
                        }
                        
                    })
                } 
                </div>
                
                {/* <div style={seeMoreStyle}>
                    {buttonCode}
                </div> */}
                   
            </div>
        );    
    
    
    }

}

export default TimelineContent;