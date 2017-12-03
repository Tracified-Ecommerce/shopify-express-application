"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const session = require("client-sessions");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const generalRouter = require("./routes/index");
const shopifyRouter = require("./shopify/routes/index");
const woocommerceRouter = require("./woocommerce/routes/index");
/**
 * initial app config
 */
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * cookies set up with encryption
 */
app.use(session({
    cookieName: "session",
    secret: "7f3bc78eabe74bdca213aceb9cfcc1f4",
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));
/**
 * html rendering - if needed
 */
app.set("views", __dirname + "/views");
app.engine("html", ejs.renderFile);
/**
 * db connection
 * -Set up default mongoose connection
 */
const mongoDB = "mongodb://shopify:Tracified@ds251435.mlab.com:51435/shopify-db";
mongoose.connect(mongoDB, {
    useMongoClient: true,
});
/**
 * -Get the default connection
 */
const db = mongoose.connection;
/**
 * -Bind connection to error event (to get notification of connection errors)
 */
db.on("error", console.error.bind(console, "MongoDB connection error:"));
/**
 * routes and static files
 * -general routes
 */
app.use("/", generalRouter.router);
/**
 * -shopify routes and static files(JS, CSS) for UI
 */
app.use("/shopify", shopifyRouter.router);
app.use(express.static(path.resolve(__dirname, "./shopify/react-app/build")));
/**
 * -woocommerce routes -(sample routes)
 */
app.use("/woocommerce", woocommerceRouter.router);
/**
 * -404 route
 */
app.get("*", (req, res) => {
    return res.status(404).send("404 - Oops! Tracified-Ecommerce could not find that page");
});
app.listen(app.get("port"), () => {
    console.log("Example app listening on port " + app.get("port") + "!");
});
//# sourceMappingURL=index.js.map