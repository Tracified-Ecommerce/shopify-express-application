// tslint:disable:max-line-length
import { NextFunction, Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IOrder } from "../../types/order/orderType";
import { IRequest } from "../../types/session/sessionType";
import { Helper, IHelper } from "../helpers/index";

const helper: IHelper = new Helper();
const router = Router();
const shopAdminAPI = helper.shopAdminAPI;
const createPromise = helper.createPromise;

router.all("/*", (req: IRequest, res: Response, next: NextFunction) => {
    if (req.session && req.session.shop) {
        req.shopRequestHeaders = {
            "X-Shopify-Access-Token": req.session.shop.access_token,
        };
        next();
    } else {
        console.log("cookies disabled");
        res.send("cookies not found, Please try re-openning the app.");
    }
});

router.get("/products", (req: IRequest, res: Response) => {
    shopAdminAPI(
        "GET", req.session.shop.name, "/admin/products.json", req.shopRequestHeaders, null, (products: any) => {
            res.status(200).send(products);
        });
});

router.get("/orderCount", (req: IRequest, res: Response) => {
    let orderCount = 0;
    shopAdminAPI("GET", req.session.shop.name, "/admin/orders/count.json", req.shopRequestHeaders, null, (response: any) => {
        console.log("got order count : " + response.count);
        orderCount = response.count;
        let pageCount = Math.ceil(620 / 250);
        console.log("test page count = " + pageCount);
        pageCount = Math.ceil(orderCount / 250);
        console.log("actual page count = " + pageCount);
<<<<<<< HEAD
        let orderURL = "";
        let unTracified: any[] = [];
        let tempArray: any[] = [];
        let promiseArray: any[] = [];
        for (let i = 1; i <= pageCount; i++) {
            orderURL = "/admin/orders.json?status=any&limit=250&page=" + i;
            console.log(orderURL);
            promiseArray.push(createPromise("GET", req.session.shop.name, orderURL, req.shopRequestHeaders, null).then((orders: any) => {
                tempArray = orders.orders.filter((order: IOrder) => {
                    let flag = true;
                    order.note_attributes.map((noteAttrib: any) => {
                        if (noteAttrib.name === "tracified" && noteAttrib.value === "true") {
                            flag = false;
                        }
                    });
                    return flag;
                });
                unTracified = unTracified.concat(tempArray);
                console.log("untracified : " + unTracified);
            }));
=======
        res.status(200).send({ orderCount, pageCount });
    });

});

router.get("/orders", (req: IRequest, res: Response) => {
>>>>>>> 2ec66f04787168eeedfea16605ae5195053e41fb

            // shopAdminAPI("GET", req.session.shop.name, "/admin/orders.json", req.shopRequestHeaders, null, (orders: any) => {
            //     tempArray = orders.orders.filter((order: IOrder) => {
            //         let flag = true;
            //         order.note_attributes.map((noteAttrib: any) => {
            //             if (noteAttrib.name === "tracified" && noteAttrib.value === "true") {
            //                 flag = false;
            //             }
            //         });
            //         return flag;
            //     });
            //     unTracified = unTracified.concat(tempArray);
            // });
        }
        Promise.all(promiseArray).then(() => {
            res.status(200).send({ orders: unTracified });
        });
    });
});

router.get("/fulfilled-orders", (req: IRequest, res: Response) => {
    console.log("fullfilled orders");
    const shopDomain = req.session.shop.name;
    shopAdminAPI(
        "GET", req.session.shop.name,
        "/admin/orders.json?status=any",
        req.shopRequestHeaders,
        null,
        (orders: any) => {
            const fulfilledOrders = orders.orders.filter((order: IOrder) => {
                let flag = false;
                order.note_attributes.map((noteAttrib: any) => {
                    if (noteAttrib.name === "tracified" && noteAttrib.value === "true") {
                        flag = true;
                    }
                });
                console.log("inside fulfilled function");
                return flag;
            });

            res.status(200).send({ fulfilledOrders, shopDomain });
        });
});

router.get("/orders/:id/fulfill", (req: IRequest & Request, res: Response) => {
    const url: string = "/admin/orders/" + req.params.id + "/fulfillments.json";
    const body: object = {
        fulfillment: {
            notify_customer: true,
            tracking_number: null,
        },
    };
    shopAdminAPI("POST", req.session.shop.name, url, req.shopRequestHeaders, body, (fulfillment: any) => {
        console.log("order fulfilled");
        res.status(200).send(fulfillment);
    });
});

router.get("/orders/:id/tracify", (req: IRequest & Request, res: Response) => {
    const url: string = "/admin/orders/" + req.params.id + ".json";
    const body: object = {

        order: {
            id: req.params.id,
            note_attributes: {
                tracified: true,
            },
        },
    };

    shopAdminAPI("PUT", req.session.shop.name, url, req.shopRequestHeaders, body, (order: any) => {
        console.log("order fulfilled");
        res.status(200).send(order);
    });
});

router.get("/item/:id", (req: IRequest & Request, res: Response) => {
    const url: string = "/admin/products/" + req.params.id + ".json";

    shopAdminAPI("GET", req.session.shop.name, url, req.shopRequestHeaders, null, (item: any) => {
        console.log("item request sent");
        res.status(200).send(item);
    });
});

export { router };
