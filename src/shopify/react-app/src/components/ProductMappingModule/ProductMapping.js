import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ProductMappingService from './ProductMappingService';
import axios from 'axios';
import ProductMappingTableRow from './ProductMappingTableRow';
import Sticky from 'react-sticky-el';
import {
  Layout,
  Page,
  FooterHelp,
  Card,
  Link,
  Button,
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
import './ProductMapping.css';
import { setTimeout } from 'timers';
import Spinner from '../../lib/components/Spinner';
import { request } from 'http';
import { Row, Col } from 'reactstrap';
import Loading from '../Loading'
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
      initialMapping: {}
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

  }

  onItemChange(tracifiedItemID, shopifyProductID){
    
    if(this.state.mapping.hasOwnProperty(shopifyProductID)) {
      if(!(tracifiedItemID=="noItem")){        
        this.state.mapping[shopifyProductID][0] = tracifiedItemID;
      }
      else{
        let tempMapping = this.state.mapping;
        delete tempMapping[shopifyProductID];
        this.state.mapping = tempMapping;
      }
    }
    else{
      this.state.mapping[shopifyProductID] = [tracifiedItemID, false];
    }
    console.log("item was changed :"+this.state.mapping);
  }
  
  onPermissionChange(permission, shopifyProductID){
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
        this.setState({
          initialMapping:response.data,
          mapping:response.data        
        });
      }else{
        console.log("outside if");
      }
      console.log("response status:"+response.status+" response data: "+JSON.stringify(response.data));
      console.log("mapping is :"+JSON.stringify(this.state.mapping));

    }).catch((error) => {
      console.log(error);
    });

    axios.get('/shopify/shop-api/products')
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
      .then(response_ => {
        this.setState({ tracedata: response_.data });

        if (response_.status == 200) {
          this.setState({ isTraceListLoading: false });

        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  tabRow() {
    const trace = this.state.tracedata;
    if (this.state.shopifyProducts instanceof Array) {
      return this.state.shopifyProducts.map((object, i) => {
        return <ProductMappingTableRow
          onItemChange={this.onItemChange}
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
    // get our form data out of state
    const mapping = this.state.mapping;

    /**
     * write functions to adust dynamically a state attribute that holds the current selections by the user.
     * then assign that attribute to the following "mapping:" instead of "{productName, tracifiedItemID, tracifiedItemtitle, permission }"
     * means it should look like " mapping: this.state.mapping"
     * make sure that state.mapping holds the current selections
     */
    axios.post('/shopify/config/mapping', { mapping })
      .then((result) => {
        alert("Mapping Successfully Saved!");
        console.log( "Result :"+result);
      }).catch((error) => {
                console.log(error);
              });

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


    return (
      <div class="loader" id="productmapping">

        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react.js"></script>

            <table className="table table-striped">
              

              <thead>
                <Sticky>
                <Row className="cardWrapper" style={navStyle}>
                  <div id="stickyCard">
                    <ProductMappingCard/>
                  </div>
                </Row>
              </Sticky>

              </thead>
                <br/><br/><br/><br/><br/><br/><br/>
              <tbody>
                {this.tabRow()}
              </tbody>
            </table>   
      </div>
    );
    <ProductMapping /> , document.getElementById('productmapping')
  }

}

export default ProductMapping;
