interface IWidgetComponentJSON {
    htmltxt: string;
    pieChartData: any[];
}

// dimension component
interface IWidgetDimensionJSON {
    htmltxt: string;
}

// mapTab component
interface IWidgetMapTab {
    markers: any[];
    mapID: string;
}
// image slider component
interface IWidgetImageSliderJSON {
    htmltxt: string;
}

// map component
interface IWidgetMapJSON {
    htmltabs: string;
    htmltabcontent: string;
    mapTabData: any[];
}

interface IWidgetResponseJSON {
    components: IWidgetComponentJSON;
    mapComponents: IWidgetMapJSON;
    dimensionComponents: IWidgetDimensionJSON;
    imageSliderComponents: IWidgetImageSliderJSON;
}

function widgetComponentBuilder(components: any, otpCount: any): IWidgetComponentJSON {

    const componentJSON: IWidgetComponentJSON = {
        htmltxt: "",
        pieChartData: [],
    };

    let componentIdentifier = 0;

    for (const component of components) {
        componentJSON.htmltxt += "<div class=\"col-md-4 col-sm-6 col-xs-12\">";
        let tot: number = 0;
        switch (component.displayInfo.componentType) {

            case "pieChart":

                const arcData = component.data;

                for (const property in arcData) {
                    if (arcData.hasOwnProperty(property)) {
                        tot += arcData[property];
                        break;
                    }
                }

                const pieOptions = {
                    canvas: "component" + componentIdentifier,
                    colors: ["#2f823a", "#5bfd72"], // TODO add more colours
                    data: arcData,
                    doughnutHoleSize: 0.5,
                    percentage: Math.floor((tot / (otpCount)) * 100).toString(),
                };

                componentJSON.pieChartData.push(pieOptions);
                componentJSON.htmltxt += "<canvas id=\"component" + componentIdentifier + "\"" + "></canvas>";
                componentJSON.htmltxt += "<div class=\"titleDiv\">" + component.title + "</div>" +
                    "<div class=\"subtitleDiv\">" + component.displayInfo.subTitle + "</div></div>";
                break;

            case "xOutOfY":

                componentJSON.htmltxt +=
                    // tslint:disable-next-line:max-line-length
                    "<div class=\"xoutofy-top\">" + component.data + "</div><div class=\"xoutofy-middle\">out of " + otpCount + " items</div>"
                    + "<div class=\"titleDiv\"><span class=\"titleModifier\">" + "have " + "</span>" +
                    component.title +
                    "</div><div class=\"subtitleDiv\">" + component.displayInfo.subTitle + "</div></div>";
                break;

            case "fraction":

                for (const property in component.data) {
                    if (component.data.hasOwnProperty(property)) {
                        tot += component.data[property];
                        break;
                    }
                }

                componentJSON.htmltxt +=
                    "<div class=\"large-green\">" + tot + "/" + otpCount + "</div>"
                    + "<div class=\"titleDiv\">" +
                    component.title +
                    "</div><div class=\"subtitleDiv\">" + component.disp.subTitle + "</div></div>";

                break;

            default:
                console.log("default");
                break;

        }

        componentIdentifier++;
    }

    return componentJSON;
}

// dimension builder function
function widgetDimensionBuilder(dimensions: any): IWidgetDimensionJSON {
    const dimensionComponents: IWidgetDimensionJSON = {
        htmltxt: "",
    };

    for (const dimension of dimensions) {
        // tslint:disable-next-line:max-line-length
        dimensionComponents.htmltxt += "<div class=\"col-md-6\" id=\"dimensionName\"><table class=\"tblDimensions\"><tr><td class=\"dimTitle\" style=\"background-color:" + dimension.displayInfo.titleBackColor + ";color:" + dimension.displayInfo.titleTxtColor + "\">" + dimension.displayInfo.name + "";
        // tslint:disable-next-line:max-line-length
        dimensionComponents.htmltxt += "</td><td class=\"descript\" style=\"background-color:" + dimension.displayInfo.descriptionBackColor + ";color:" + dimension.displayInfo.descriptionTxtColor + "\">" + dimension.displayInfo.tagline + "</td></tr>";

        for (const x of dimension.data) {
            // tslint:disable-next-line:max-line-length
            let value = "";
            if (x.value === true) {
                value = "yes";
            } else if (x.value === false) {
                value = "no";
            } else {
                value = x.value;
            }

            // tslint:disable-next-line:max-line-length
            dimensionComponents.htmltxt += "<tr class=\"dimensionContent\"><td class=\"keyTitle\">" + x.label + "</td><td class=\"keyContent\">" + value + "</td></tr>";
        }
        dimensionComponents.htmltxt += "</table></div>";
    }

    return dimensionComponents;

}

// image slider builder function
// this is not complete, only the structure of the html is built here
// TODO assign images dynamically -> waiting on tracifiedbackend for images
function widgetImageSliderBuilder(images: any): IWidgetImageSliderJSON {
    const imageSliderComponents: IWidgetImageSliderJSON = {
        htmltxt: "",
    };

    let imageIdentifier = 0; // to keep track of images we have already looked at
    let rowCount = 0; // to keep track of image rows

    while (rowCount < 2) {
        // row code

        for (let i = 0; i < 3; i++) {

            // code for columns inside row
            if (rowCount === 0) {
                imageSliderComponents.htmltxt += "<div class=\"item active\"><div class=\"row\">";
            } else {
                imageSliderComponents.htmltxt += "<div class=\"item\"><div class=\"row\">";
            }

            // tslint:disable-next-line:max-line-length
            imageSliderComponents.htmltxt += "<div class=\"col-md-4\"><img id=\"img" + imageIdentifier + "\" width=\"100\" height=\"200\" align=\"middle\" hspace=\"30\"><div class=\"carousel-caption\"></div></div></div></div>";
            // images[imageIdentifier]
            imageIdentifier++;
        }

        rowCount++;
    }

    return imageSliderComponents;

}

function widgetMapBuilder(tabs: any): IWidgetMapJSON {
    const mapComponents: IWidgetMapJSON = {
        htmltabcontent: "",
        htmltabs: "",
        mapTabData: [],
    };

    let count: number = 0;

    for (const tab of tabs) {

        // tslint:disable-next-line:max-line-length
        mapComponents.htmltabs += "<button id =\"button" + count + "\" class=\"tablinks\" onclick=\"openCity(event, 'tab" + count + "')\">" + tab.tabName + "</button>";
        mapComponents.htmltabcontent += "<div id =\"tab" + count + "\" class =\"tabcontent\">";
        // tslint:disable-next-line:max-line-length
        mapComponents.htmltabcontent += "<div id =\"map" + count + "\" style=\"height: 440px; border: 1px solid #AAA;\"></div></div>";
        const mapTab: IWidgetMapTab = {
            mapID: "map" + count,
            markers: [],
        };

        for (const coordinate of tab.values) {

            const mapData = {
                // label: coordinate.label,
                lat: parseFloat(coordinate.lat),
                long: parseFloat(coordinate.long),
            };
            mapTab.markers.push(mapData);

        }

        mapComponents.mapTabData.push(mapTab);
        count++;

    }

    return mapComponents;
}

// tslint:disable-next-line:max-line-length
export { widgetComponentBuilder, widgetDimensionBuilder, widgetImageSliderBuilder, widgetMapBuilder, IWidgetComponentJSON, IWidgetDimensionJSON, IWidgetImageSliderJSON, IWidgetMapJSON, IWidgetResponseJSON };
