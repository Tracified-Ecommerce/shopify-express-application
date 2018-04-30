/**
 * @name settingDetailTbl.js
 * @description This component is the table body content for product mapping in 
 * settings page.
 **/

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import settingServices from './settingServices';
import 'react-select/dist/react-select.css';
import './AppMP.css';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  Layout,
  Page,
  FooterHelp,
  Card,
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
  Checkbox,
  ResourceList,
  Select

} from '@shopify/polaris';
import '@shopify/polaris/styles.css';

class ProductMappingTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      typed: '',
      permissionObject: {},
      mappingObject: {},
      CBdisabled: true,
      CBchecked: false,
      selectVal: ""
    };

    let testlist = this.props.tracelist;
    let arraytestlist = testlist.split("");
    this.settingServices = new settingServices();
    this.changeMapping = this.changeMapping.bind(this);
    this.changePermission = this.changePermission.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onPermissionChange = this.onPermissionChange.bind(this);
  }

  
  changeMapping(value, id) {
    this.props.updateMapping(value, id);
    this.setState({ selectVal: value });
  }

  changePermission(value, id) {
    id = id.substring(2);
    this.props.updatePermission(value, id);
  }

  onItemChange(tracifiedItemID, shopifyProductID) {
    this.props.setNotSaved(true);
    if (!(tracifiedItemID == "noItem")) {
      this.setState({
        CBdisabled: false,
        selectVal: tracifiedItemID
      });
    }
    else {
      this.setState({
        CBdisabled: true,
        selectVal: tracifiedItemID,
        CBchecked: false
      });
    }
    this.props.onItemChange(tracifiedItemID, shopifyProductID);
  }

  onPermissionChange(permission, shopifyProductID) {
    this.props.setNotSaved(true);
    this.setState({ CBchecked: !this.state.CBchecked });
    console.log("state has changed in checkbox !!!!!!!!!!!!!");
    shopifyProductID = shopifyProductID.substring(2);
    this.props.onPermissionChange(permission, shopifyProductID);
    
    
  }

   render() {
    // OLD CODE 
    // let traceList = this.props.tracelist.split(" ");
    let traceList = JSON.parse(this.props.tracelist);
    let traceOptions = [{
      value: "noItem",
      label: "Select an item"
    }];
    let permission = false;
    let tracifiedItemId = "";

    for (let i = 0; i < traceList.length; i++) {
      traceOptions.push({
        value: traceList[i].itemID,
        label: traceList[i].itemName,
      });
    }

    if (this.props.mapping.hasOwnProperty(this.props.obj.id)) {
      this.state.CBchecked = this.props.mapping[this.props.obj.id][1];
      this.state.CBdisabled = false;
      this.state.selectVal = this.props.mapping[this.props.obj.id][0];
    }

    const CheckboxID = "CB" + this.props.obj.id

    return (
      <tr>
        <td>
          <div className="cell itemNameColumn">
            {this.props.obj.title}
          </div>
        </td>
        <td>
          <div className="cell hide-cell-xs shopifyIdColumn">
            {this.props.obj.id}
          </div>
        </td>
        <td className="itemTitle">
          <Select
            placeholder="Select"
            options={traceOptions}
            onChange={this.onItemChange}
            value={this.state.selectVal}
            id={this.props.obj.id}
          />
        </td>
        <td className="enableCheckbox">
          <Checkbox
            disabled={this.state.CBdisabled}
            label="Traceability Enabled"
            onChange={this.onPermissionChange}
            id={CheckboxID}
            checked={this.state.CBchecked} />
        </td>
      </tr>
    );

    <ProductMappingTableRow /> ,
      document.getElementById('root')
  }
}

export default ProductMappingTableRow;
