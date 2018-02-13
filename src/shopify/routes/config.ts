import { NextFunction, Request, Response, Router } from "express";
import { IRequest } from "../../types/session/sessionType";
import { ShopifyMapping, ShopifyMappingModel } from "../models/ShopifyMapping";

import { Error } from "mongoose";

const router = Router();

router.all("/*", (req: IRequest & Request, res: Response, next: NextFunction) => {
    
    let re = /^\/(modal-mapping\/)[a-zA-Z0-9]+/;
    if(re.test(req.path)){
        next();
    } else if (req.session && req.session.shop) {
        next();
    } else {
        console.log("cookies not found");
        res.send("cookies not found, Please try re-openning the app.");
    }

});

router.get("/mapping", (req: IRequest, res: Response) => {
    const shop = req.session.shop;
    ShopifyMapping.findOne({ shop_name: shop.name }, (err: Error, mapping: ShopifyMappingModel) => {
        if (err) {
            return res.status(503).send("error with db connection. Plese try again in a while");
        }
        if (mapping) {
            return res.send(mapping.mapping);
        } else {
            return res.status(204).send({});
        }

    });
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
                return res.send(mapping.mapping[product][0]);
            } else {
                return res.send("item not found");
            }
        } else {
            return res.status(204).send("mapping not available");
        }

    });
        
});

router.post("/mapping", (req: IRequest & Request, res: Response) => {
    const shop = req.session.shop;
    console.log(req.body.mapping + "was posted to api");
    ShopifyMapping.findOne({
        shop_name: shop.name },
        (err: Error, mapping: ShopifyMappingModel) => { // use if a mapping record is alredy there
        if (err) {
            return res.status(503).send("error with db connection. Plese try again in a while");
        }
        if (mapping) {
            mapping.mapping = req.body.mapping;
            mapping.save((errr: Error) => {
                if (errr) {
                    return res.status(503).send("error with db connection. Plese try again in a while");
                }
                res.send("mapping successfully saved");
            });
        } else {
            const mappingInstance = new ShopifyMapping({ shop_name: shop.name, mapping: req.body.mapping });
            mappingInstance.save( (errr: Error) => {
                if (errr) {
                    return res.status(503).send("error with db connection. Plese try again in a while");
                }
                res.send("mapping successfully saved");
            });
        }
    });
});

export { router };
