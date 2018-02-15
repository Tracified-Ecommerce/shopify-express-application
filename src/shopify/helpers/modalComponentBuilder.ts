interface IComponentJSON {
    htmltxt: string;
}

function componentBuilder(components: any): IComponentJSON {

    let htmltxt = "";
    const componentJSON: IComponentJSON = {htmltxt: ""};

    for (const component of components) {
        htmltxt = "<div class=\"col-md-4 col-sm-6 col-xs-12\">";
        let tot: number = 0;
        switch (component.uiComponent.name) {

            case "pieChart" :
                for (const value of component.values) {
                    if ( value === true ) {
                        tot++;
                    }
                }
                htmltxt += "<div class=\"large-green\">pie " + tot + "</div>";
                htmltxt += "<div class=\"titleDiv\">" + component.uiComponent.title + "</div>" +
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
                        htmltxt += "<div class=\"large-green\">" + maxCount + "/" + component.values.length + "</div>" +
                        "<div class=\"titleDiv\">" + maxElement + "</div>" +
                        "<div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                    }
                } else {
                    for (const value of component.values) {
                        if ( value === true ) {
                            tot++;
                        }
                    }
                    htmltxt += "<div class=\"large-green\">" + tot + "/" + component.values.length + "</div>";
                    htmltxt += "<div class=\"titleDiv\">" +
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
                htmltxt += "<div class=\"large-green\">bar " + tot + "</div>";
                htmltxt += "<div class=\"titleDiv\">" + component.uiComponent.title +
                "</div><div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                break;

            default :
                console.log("default");
                break;

        }
    }

    componentJSON.htmltxt = htmltxt;
    return componentJSON;
}

export { componentBuilder, IComponentJSON };
