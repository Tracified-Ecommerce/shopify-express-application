import { NextFunction, Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IServices, Services } from "../../tracified/services";
import { Imodal } from "../../types/modal/modalType";
import { IRequest } from "../../types/session/sessionType";
import { Shop, ShopModel } from "../models/Shop";
import { ShopifyMapping, ShopifyMappingModel } from "../models/ShopifyMapping";

const router = Router();
const tracifiedServices: IServices = new Services();

function buildComponent(component: any): string {

    let txt = "<div class=\"col-lg-3 col-md-4 col-sm-6 col-xs-12\">";
    let tot: number = 0;

    switch (component.uiComponent.name) {
        case "pieChart" :
            console.log("pieChart");
            for (const value of component.values) {
                if ( value === true ) {
                    tot++;
                }
            }
            txt += "<p>piechart " + tot + "</p>";
            break;
        case "outOfTen" :
            for (const value of component.data) {
                if ( value === true ) {
                    tot++;
                }
            }
            txt += "<p>out of ten " + tot + "</p>";
            console.log("trueFalse");
            break;
        case "barChart" :
            for (const value of component.data) {
                if ( value === true ) {
                    tot++;
                }
            }
            txt += "<p>out of ten " + tot + "</p>";
            console.log("trueFalse");
            break;
        default :
            console.log("default");
            break;

    }

    txt += "<h2>" + component.title + "</h2><p>" + component.subTitle + "</p></div>";
    return txt;
}

router.all("/*", (req: IRequest & Request, res: Response, next: NextFunction) => {
    const re = /^\/(modal-mapping\/)[a-zA-Z0-9]+/;
    if (re.test(req.path)) {
        next();
    }
});

router.get("/modal-mapping/:shopname/:productID", (req: IRequest & Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const shopName = req.params.shopname;
    const product = req.params.productID;
    ShopifyMapping.findOne({ shop_name: shopName }, (err: Error, mapping: ShopifyMappingModel) => {
        if (err) {
            return res.status(503).send("error with db connection. Plese try again in a while");
        }
        if (mapping) {
            // mapping.mapping -> is the object with all the mapping
            if (mapping.mapping.hasOwnProperty(product)) {
                const TracifiedID = mapping.mapping[product][0];
                Shop.findOne(
                    { name: shopName },
                    "name access_token tracified_token",
                    (errr: Error, exisitingShop: ShopModel) => {
                    if (err) {
                        return res.status(503).send("error with db connection. Plese try again in a while");
                    }
                    if (exisitingShop && exisitingShop.tracified_token) {
                        const tracifiedToken = exisitingShop.tracified_token;

                        tracifiedServices.getModalData(TracifiedID, tracifiedToken).then((data) => {
                            console.log("got data");
                            console.log(data);
                            console.log(data.data[0].pointOfSale);
                            let htmltxt = "";
                            let componentArray = [];
                            componentArray = data.data[0].pointOfSale;
                            for (const component of componentArray) {
                                htmltxt += buildComponent(component);
                            }
                            return res.send(htmltxt);
                        });

                    } else {
                        return res.send("no shop in database");
                    }
                });
            } else {
                return res.send("item not found");
            }
        } else {
            return res.status(204).send("mapping not available");
        }

    });
});

export { router };
