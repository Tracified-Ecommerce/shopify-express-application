function buildComponent(component: any): string {

    let txt = "<div class=\"col-md-4 col-sm-6 col-xs-12\">";
    let tot: number = 0;

    switch (component.uiComponent.name) {

        case "pieChart" :
            console.log("pieChart");
            for (const value of component.values) {
                if ( value === true ) {
                    tot++;
                }
            }
            txt += "<div>piechart " + tot + "</div>";
            txt += "<div class=\"titleDiv\">" + component.uiComponent.title + "</div>" +
            "<div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
            break;

        case "outOfTen" :
            if (component.uiComponent.titleFunction) {
                if (component.uiComponent.titleFunction === "getMode") {
                    const valMap: any = {};
                    let maxElement = "";
                    let maxCount = 0;
                    for (const value of component.values) {
                        console.log("value is :" + value);
                        if (!valMap.hasOwnProperty(value)) {
                            valMap[value] = 0;
                            console.log("valmap value set is :" + value);
                            console.log("valmap is : " + JSON.stringify(valMap));
                        } else {
                            valMap[value] = valMap[value] + 1;
                            console.log("valmap value is :" + valMap[value]);
                            if (valMap[value] > maxCount) {
                                maxCount = valMap[value];
                                maxElement = value;
                            }
                        }
                    }
                    txt += "<div class=\"large-green\">" + maxCount + "/" + component.values.length + "</div>" +
                    "<div class=\"titleDiv\">" + maxElement + "</div>" +
                    "<div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                }
            } else {
                for (const value of component.values) {
                    if ( value === true ) {
                        tot++;
                    }
                }
                txt += "<div class=\"large-green\">" + tot + "/" + component.values.length + "</div>";
                txt += "<div class=\"titleDiv\">" +
                component.uiComponent.title +
                "</div><div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                console.log("outOfTen");
            }
            break;

        case "barChart" :
            for (const value of component.values) {
                if ( value === true ) {
                    tot++;
                }
            }
            txt += "<div>out of ten " + tot + "</div>";
            console.log("trueFalse");
            txt += "<div class=\"titleDiv\">" + component.uiComponent.title +
            "</div><div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
            break;

        default :
            console.log("default");
            break;

    }

    return txt;
}

export { buildComponent };
