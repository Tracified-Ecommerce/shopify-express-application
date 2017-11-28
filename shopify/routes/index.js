const express = require('express');
const router = express.Router(); 
const Shop = require('../models/Shop');
const shopAdminAPI = require('../helpers').shopAdminAPI;
const install = require('./install');
const webhook = require('./webhook');
const adminlink = require('./adminlink');
const shop = require('./shop');
const test = require('./test');

router.use('/install', install);
router.use('/webhook', webhook);
router.use('/adminlink', adminlink);
router.use('/shop', shop);
//shopify test routes
router.use('/test', test);

//index route
router.get('/', (req, res) => {
    //res.send('Tracified - Shopify- modularized');
    const shop = req.query.shop;
    if (shop) {
        const query = Object.keys(req.query).map((key) => `${key}=${req.query[key]}`).join('&');
        Shop.findOne({ 'name': shop }, 'name access_token', function (err, dbshop) {
            if (err) return handleError(err);
            if (dbshop && dbshop.access_token) {
                req.session.shop = dbshop;
                return res.redirect('/shopify/cookie-check');
            } else {
                return res.redirect(`/shopify/install/?${query}`);
            }
        });
    } else {
        return res.status(200).send('Shopify App Details and Tracified Details goes here');
    }
});

//cookie check and request handle route redirected from index route
router.get('/cookie-check', (req, res) => {
    if (req.session && req.session.shop) {
        //test shopifyAPI call
        console.log('cookie enbaled');
        // let shop = req.session.shop;
        // const shopRequestHeaders = {
        //     'X-Shopify-Access-Token': shop.access_token,
        // };
        // shopAdminAPI('GET', shop.name , '/admin/orders.json', shopRequestHeaders,null, function(orders){
        //     res.status(200).send(orders);                
        // });
        res.render('apis.html');
    } else {
        console.log('cookie disabled');
        res.send('cookie disabled, You need to enable browser cookie to use the plugin without interruptions. Please enable cookies and retry.');
    }
});



module.exports = router;