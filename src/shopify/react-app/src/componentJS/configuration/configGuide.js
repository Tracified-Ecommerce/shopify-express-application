
/**
 * @name configGuide.js
 * @description This contains code for tab content of Tracified configuration guide.
 **/

import React, { Component } from 'react';
import { Card, DisplayText, Button ,Page} from '@shopify/polaris';
import { Container, Row, Col } from 'reactstrap';
import './styleCSS/configuration/configGuide.css';
import './styleCSS/configuration/configGuide-MediaQueries.css';

class Installation extends Component {
    render() {
        var liStyle = {
            marginTop: '2%'
        }

        var lastIntPara = {
            marginBottom: '2%'
        }

        return (
            <div className="installPageWrapper">
            <Page title="Tracified - Configuration Instructions">
            <div className="configWrapper">
                    <iframe className="ecomConfigVideo" width="100%" height="583px" src="https://www.youtube.com/embed/gk8W521N5d4?showinfo=0&controls=1&rel=0&amp" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
               
                    <Card>
                        <ol>
                            <li style={liStyle}>
                                From the Shopify Admin panel, click on <code>"Online Store"</code>
                            </li>
                            <li>
                                Click on the <code>Actions</code> dropdown button for the current published theme and select <code>Edit Code</code>.
                            </li>
                            <li>Select the file to be edited depending on the theme.
                                <ul>
                                    <br />
                                    <li>For a Sectioned Theme, locate and click on product.liquid under the Templates folder to open it for editing. </li>
                                    <li>For a Non-Sectioned Theme, locate and click on product-template.liquid under the Sections folder to open it for editing. <br />(The liquid file should contain the details of the products.)</li>
                                </ul>

                            </li>
                            <li>
                                Subsequently, following liquid code snippet should be included in the selected liquid file and save the changes. <br /><br />
                                <code>
                                    {"{% include 'tracified' %}"}
                                </code>

                            </li>
                        </ol>

                        <p class="lastLine">
                            <code>NOTE: The installation process must be redone whenever a new theme is published</code>
                        </p>

                        <div class="lastInst">
                            <p>
                                To uninstall, simply remove the code snippet inserted into the theme. Removing or leaving the assets which were uploaded during installation will make no adverse effect on the site.
                            </p>
                        </div>
                    </Card>
                    <br />
                </div>
            </Page>
            </div>
        );
    }
}
export default Installation;