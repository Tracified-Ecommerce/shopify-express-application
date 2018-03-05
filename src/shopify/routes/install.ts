import { Request, Response, Router } from "express";
import { Error } from "mongoose";
import * as Assets from "../assets/shopifyAssets";
import * as Snippets from "../assets/shopifySnippets";
import { Helper, IHelper } from "../helpers/index";
import { Shop, ShopModel } from "../models/Shop";
const cookie = require("cookie");
const nonce = require("nonce")();
const querystring = require("querystring");
const request = require("request-promise");
// const verifyQueryHMAC = require("../helpers/index").verifyQueryHMAC;
// const shopAdminAPI = require("../helpers/index").shopAdminAPI;
const helper: IHelper = new Helper();
const verifyQueryHMAC = helper.verifyQueryHMAC;
const shopAdminAPI = helper.shopAdminAPI;
const router = Router();
const scopes = "read_products,write_products,write_themes,write_orders,read_orders";
const forwardingAddress = "https://tracified-api-test.herokuapp.com";
const apiKey = "8cbed825a1a05c935cbb12574bb24257";
const apiSecret = "4bc97ed0ae56f7e75f2560f7816fd96a";

//installation route
router.get("/", (req: Request, res: Response) => {
  const shop = req.query.shop;
  if (shop) {
    const state = nonce();
    const redirectUri = forwardingAddress + "/shopify/install/callback";
    const installUrl = "https://" + shop +
      "/admin/oauth/authorize?client_id=" + apiKey +
      "&scope=" + scopes +
      "&state=" + state +
      "&redirect_uri=" + redirectUri;

    res.cookie("state", state);
    res.redirect(installUrl);
  } else {
    return res.status(400).send("Missing shop parameter. Please add ?shop=your-shop.myshopify.com to your request");
  }
});

//callback url on app installation
router.get("/callback", (req: Request, res: Response) => {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) {
    return res.status(403).send("Request origin cannot be verified");
  }

  if (shop && hmac && code) {
    if (!verifyQueryHMAC(req.query, apiSecret)) {
      return res.status(400).send("HMAC validation failed");
    }
    const accessTokenPayload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };

    shopAdminAPI("POST", shop, "/admin/oauth/access_token", null, accessTokenPayload, function(accessTokenResponse: any) {

      const accessToken = accessTokenResponse.access_token;
      Shop.findOne({ name: shop }, "name access_token", function(err: Error, installedShop: ShopModel) { //to use if a shop record is alredy there
        if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
        if (installedShop) {
          installedShop.access_token = accessToken;
          installedShop.save(function() {
            if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
          });
        } else {
          let ShopInstance = new Shop({ name: shop, access_token: accessToken });
          ShopInstance.save((err: Error) => {
            if (err) {
              if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
            }
          });
        }
      });

      const shopRequestHeaders = {
        "X-Shopify-Access-Token": accessToken,
      };

      //get the theme id for asset uploading
      shopAdminAPI("GET", shop, "/admin/themes.json", shopRequestHeaders, null, (parsedBody: any) => {

        let theme_id;
        let themes = parsedBody.themes;
        for (let i = 0; i < themes.length; i++) {
          if (themes[i].role == "main") {
            theme_id = themes[i].id;
            console.log(theme_id);
            break;
          }
        }
        console.log("theme_id");
        console.log(theme_id);

        /**
         * asset uploading
         * -use this in the theme where trace details needed to be 
         * dispalyed(ideally in product-template).{% include 'tracified' %}
         */
        const assetUploadURL = "/admin/themes/" + theme_id + "/assets.json";

        const snippetUploadPayload = {
          asset: {
            attachment: Snippets.tracifiedDotLiquid,
            key: "snippets\/tracified.liquid",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, snippetUploadPayload, (parsedBody: any) => {
          console.log("snippet uploaded");
          console.log(parsedBody);
        });

        const jsUploadPayload = {
          asset: {
            attachment: Assets.tracifiedDotJs,
            key: "assets\/tracified.js",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, jsUploadPayload, (parsedBody: any) => {
          console.log("js uploaded");
          console.log(parsedBody);
        });

        const cssUploadPayload = {
          asset: {
            attachment: Assets.testDotCss,
            key: "assets\/test.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, cssUploadPayload, (parsedBody: any) => {
          console.log("css uploaded");
          console.log(parsedBody);
        });

        const bootstrapcssUploadPayload = {
          asset: {
            attachment: Assets.bootstrapCss,
            key: "assets\/tracified_bootstrap.min.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, bootstrapcssUploadPayload, (parsedBody: any) => {
          console.log("bootstrapcss uploaded");
          console.log(parsedBody);
        });

        const bootstrapjsUploadPayload = {
          asset: {
            attachment: Assets.bootstrapJs,
            key: "assets\/tracified_bootstrap.min.js",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, bootstrapjsUploadPayload, (parsedBody: any) => {
          console.log("bootstrapjs uploaded");
          console.log(parsedBody);
        });

        const jqueryUploadPayload = {
          asset: {
            attachment: Assets.tracifiedJqueryDotJs,
            key: "assets\/tracified_jquery.min.js",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, jqueryUploadPayload, (parsedBody: any) => {
          console.log("jquery uploaded");
          console.log(parsedBody);
        });

        // const mdbUploadPayload = {
        //   asset: {
        //     key: "assets\/tracified_mdb.min.css",
        //     attachment: "",
        //   },
        // };
        // shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, mdbUploadPayload, (parsedBody: any) => {
        //   console.log("mdb uploaded");
        //   console.log(parsedBody);
        // });

        // const logoUploadPayload = {
        //   asset: {
        //     key: "assets\/tracified-logo.png",
        //     attachment: "",
        //   },
        // };
        // shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, mdbUploadPayload, (parsedBody: any) => {
        //   console.log("logo uploaded");
        //   console.log(parsedBody);
        // });

      });

      //register uninstallation webhook
      const uninstallWHPayload = {
        webhook: {
          topic: "app/uninstalled",
          address: forwardingAddress + "/shopify/webhook/uninstall-app",
          format: "json",
        },
      };
      shopAdminAPI("POST", shop, "/admin/webhooks.json", shopRequestHeaders, uninstallWHPayload, (parsedBody: any) => {
        console.log("uninstall webhook registered");
      });
      res.redirect("https://" + shop + "/admin/apps");
    });

  } else {
    res.status(400).send("Required parameters missing");
  }
});

export { router };
