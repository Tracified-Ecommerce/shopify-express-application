const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const apiKey = "7f3bc78eabe74bdca213aceb9cfcc1f4";
const apiSecret = "d3141aefd842b5857b2048a3a229f4c8";
const scopes = 'write_products,write_themes,write_orders';
//const forwardingAddress = "https://6c9cce84.ngrok.io"; // Replace this with your HTTPS Forwarding address
const forwardingAddress = "https://shopify-tracified.herokuapp.com";
var tokenSet = false;
var savedAT = '427b8f836a793b2a28c7aa83cd14f44d';

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://shopify:Tracified@ds251435.mlab.com:51435/shopify-db';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

var ShopSchema = new Schema({
  name: String,
  access_token: String
});

var ShopModel = mongoose.model('ShopModel', ShopSchema);

app.set('port', process.env.PORT || 3000);
//html rendering
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/about', function (req, res) {
  res.render('about.html');
});

app.get('/dbtest', function (req, res) {
  ShopModel.findOne({ 'name': '99xnsbm.myshopify.com' }, 'name access_token', function (err, shop) {
    if (err) return handleError(err);
    if (shop) {
      shop.name = "new name";
      shop.save(function () {
        if (err) return handleError(err);
        console.log("modified");
      });
      res.send(shop);
    }
    else { res.send("No results found"); }

  });
});

app.get('/trace', function (req, res) {
  res.send({
    'Order id': req.query.id,
    'Shop': req.query.shop,
    'Data': 'No Tracified Data Found'
  });
});


app.get('/', (req, res) => {
  res.send('Tracified - Shopify');
});

app.get('/shopify', (req, res) => {
  const shop = req.query.shop;
  if (shop) {

    ShopModel.findOne({ 'name': shop }, 'name access_token', function (err, dbshop) {
      if (err) return handleError(err);
      if (dbshop[access_token]) {
        res.status(200).send("Your shop has been authorized and token has been saved. Admin API can be accessed using the token ");
      }
      else {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = 'https://' + shop +
          '/admin/oauth/authorize?client_id=' + apiKey +
          '&scope=' + scopes +
          '&state=' + state +
          '&redirect_uri=' + redirectUri;

        res.cookie('state', state);
        res.redirect(installUrl);
      }

    });

  } else {

    return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
  
  }
});

app.get('/shopify/callback', (req, res) => {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) {
    return res.status(403).send('Request origin cannot be verified');
  }

  if (shop && hmac && code) {
    const map = Object.assign({}, req.query);
    delete map['signature'];
    delete map['hmac'];
    const message = querystring.stringify(map);
    const generatedHash = crypto
      .createHmac('sha256', apiSecret)
      .update(message)
      .digest('hex');

    if (generatedHash !== hmac) {
      return res.status(400).send('HMAC validation failed');
    }

    console.log("code");
    console.log(code);

    const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
    const accessTokenPayload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };



    request.post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;
        console.log('accessToken');
        console.log(accessToken);

        var ShopInstance = new ShopModel({ name: shop, access_token: accessToken });

        ShopInstance.save(function (err) {
          if (err) {
            console.log('db ERROR');
            console.log(err);
            return handleError(err);
          }
          console.log('document saved!');
          tokenSet = false;
        });


        const shopRequestUrl = 'https://' + shop + '/admin/orders.json';
        const shopRequestHeaders = {
          'X-Shopify-Access-Token': accessToken,
        };

        //asset uploading
        var options = {
          method: 'PUT',
          uri: 'https://99xnsbm.myshopify.com/admin/themes/4664033312/assets.json',
          headers: shopRequestHeaders,
          body: {
            "asset": {
              "key": "assets\/emputty.gif",
              "attachment": "R0lGODlhAQABAPABAP\/\/\/wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==\n"
            }
          },
          json: true // Automatically stringifies the body to JSON
        };
        // console.log(window.location.search);
        // res.render('about.html');
        request(options)
          .then(function (parsedBody) {
            res.render('about.html');
          })
          .catch(function (err) {
            return (err);
          });


        // res.redirect('https://c4f5c707.ngrok.io/');
        // request.get(shopRequestUrl, { headers: shopRequestHeaders })
        //   .then((shopResponse) => {
        //     res.end(shopResponse);
        //   })
        //   .catch((error) => {
        //     res.status(error.statusCode).send(error.error.error_description);
        //   });
        // TODO
        // Use access token to make API call to 'shop' endpoint
      })
      .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });
    // TODO
    // Validate request is from Shopify
    // Exchange temporary code for a permanent access token
    // Use access token to make API call to 'shop' endpoint
  } else {
    res.status(400).send('Required parameters missing');
  }
});

app.listen(app.get('port'), () => {
  console.log('Example app listening on port ' + app.get('port') + '!');
});
//https://6c9cce84.ngrok.io/shopify?shop=99xnsbm.myshopify.com
//c3c57e5c8ba4759631bb9769527a702f