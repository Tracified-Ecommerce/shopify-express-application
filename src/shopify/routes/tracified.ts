import { NextFunction, Request, Response, Router } from "express";
import * as tracifiedServices from "../../tracified/services";
const router = Router();

router.all("/*", (req: Request, res: Response, next: NextFunction) => {
    if (req["session"] && req["session"].shop) {
        next();
    } else {
        console.log("cookies not found");
        res.send("cookies not found, Please try re-openning the app.");
    }
});

router.get("/item-list", (req: Request, res: Response) => {
    tracifiedServices["getTracifiedItemList"]("token").then((data: any) => {
        console.log(data);
        res.send(data);
    });
});

export { router };