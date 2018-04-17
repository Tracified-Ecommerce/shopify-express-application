import React, { Component } from 'react';
import { Tabs } from '@shopify/polaris';
import '@shopify/polaris/styles.css';
import SubTabs from './subTabs';
import Installation from './Install';
import Mapping from './ProductMappingModule/ProductMapping';
import Confirm from './Confirm';

class TabsView extends Component {
  constructor(props) {
    super(props);

    this.handleTabChange = this.handleTabChange.bind(this);
    this.setNotSaved = this.setNotSaved.bind(this);

    this.state = {
      tempSelectedTab: 0,
      selectedTab: 0,
      notSaved: false,
      confirmHeading:"",
      confirmMessage:"Are you sure"
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
    this.setState({ selectedTab: this.state.tempSelectedTab });
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
          <SubTabs />
        </Tabs.Panel>
      ),
      (
        <Tabs.Panel id="panel2">
          <Mapping setNotSaved={this.setNotSaved} />
        </Tabs.Panel>
      ),
      (
        <Tabs.Panel id="panel3">
          <Installation />
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
        <Confirm show={this.state.isOpen}
          onConfirm={this.toggleConfirm}
          onCancel={this.toggleCancel}
          heading={this.state.confirmHeading}
          message={this.state.confirmMessage}>
        </Confirm>
      </div>
    );
  }
}

export default TabsView;