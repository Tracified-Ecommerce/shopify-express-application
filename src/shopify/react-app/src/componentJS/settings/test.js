import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import settingServices from './settingServices';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

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


} from '@shopify/polaris';
import '@shopify/polaris/styles.css';

class settingDetailTbl extends Component {
    constructor(props) {
        super(props);

        this.props.tracelist.forEach(v => console.log(v.id));

        this.settingServices = new settingServices();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.settingServices.deleteData(this.props.obj.id);
    }
    render() {
        return (
            <tr>
                <td>
                    <Badge>
                        <Select
                            options={[
                                this.props.obj.title

                            ]}
                            placeholder="Traceability Product IDs"
                        />
                    </Badge>

                </td>
                <td>
                    {this.props.obj.title}
                </td>
                <td>
                    {this.props.obj.id}
                </td>
                <td>
                    <Select
                        options={

                            this.props.tracelist.forEach(
                                v =>
                                    [v.id]
                            )
                        }
                        placeholder="Traceability Product IDs"
                    />
                </td>
                <td>
                    <Checkbox label="Traceability Enabled " />
                </td>
                <td>
                    <form onSubmit={this.handleSubmit}>

                    </form>
                </td>
            </tr>
        );

    }
}

export default settingDetailTbl;