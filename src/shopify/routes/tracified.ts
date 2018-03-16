import { NextFunction, Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IRequest } from "../../types/session/sessionType";

import { IServices, Services } from "../../tracified/services";
import { Shop, ShopModel } from "../models/Shop";

const router = Router();

const tracifiedServices: IServices = new Services();

router.all("/*", (req: IRequest, res: Response, next: NextFunction) => {
    if (req.session && req.session.shop) {
        if (req.session.shop.tracified_token) {
            next();
        } else {
            res.status(401).send("Account Verification Failed. Please try reinstalling the Plugin");
        }

    } else {
        console.log("cookies not found");
        res.send("cookies not found, Please try re-openning the app.");
    }
});

router.get("/item-list", (req: IRequest & Request, res: Response) => {
    console.log("getting the item list from admin backend");
    tracifiedServices.getTracifiedItemList(req.session.shop.tracified_token).then((data: any) => {
        const dataJSON = JSON.parse(data);
        console.log("Item list response is  " + data);
        console.log("token for item list is " + req.session.shop.tracified_token);
        res.json(data);
    }).catch((err) => {
        console.log("item list error : " + err);
    });
});

router.get("/trace/:orderID/:itemID", (req: IRequest & Request, res: Response) => {
    const orderID = req.params.orderID;
    const itemID = req.params.itemID;
    console.log(orderID + itemID);
    tracifiedServices.getOrderItemTraceabilityData(orderID, itemID, req.session.shop.tracified_token)
        .then((data: any) => {
            console.log(data);
            res.send(data);
        }).catch((error) => {
            console.log("ERROR IN TIMELINE CALL : " + error.error);
            console.log("Status Code of error : " + error.statusCode);
            res.status(error.statusCode).send(error);
        });
});

router.get("/artifacts/:itemID", (req: IRequest & Request, res: Response) => {
    const itemID = req.params.itemID;
    tracifiedServices.getProductArtifacts(itemID, req.session.shop.tracified_token).then((data: any) => {
        res.send(data);
    }).catch((error) => {
        console.log(error);
    });
});

export { router };
