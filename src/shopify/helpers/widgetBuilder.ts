// tslint:disable:max-line-length
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
    imageArray: any[];
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
                    "<div class=\"xoutofy-top\">" + component.data + "</div><div class=\"xoutofy-middle\">out of " + otpCount + "</div>"
                    + "<div class=\"titleDiv\"><span class=\"titleModifier\"></span>" +
                    component.title +
                    "</div><div class=\"subtitleDiv\">" + component.displayInfo.subTitle + "</div></div>";
                break;

            case "fraction":
                let titleText = "";
                for (const property in component.data) {
                    if (component.data.hasOwnProperty(property)) {
                        tot += component.data[property];
                        break;
                    }
                }

                if (component.displayInfo.prefix) {
                    titleText = component.displayInfo.prefix + " " + component.title;
                } else {
                    titleText = component.title;
                }

                componentJSON.htmltxt +=
                    "<div class=\"large-green\">" + tot + "/" + otpCount + "</div>"
                    + "<div class=\"titleDiv\">" +
                    titleText +
                    "</div><div class=\"subtitleDiv\">" + component.displayInfo.subTitle + "</div></div>";

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
        dimensionComponents.htmltxt += "<div class=\"col-md-6\" id=\"dimensionName\"><table class=\"tblDimensions\"><tr><td class=\"dimTitle\" style=\"background-color:" + dimension.displayInfo.titleBackColor + ";color:" + dimension.displayInfo.titleTxtColor + "\">" + dimension.displayInfo.name + "";
        dimensionComponents.htmltxt += "</td><td class=\"descript\" style=\"background-color:" + dimension.displayInfo.descriptionBackColor + ";color:" + dimension.displayInfo.descriptionTxtColor + "\">" + dimension.displayInfo.tagline + "</td></tr>";

        for (const x of dimension.data) {
            let value = "";
            if (x.value === true) {
                value = "yes";
            } else if (x.value === false) {
                value = "no";
            } else if (x.value.max && x.value.min) {
                value = x.value.min + " to " + x.value.max;
            } else if (Array.isArray(x.value)) {
                const valSet = new Set(x.value);
                for (const item of valSet) {
                    value += item + ", ";
                }
            } else {
                value = x.value;
            }

            dimensionComponents.htmltxt += "<tr class=\"dimensionContent\"><td class=\"keyTitle\">" + x.label + "</td><td class=\"keyContent\">" + value + "</td></tr>";
        }
        dimensionComponents.htmltxt += "</table></div>";
    }

    return dimensionComponents;

}

// image slider builder function
function widgetImageSliderBuilder(images: any): IWidgetImageSliderJSON {
    const imageSliderComponents: IWidgetImageSliderJSON = {
        htmltxt: "",
        imageArray: [],
    };

    let firstRow = true;
    let imageIdentifier = 0; // to keep track of image rows
    // for every nth item, modulo n of imageIdentifier will be zero
    const imagesPerRow = 4;

    for (const image of images) {
        // for every nth item, modulo n of imageIdentifier will be zero
        // this can be used to track how many images have gone into each row
        if (imageIdentifier % imagesPerRow === 0) {
            if (firstRow) {
                imageSliderComponents.htmltxt += "<div class=\"item active\"><div class=\"row\">";
                firstRow = false;
            } else {
                imageSliderComponents.htmltxt += "<div class=\"item\"><div class=\"row\">";
            }
        }

        if ((imageIdentifier + 1) % imagesPerRow === 0) {
            imageSliderComponents.htmltxt += "<div class=\"col-xs-12 col-sm-12 col-md-3 col-lg-3\">"
                + "<img id=\"img" + imageIdentifier + "\" align=\"middle\" hspace=\"10\">"
                + "<div class=\"carousel-caption\">"
                + "</div></div></div></div>";
        } else {
            imageSliderComponents.htmltxt += "<div class=\"col-xs-12 col-sm-12 col-md-3 col-lg-3\">"
                + "<img id=\"img" + imageIdentifier + "\" align=\"middle\" hspace=\"10\">"
                + "<div class=\"carousel-caption\">"
                + "</div></div>";
        }

        const imgObj = {
            id: "img" + imageIdentifier,
            src: image,
        };

        imageSliderComponents.imageArray.push(imgObj);
        imageIdentifier++;
    }

    if (images.length % imagesPerRow !== 0) {
        imageSliderComponents.htmltxt += "</div></div>";
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

        mapComponents.htmltabs += "<button id =\"button" + count + "\" class=\"tablinks\" onclick=\"openCity(event, 'tab" + count + "')\">" + tab.tabName + "</button>";
        mapComponents.htmltabcontent += "<div id =\"tab" + count + "\" class =\"tabcontent\">";
        mapComponents.htmltabcontent += "<div id =\"map" + count + "\" style=\"height: 440px; border: 1px solid #AAA;\"></div></div>";
        const mapTab: IWidgetMapTab = {
            mapID: "map" + count,
            markers: [],
        };

        for (const coordinate of tab.values) {

            const mapData = {
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

function dateFormatter(date: string): string {
    const dat = date; // TODO add formatting
    return dat;
}

export { widgetComponentBuilder, widgetDimensionBuilder, widgetImageSliderBuilder, widgetMapBuilder, IWidgetComponentJSON, IWidgetDimensionJSON, IWidgetImageSliderJSON, IWidgetMapJSON, IWidgetResponseJSON };
