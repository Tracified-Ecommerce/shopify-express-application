import { NextFunction, Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IServices, Services } from "../../tracified/services";
import { Imodal } from "../../types/modal/modalType";
import { IRequest } from "../../types/session/sessionType";
import { componentBuilder, IResponseJSON } from "../helpers/modalComponentBuilder";
import { Shop, ShopModel } from "../models/Shop";
import { ShopifyMapping, ShopifyMappingModel } from "../models/ShopifyMapping";

const router = Router();
const tracifiedServices: IServices = new Services();

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
                                let componentArray = [];
                                componentArray = data.data[0].pointOfSale;
                                const responseJSON: IResponseJSON = {
                                    components: {
                                        htmltxt: "",
                                        pieChartData: [],
                                    },
                                    map: [],
                                };
                                responseJSON.components = componentBuilder(componentArray);
                                return res.send(responseJSON);
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
