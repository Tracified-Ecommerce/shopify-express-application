/* tslint:disable:no-shadowed-variable max-line-length no-var-requires */
import request = require("request-promise");
import errors = require("request-promise/errors");
import * as configs from "../appConfig";
const tracifiedURL: string = "https://tracified-mock-api.herokuapp.com";
const tracifiedPosURL: string = configs.shopifyConfigs.services.tracifiedPosUrl;
const adminURL: string = configs.shopifyConfigs.services.adminURL;

export interface IServices {
    verifyTracifiedAccount(tempToken: string, shopName: string): Promise<any>;
    getTracifiedItemList(accessToken: any): Promise<any>;
    getOrderItemTraceabilityData(orderID: string, itemID: string, accessToken: string): Promise<any>;
    getProductArtifacts(itemID: string, accessToken: string): Promise<any>;
    getModalData(itemID: string, accessToken: string): Promise<any>;
    getPosData(itemID: string, accessToken: string): Promise<any>;
}

export class Services implements IServices {
    /**
     * this function will verify an Tracified account and connect store with the account
     * normally this will needed to be invoked once per installation
     * @param tempToken - token that will be provided from the tracified-admin
     * a callback url(or to return a promise?) will also need to send
     * and have implemented here to handle te after verification peocess
     */

    public verifyTracifiedAccount(tempToken: string, shopName: string) {
        console.log("inside veifyAccount Method, token is :" + tempToken + " shop is :" + shopName);
        return new Promise((resolve, reject) => {
            const options = {
                body: {
                    Ttoken: tempToken,
                    shop: shopName,
                },
                json: true,
                method: "POST",
                uri: adminURL + "ecom/ecompermenettoken",
            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                console.log(type);
                console.log(data);
                resolve(data);
            }).catch(errors.StatusCodeError, (reason) => {
                console.log("reason response is :" + JSON.stringify(reason.response));
                console.log("reason error is :" + JSON.stringify(reason.error));
                console.log("reason options are :" + JSON.stringify(reason.options));

                if (reason.statusCode) {
                    reject(reason.response);
                }
            })
                .catch(errors.RequestError, (reason) => {
                    console.log("inside catch2  " + reason.cause);
                    reject(reason);
                    // The request failed due to technical reasons.
                    // reason.cause is the Error object Request would pass into a callback.
                });
        });
    }

    public getTracifiedItemList(accessToken: any) {
        console.log("item list request Access token : " + accessToken);
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                method: "GET",
                uri: adminURL + "api/tracifieditem",
                // uri: "https://tracified-mock-api.herokuapp.com/Traceability_data/data/tracified_item_list/sort-list",
            };

            console.log("inside getItemList() , options are " + JSON.stringify(options));

            request(options).then((data: any) => {
                const type: string = typeof data;
                resolve(data);
            }).catch(errors.StatusCodeError, (reason) => {
                console.log("reason response is :" + JSON.stringify(reason.response));
                console.log("reason error is :" + JSON.stringify(reason.error));
                console.log("reason options are :" + JSON.stringify(reason.options));

                if (reason.statusCode === 406) {
                    reject(Error("invalid token"));
                }
            })
                .catch(errors.RequestError, (reason) => {
                    console.log("inside catch2  " + reason.cause);
                    // The request failed due to technical reasons.
                    // reason.cause is the Error object Request would pass into a callback.
                });
        });
    }

    public getOrderItemTraceabilityData(orderID: string, itemID: string, accessToken: string) {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                method: "GET",
                // uri: tracifiedURL + "/Traceability_data/otp/customer-app",
                uri: "https://tracified-mock-api.herokuapp.com/Traceability_data/Saaraketha-customer/timeline/:product_id",
                // uri: "https://staging.tracified.com/api/v1/traceabilityProfiles/ecommerce/admin/" + orderID + "/" + itemID,

            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                console.log(type);
                console.log(data);
                resolve(data);
            }).catch(errors.StatusCodeError, (reason) => {
                console.log("inside timeline catch1");
                console.log("reason response is :" + JSON.stringify(reason.response));
                console.log("reason error is :" + JSON.stringify(reason.error));
                console.log("reason options are :" + JSON.stringify(reason.options));
                reject(reason);

            })
                .catch(errors.RequestError, (reason) => {
                    console.log("inside timeline catch2  " + reason.cause);
                    reject(Error(reason.cause));
                    // The request failed due to technical reasons.
                    // reason.cause is the Error object Request would pass into a callback.
                });
        });
    }

    public getPosData(itemID: string, accessToken: string) {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                json: true,
                method: "GET",
                // uri: tracifiedURL + "/Traceability_data/otp/customer-app",
                uri: tracifiedPosURL + itemID,

            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                resolve(data);
            }).catch(errors.StatusCodeError, (reason) => {
                console.log("inside pos catch1");
                console.log("reason response is :" + JSON.stringify(reason.response));
                console.log("reason error is :" + JSON.stringify(reason.error));
                console.log("reason options are :" + JSON.stringify(reason.options));
                reject(reason);

            })
                .catch(errors.RequestError, (reason) => {
                    console.log("inside pos catch2  " + reason.cause);
                    reject(Error(reason.cause));
                    // The request failed due to technical reasons.
                    // reason.cause is the Error object Request would pass into a callback.
                });
        });
    }

    public getModalData(itemID: string, accessToken: string) {
        console.log("getting modal data");
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                json: true,
                method: "GET",
                // uri: tracifiedURL + "/Traceability_data/otp/customer-app",
                uri: "https://tracified-mock-api.herokuapp.com/Traceability_data/ui/1005",

            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                resolve(data);
            }).catch(errors.StatusCodeError, (reason) => {
                console.log("inside pos catch1");
                console.log("reason response is :" + JSON.stringify(reason.response));
                console.log("reason error is :" + JSON.stringify(reason.error));
                console.log("reason options are :" + JSON.stringify(reason.options));
                reject(reason);

            }).catch(errors.RequestError, (reason) => {
                    console.log("inside pos catch2  " + reason.cause);
                    reject(Error(reason.cause));
                    // The request failed due to technical reasons.
                    // reason.cause is the Error object Request would pass into a callback.
                });
        });
    }

    public getProductArtifacts(itemID: string, accessToken: string) {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
                method: "GET",
                uri: tracifiedURL + "/Traceability_data/artifacts/" + itemID,
            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                resolve(data);
            }).catch((error) => {
                console.log(error);
            });
        });
    }
}
