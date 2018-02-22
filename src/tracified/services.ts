import request = require("request-promise");
const tracifiedURL: string = "https://tracified-mock-api.herokuapp.com";

export interface IServices {
    verifyTracifiedAccount(tempToken: string, shopName: string): Promise<any>;
    getTracifiedItemList(accessToken: any): Promise<any>;
    getOrderItemTraceabilityData(orderID: string, itemID: string, accessToken: string): Promise<any>;
    getProductArtifacts(itemID: string, accessToken: string): Promise<any>;
    getModalData(itemID: string, accessToken: string): Promise<any>;
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
                method: "POST",
                uri: tracifiedURL + "/account/verify",
            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                console.log(type);
                console.log(data);
                resolve(data);
            });
        });
    }

    public getTracifiedItemList(accessToken: any) {
        return new Promise((resolve, reject) => {
            const options = {
                method: "GET",
                uri: tracifiedURL + "/traceability_data/Data/tracified_item_list/sort-list",
            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                console.log(type);
                console.log(data);
                resolve(data);
            });
        });
    }

    public getOrderItemTraceabilityData(orderID: string, itemID: string, accessToken: string) {
        return new Promise((resolve, reject) => {
            const options = {
                method: "GET",
                // uri: tracifiedURL + "/Traceability_data/otp/customer-app",
                uri: "http://www.mocky.io/v2/5a7688f02e000030006ab297",
            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                console.log(type);
                console.log(data);
                resolve(data);
            });
        });
    }

    public getModalData(itemID: string, accessToken: string) {
        return new Promise((resolve, reject) => {
            const options = {
                json: true,
                method: "GET",
                // uri: tracifiedURL + "/Traceability_data/otp/customer-app",
                uri: "https://tracified-mock-api.herokuapp.com/Traceability_data/ui/1005",

            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                resolve(data);
            });
        });
    }

    public getProductArtifacts(itemID: string, accessToken: string) {
        return new Promise((resolve, reject) => {
            const options = {
                method: "GET",
                uri: tracifiedURL + "/Traceability_data/artifacts/" + itemID,
            };

            request(options).then((data: any) => {
                const type: string = typeof data;
                console.log(type);
                console.log(data);
                resolve(data);
            });
        });
    }
}
