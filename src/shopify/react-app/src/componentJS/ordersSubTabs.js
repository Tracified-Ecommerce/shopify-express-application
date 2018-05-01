/**
 * @name ordersSubTabs.js
 * @description component for the nested tab view of orders tab.
 **/

import React, { Component } from 'react';
import {Tabs} from '@shopify/polaris';
import '@shopify/polaris/styles.css';
import settingStructure from './settings/settingStructure';
import untracifiedBase from './untracifiedOdrs/untracifiedBase';
import tracifiedBase from './tracifiedOdrs/tracifiedBase';

class ordersSubTabs extends Component {
  constructor(props) {
    super(props);

    this.handleTabChange = this.handleTabChange.bind(this);

    this.state = {
      selectedTab: 0,
    };
  }

  handleTabChange(selectedTab) {
    this.setState({selectedTab});
  }

  render() {
    const {selectedTab} = this.state;

    const tabs = [
      {
        id: 'tab1',
        title: 'UnTracified Orders',
        panelID: 'panel2',
      },
      {
        id: 'tab2',
        title: 'Tracified Orders',
        panelID: 'panel2',
      },
    ];

    const tabPanels = [
      (
        <Tabs.Panel id="panel1">
          <untracifiedBase/>
        </Tabs.Panel>
      ),
      (
        <Tabs.Panel id="panel2">
        <tracifiedBase/>
        </Tabs.Panel>
      )
    ];

    return (
      <div>
        <Tabs
          fitted
          selected={selectedTab}
          tabs={tabs}
          onSelect={this.handleTabChange}
        />
        {tabPanels[selectedTab]}
      </div>
    );
  }
}

export default ordersSubTabs;