interface IComponentJSON {
    htmltxt: string;
    pieChartData: any[];
}

function componentBuilder(components: any): IComponentJSON {

    const componentJSON: IComponentJSON = {htmltxt: "", pieChartData: []};

    for (const component of components) {
        componentJSON.htmltxt += "<div class=\"col-md-4 col-sm-6 col-xs-12\">";
        let tot: number = 0;
        switch (component.uiComponent.name) {

            case "pieChart" :
                for (const value of component.values) {
                    if ( value === true ) {
                        tot++;
                    }
                }
                const pieData = {
                    divName: component.key,
                    values: [tot, (component.values.length - tot)],
                };

                componentJSON.pieChartData.push(pieData);
                componentJSON.htmltxt += "<div class=\"ct-chart ct-square\" id=\"" + component.key + "\"" + "></div>";
                componentJSON.htmltxt += "<div class=\"titleDiv\">" + component.uiComponent.title + "</div>" +
                "<div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                break;

            case "outOfTen" :
                if (component.uiComponent.titleFunction) {
                    if (component.uiComponent.titleFunction === "getMode") {
                        const valMap: any = {};
                        let maxElement = "";
                        let maxCount = 0;
                        for (const value of component.values) {
                            if (!valMap.hasOwnProperty(value)) {
                                valMap[value] = 0;
                            } else {
                                valMap[value] = valMap[value] + 1;
                                if (valMap[value] > maxCount) {
                                    maxCount = valMap[value];
                                    maxElement = value;
                                }
                            }
                        }
                        componentJSON.htmltxt +=
                        "<div class=\"large-green\">" + maxCount + "/" + component.values.length + "</div>" +
                        "<div class=\"titleDiv\">" + maxElement + "</div>" +
                        "<div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                    }
                } else {
                    for (const value of component.values) {
                        if ( value === true ) {
                            tot++;
                        }
                    }
                    componentJSON.htmltxt +=
                    "<div class=\"large-green\">" + tot + "/" + component.values.length + "</div>"
                    + "<div class=\"titleDiv\">" +
                    component.uiComponent.title +
                    "</div><div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                }
                break;

            case "barChart" :
                for (const value of component.values) {
                    if ( value === true ) {
                        tot++;
                    }
                }
                componentJSON.htmltxt += "<div class=\"large-green\">bar " + tot + "</div>"
                + "<div class=\"titleDiv\">" + component.uiComponent.title +
                "</div><div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                break;

            default :
                console.log("default");
                break;

        }
    }

    return componentJSON;
}

export { componentBuilder, IComponentJSON };
