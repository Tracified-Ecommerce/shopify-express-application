// ProductMapping.js

import React, { Component } from 'react';
// import Sticky from 'react-sticky-el';
import ReactDOM from 'react-dom';
import ProductMappingService from './ProductMappingService';
import axios from 'axios';
import ProductMappingTableRow from './ProductMappingTableRow';
import Sticky from 'react-sticky-el';
import AlertBox from "../../components/Alert";
import {
  Layout,
  Page,
  FooterHelp,
  Card,
  Link,
  FormLayout,
  TextField,
  AccountConnection,
  ChoiceList,
  SettingToggle,
  Stack,
  Badge,
  Heading,
  PageActions,
  Select,
  Checkbox
} from '@shopify/polaris';
import '@shopify/polaris/styles.css';
import './AppMP.css';
import './MediaQueriesSettings.css';
import { setTimeout } from 'timers';
import { request } from 'http';
import { Row, Col, Container,Button} from 'reactstrap';
import Loading from '../Loading';
import ProductMappingCard from './productMappingCard';


class ProductMapping extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTraceListLoading: true,
      isProductListLoading: true,
      shopifyProducts: [],
      tracedata: [],
      permission: {},
      mapping: {},
      initialMapping: {},
      isOpen: false,
    };

    this.productMappingService = new ProductMappingService();
    this.updateMapping = this.updateMapping.bind(this);
    this.updatePermission = this.updatePermission.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onPermissionChange = this.onPermissionChange.bind(this);

  }

  updatePermission(permission, shopifyProductID) {
    this.state.permission[shopifyProductID] = permission;
    if (this.state.permission.hasOwnProperty(shopifyProductID)) {
      this.state.mapping[shopifyProductID][1] = permission;
    }
    console.log("updated permissions: "+this.state.permission);
    // console.log(this.state.permission);
  }
  updateMapping(tracifiedItemID, shopifyProductID) {
    console.log(shopifyProductID);
    if (this.state.permission.hasOwnProperty(shopifyProductID)) {
      this.state.mapping[shopifyProductID] = [tracifiedItemID, true];
    }
    else {
      this.state.mapping[shopifyProductID] = [tracifiedItemID, false];
    }
    console.log("updated mapping :"+this.state.mapping);
    // console.log(this.state.mapping);

  }

  toggleAlert = () => {
    this.setState({
        isOpen: !this.state.isOpen
    });
}

  onItemChange(tracifiedItemID, shopifyProductID){
    
   if(this.state.mapping.hasOwnProperty(shopifyProductID)) {
     if(!(tracifiedItemID=="noItem")){   
  // onItemChange(tracifiedItemID, shopifyProductID) {

    // if (this.state.mapping.hasOwnProperty(shopifyProductID)) {
    //   if (!(tracifiedItemID == "noItem")) {
        this.state.mapping[shopifyProductID][0] = tracifiedItemID;
      }
      else {
        let tempMapping = this.state.mapping;
        delete tempMapping[shopifyProductID];
        this.state.mapping = tempMapping;
      }
    }
    else {
      this.state.mapping[shopifyProductID] = [tracifiedItemID, false];
    }
    console.log("item was changed :"+this.state.mapping);
    // console.log(this.state.mapping);
  }

  onPermissionChange(permission, shopifyProductID) {
    console.log(this.state.mapping[shopifyProductID]);
    console.log(permission);
    console.log(shopifyProductID);
    this.state.mapping[shopifyProductID][1] = permission;
    console.log(this.state.mapping);
  }


  componentDidMount() {
    axios.get('/shopify/config/mapping')
    .then(response => {
      if(response.status == 200){
        console.log("inside if");
    // axios.get('https://tracified-react-api.herokuapp.com/shopify/config/mapping')
      // .then(response => {
        this.setState({
          initialMapping: response.data,
          mapping: response.data
        });

        }else{
        console.log("outside if");
      }
      console.log("response status:"+response.status+" response data: "+JSON.stringify(response.data));
      console.log("mapping is :"+JSON.stringify(this.state.mapping));

    }).catch((error) => {
      console.log(error);
    });

        // console.log(this.state.initialMapping);
        axios.get('/shopify/shop-api/products')
      // });
    // axios.get('https://tracified-react-api.herokuapp.com/shopify/shop-api/products')
      .then(response => {
        var products = response.data.products;

        products = products.reduce(function (reducedJson, product) {
          reducedJson.push({
            id: product.id,
            title: product.title

          });
          return reducedJson;
        }, []);
        this.setState({ shopifyProducts: products });

        if (response.status == 200) {
          this.setState({ isProductListLoading: false });


        }

      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('/shopify/tracified/item-list')
    // axios({
    //   method: 'get',
    //   url: 'https://tracified-react-api.herokuapp.com/shopify/tracified/item-list',      headers: {
    //     'Content-Type': 'text/plain;charset=utf-8',
    //   },
    // })
      .then(response_ => {
        this.setState({ tracedata: response_.data });
      //   console.log("mapping response sttus : " + response_.status);
      //   console.log("mapping response data : " + JSON.stringify(response_.data));

      //   let responseTxt = "";
      //   for ( const obj of response_.data) {
      //     const itemname = obj.itemName.replace(/\s/g, "-");
      //     responseTxt += obj.itemID + " : " + itemname + " , ";
      // }

      // this.setState({ tracedata: responseTxt });
        if (response_.status == 200) {
          this.setState({ isTraceListLoading: false });

        }
      })
      .catch(function (error) {
        console.log(error);
        // console.log("error gettin mapping list :" + error);
      })
  }


  tabRow() {
    const trace = this.state.tracedata;
    if (this.state.shopifyProducts instanceof Array) {
      return this.state.shopifyProducts.map((object, i) => {
        return <ProductMappingTableRow
          onItemChange={this.onItemChange}
          setNotSaved={this.props.setNotSaved}
          onPermissionChange={this.onPermissionChange}
          obj={object}
          key={i}
          tracelist={trace}
          mapping={this.state.mapping}
        />;

      })

    }
  }

  onChange = (e) => {
    // Because we named the inputs to match their corresponding values in state, it's super easy to update the state
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }


  onSubmit = (e) => {
    e.preventDefault();
    this.props.setNotSaved(false);
    // get our form data out of state
    const mapping = this.state.mapping;

    /**
     * write functions to adust dynamically a state attribute that holds the current selections by the user.
     * then assign that attribute to the following "mapping:" instead of "{productName, tracifiedItemID, tracifiedItemtitle, permission }"
     * means it should look like " mapping: this.state.mapping"
     * make sure that state.mapping holds the current selections
     */

    axios.post('/shopify/config/mapping', { mapping })
    // axios.post('https://tracified-react-api.herokuapp.com//shopify/config/mapping', { mapping })
      .then((result) => {
        // alert("Mapping Successfully Saved!");
        this.setState({
          alertHeading: "",
          alertMessage: "Mapping Successfully Saved!"
      });
      this.setState({
          isOpen: true,
      });
        console.log( "Result :"+result);
      }).catch((error) => {
                console.log(error);
              });
      //   console.log(result);
      // });

      // axios({
      //   method: 'post',
      //   url: 'https://tracified-local-test.herokuapp.com/shopify/tracified/item-list',      headers: {
      //     'Content-Type': 'text/plain;charset=utf-8',
      //   },
      // })

  }



  render() {
  
    const { productName, tracifiedItemID, tracifiedItemtitle, permission, isTraceListLoading, isProductListLoading } = this.state;

    var navStyle={
      // width: '340%',
      zindex: '20'
    }

    if (isTraceListLoading || isProductListLoading) {
      return <Loading/> ;
     
      console.log('spinner');
    } else {
      console.log('not spinner');
    }

var saveBtnStyle={
      position:'fixed',
      zIndex: 30,
      width:'60px',
      height:'60px',
      bottom:'40px',
      right:'40px',
      backgroundColor:'#5b69c3',
      color:'#FFF',
      borderRadius:'50px',
      textAlign:'center',
      boxShadow: '2px 2px 3px #999',
    }

    // var stikyStyle={
    //   width: "100%",
    //   marginLeft: "-17y%"
    // }

    return (
      // <Page>
      <div class="Polaris-Page" id="productmapping">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react.js"></script>
        <table className="table table-striped table-center-content" id="settingContent">
          
            {/*<table className="table table-striped">              */}

              <thead>
              {/* <div style={{marginLeft: "8%",width: "100%"}}> */}
                <Sticky >
                <Row className="cardWrapper" style={navStyle}>
                  <div id="stickyCard">                
                    <ProductMappingCard/>
                  </div>
                </Row>
              </Sticky>
              {/* </div> */}
              </thead>

              <div className="space"></div>

              <tbody>
                {this.tabRow()}
              </tbody>
            </table> 

            <Button primary onClick={this.onSubmit} style={saveBtnStyle} className="saveBtn">
              Save
            </Button>
            <AlertBox show={this.state.isOpen}
                    onClose={this.toggleAlert}
                    heading={this.state.alertHeading}
                    message={this.state.alertMessage}>
            </AlertBox>
      </div>
      // </Page>
    );
    <ProductMapping /> , document.getElementById('productmapping')
    // console.log('document thing works');
  }

}

export default ProductMapping;