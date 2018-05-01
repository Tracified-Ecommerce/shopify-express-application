/**
 * @name pluginMainTabs.js
 * @description Component of the main segregated tab view of the plugin.  
 **/

import React, { Component } from 'react';
import { Tabs } from '@shopify/polaris';
import '@shopify/polaris/styles.css';
import ordersSubTabs from './ordersSubTabs';
import configGuide from './configuration/configGuide';
import settingStructure from './settings/settingStructure';
import confirmMsg from './messageBoxes/confirmMsg';

class pluginMainTabs extends Component {
  constructor(props) {
    super(props);

    this.handleTabChange = this.handleTabChange.bind(this);
    this.setNotSaved = this.setNotSaved.bind(this);

    this.state = {
      tempSelectedTab: 0,
      selectedTab: 0,
      notSaved: false,
      confirmHeading:"Confirm Navigation",
      confirmMessage:"You have unsaved changes. Are you sure you want to leave this page ?"
    };
  }

  setNotSaved(answer) {
    this.setState({ notSaved: answer });
  }

  toggleConfirm = () => {
    this.setState({
        isOpen: !this.state.isOpen,
        notSaved: false
    });
    this.setState({ selectedTab: this.state.tempSelectedTab });
  }

  toggleCancel = () => {
    this.setState({
        isOpen: !this.state.isOpen
    });
  }

  handleTabChange(selectedTab) {
    if (this.state.notSaved) {
      this.setState({tempSelectedTab: selectedTab}, () => {
        this.setState({isOpen: true});
      })  
    } else {
      this.setState({ selectedTab });
    }
  }

  render() {
    const { selectedTab } = this.state;

    const tabs = [
      {
        id: 'tab1',
        title: 'Order Details',
        panelID: 'panel2',
      },
      {
        id: 'tab2',
        title: 'Settings',
        panelID: 'panel2',
      },
      {
        id: 'tab3',
        title: 'Configuration',
        panelID: 'panel2',
      },
    ];

    const tabPanels = [
      (
        <Tabs.Panel id="panel1">
          <ordersSubTabs />
        </Tabs.Panel>
      ),
      (
        <Tabs.Panel id="panel2">
          <settingStructure setNotSaved={this.setNotSaved} />
        </Tabs.Panel>
      ),
      (
        <Tabs.Panel id="panel3">
          <configGuide />
        </Tabs.Panel>
      ),
    ];

    return (
      <div>
        <Tabs
          selected={selectedTab}
          tabs={tabs}
          onSelect={this.handleTabChange}
        />
        {tabPanels[selectedTab]}
        <confirmMsg show={this.state.isOpen}
          onConfirm={this.toggleConfirm}
          onCancel={this.toggleCancel}
          heading={this.state.confirmHeading}
          message={this.state.confirmMessage}>
        </confirmMsg>
      </div>
    );
  }
}

export default pluginMainTabs;