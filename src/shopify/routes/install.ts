/* tslint:disable:no-shadowed-variable max-line-length no-var-requires */
import { Request, Response, Router } from "express";
import { Error } from "mongoose";
import * as configs from "../../appConfig";
import * as MainAssets from "../assets/shopifyAssets";
import * as DimensionAssets from "../assets/shopifyDimensionAssets";
import * as MapAssets from "../assets/shopifyMapAssets";
import * as SliderAssets from "../assets/shopifySliderAssets";
import * as Snippets from "../assets/shopifySnippets";
import { Helper, IHelper } from "../helpers/index";
import { Shop, ShopModel } from "../models/Shop";
const cookie = require("cookie");
const nonce = require("nonce")();
const helper: IHelper = new Helper();
const verifyQueryHMAC = helper.verifyQueryHMAC;
const shopAdminAPI = helper.shopAdminAPI;
const router = Router();

// installation route

const scopes = "read_products,write_products,write_themes,write_orders,read_orders";
const forwardingAddress = configs.shopifyConfigs.install.forwardingAddress;
const apiKey = configs.shopifyConfigs.install.apiKey;
const apiSecret = configs.shopifyConfigs.install.apiSecret;

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

// callback url on app installation
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

    shopAdminAPI("POST", shop, "/admin/oauth/access_token", null, accessTokenPayload, (accessTokenResponse: any) => {

      const accessToken = accessTokenResponse.access_token;
      Shop.findOne({ name: shop }, "name access_token",  (err: Error, installedShop: ShopModel) => {
        // to use if a shop record is alredy there
        if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
        if (installedShop) {
          installedShop.access_token = accessToken;
          installedShop.save(() => {
            if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
          });
        } else {
          const ShopInstance = new Shop({ name: shop, access_token: accessToken });
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

      // get the theme id for asset uploading
      shopAdminAPI("GET", shop, "/admin/themes.json", shopRequestHeaders, null, (parsedBody: any) => {

        let themeId;
        const themes = parsedBody.themes;
        for (const theme of themes) {
          if (theme.role === "main") {
            themeId = theme.id;
            console.log(themeId);
            break;
          }
        }
        console.log("theme_id");
        console.log(themeId);

        /**
         * asset uploading
         * -use this in the theme where trace details needed to be
         * dispalyed(ideally in product-template).{% include 'tracified' %}
         */
        const assetUploadURL = "/admin/themes/" + themeId + "/assets.json";

        const mainSnippetUploadPayload = {
          asset: {
            attachment: Snippets.tracifiedDotLiquid,
            key: "snippets\/tracified.liquid",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, mainSnippetUploadPayload, (parsedBody: any) => {
          console.log("main snippet uploaded");
          console.log(parsedBody);
        });

        const posSnippetUploadPayload = {
          asset: {
            attachment: Snippets.tracifiedPosDotLiquid,
            key: "snippets\/tracified-pos.liquid",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, posSnippetUploadPayload, (parsedBody: any) => {
          console.log("pos snippet uploaded");
          console.log(parsedBody);
        });

        const sliderSnippetUploadPayload = {
          asset: {
            attachment: Snippets.ImageSliderDotLiquid,
            key: "snippets\/tracified-imageSlider.liquid",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, sliderSnippetUploadPayload, (parsedBody: any) => {
          console.log("slider snippet uploaded");
          console.log(parsedBody);
        });

        const jsUploadPayload = {
          asset: {
            attachment: MainAssets.tracifiedDotJs,
            key: "assets\/tracified.js",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, jsUploadPayload, (parsedBody: any) => {
          console.log("tracifiedjs uploaded");
          console.log(parsedBody);
        });

        const MainCssUploadPayload = {
          asset: {
            attachment: MainAssets.tracifiedDotCss,
            key: "assets\/tracified.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, MainCssUploadPayload, (parsedBody: any) => {
          console.log("test.css uploaded");
          console.log(parsedBody);
        });

        const bootstrapcssUploadPayload = {
          asset: {
            attachment: MainAssets.bootstrapCss,
            key: "assets\/tracified_bootstrap.min.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, bootstrapcssUploadPayload, (parsedBody: any) => {
          console.log("bootstrapcss uploaded");
          console.log(parsedBody);
        });

        const bootstrapjsUploadPayload = {
          asset: {
            attachment: MainAssets.bootstrapJs,
            key: "assets\/tracified_bootstrap.min.js",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, bootstrapjsUploadPayload, (parsedBody: any) => {
          console.log("bootstrapjs uploaded");
          console.log(parsedBody);
        });

        const jqueryUploadPayload = {
          asset: {
            attachment: MainAssets.tracifiedJqueryDotJs,
            key: "assets\/tracified_jquery.min.js",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, jqueryUploadPayload, (parsedBody: any) => {
          console.log("tracified_jquery.min.js uploaded");
          console.log(parsedBody);
        });

        const posCssUploadPayload = {
          asset: {
            attachment: DimensionAssets.tracifiedPosSectionCss,
            key: "assets\/tracified-POS-section.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, posCssUploadPayload, (parsedBody: any) => {
          console.log("tracified-POS-section.css uploaded");
          console.log(parsedBody);
        });

        const leafletCssUploadPayload = {
          asset: {
            attachment: MapAssets.tracifiedLeafletCss,
            key: "assets\/tracified_leaflet.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, leafletCssUploadPayload, (parsedBody: any) => {
          console.log("tracified_leaflet.css uploaded");
          console.log(parsedBody);
        });

        const tabCssUploadPayload = {
          asset: {
            attachment: MapAssets.tracifiedTabCss,
            key: "assets\/tracified_tab.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, tabCssUploadPayload, (parsedBody: any) => {
          console.log("tracified_tab.css uploaded");
          console.log(parsedBody);
        });

        const LeafletJsUploadPayload = {
          asset: {
            attachment: MapAssets.tracifiedLeafletsJs,
            key: "assets\/tracified_leaflets.js",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, LeafletJsUploadPayload, (parsedBody: any) => {
          console.log("tracified_leaflets.js uploaded");
          console.log(parsedBody);
        });

        const TabJsUploadPayload = {
          asset: {
            attachment: MapAssets.tracifiedTabJs,
            key: "assets\/tracified_tab.js",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, TabJsUploadPayload, (parsedBody: any) => {
          console.log("tracified_tab.js uploaded");
          console.log(parsedBody);
        });

        const SliderCssUploadPayload = {
          asset: {
            attachment: SliderAssets.tracifiedImageSliderCss,
            key: "assets\/tracified-imageSlider.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, SliderCssUploadPayload, (parsedBody: any) => {
          console.log("tracified-imageSlider.css uploaded");
          console.log(parsedBody);
        });

        const mediaQueryCssUploadPayload = {
          asset: {
            attachment: SliderAssets.tracifiedMediaQueriesCss,
            key: "assets\/tracified-mediaQueries.css",
          },
        };
        shopAdminAPI("PUT", shop, assetUploadURL, shopRequestHeaders, mediaQueryCssUploadPayload, (parsedBody: any) => {
          console.log("tracified-mediaQueries.css uploaded");
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

      // register uninstallation webhook
      const uninstallWHPayload = {
        webhook: {
          address: forwardingAddress + "/shopify/webhook/uninstall-app",
          format: "json",
          topic: "app/uninstalled",
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
