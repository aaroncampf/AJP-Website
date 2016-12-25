//TODO: Rebuild JSON data so items do not swap between arrays and objects :(
"use strict";
//#region Variables
var Categories = require("./Demo Data/PriceList.json").CATG;
//import Express = require("express");
var Express = require("express");
var handlebars = require("express-handlebars"); // TODOL Add TypeScript Def files then replace with Imports *
var port = process.env.port || 1337;
var app = Express();
//#endregion
//#region Setup
var bodyParser = require("body-parser"); // required for POSTed form data
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine(".hbs", handlebars({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./Views");
app.use(Express.static("./node_modules/bootstrap/dist/css"));
app.use(Express.static("./node_modules/jquery/dist"));
//#endregion
//#region Index
app.get("/", function (req, res) {
    res.render("Index");
});
app.get("/Products", function (req, res) {
    res.render("Products", {
        Categories: Categories.map(function (_) { return _.Name; }),
        helpers: {
            escape: function (text) { return encodeURIComponent(text); }
        }
    });
});
app.get("/Category/:id", function (req, res) {
    var Name = req.params.id;
    var Category = Categories.find(function (_) { return _.Name === Name; });
    if (Category === undefined) {
        res.render("Error");
    }
    else {
        res.render("Category", {
            Category: Category,
            helpers: {
                escape: function (text) { return encodeURIComponent(text); }
            }
        });
    }
});
app.get("/AboutUs", function (req, res) {
    res.render("AboutUs");
});
app.get("/Group/:id", function (req, res) {
    var ArrayOfGroups = Categories.map(function (_) { return _.Group; }).filter(function (_) { return _ !== undefined; });
    var merged = [].concat.apply([], ArrayOfGroups);
    var Group = merged.find(function (_) { return _.Name === req.params.id; });
    var Category = Categories.filter(function (_) { return _.Group !== undefined; }).find(function (_) { return _.Group.indexOf(Group) !== -1; });
    res.render("Group", {
        Group: Group,
        CategoryName: Category.Name,
        helpers: {
            escape: function (text) { return encodeURIComponent(text); }
        }
    });
});
var nodemailer = require("nodemailer");
app.post("/RequestQuote", function (req, res) {
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "aaroncampf@gmail.com",
            pass: "aaron2023"
        }
    });
    var mailOptions = {
        from: "aaroncampf@gmail.com",
        to: "aaroncampf@gmail.com",
        subject: "Request For Quote",
        html: "<p>Company: " + req.body.Company + "</p>\n\t\t\t   <p>Contact: " + req.body.Contact + "</p>\n\t\t\t   <p>Email: " + req.body.Email + "</p>\n\t\t\t   <p>Phone: " + req.body.Phone + "</p>\n\t\t\t   <p>Details: " + req.body.Details + "</p>"
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({ yo: "error" });
        }
        else {
            console.log("Message sent: " + info.response);
            res.json({ yo: info.response });
        }
        ;
    });
});
app.post("/SearchItems", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify({ a: 1 }));
    var Search = req.body.Search;
    var Results = [];
    for (var i = 0; i < Categories.length; i++) {
        var Groups = Categories[i].Group;
        if (Groups == null)
            continue;
        for (var a = 0; a < Groups.length; a++) {
            var Products = Groups[a].Product;
            if (Products == null)
                continue;
            if (Array.isArray(Products)) {
                for (var b = 0; b < Products.length; b++) {
                    var Product = Products[b];
                    if (Product.Name.includes(Search)) {
                        Results.push(Product);
                    }
                }
            }
            else if (Products.Name.includes(Search)) {
                Results.push(Products);
            }
        }
    }
    //res.send(JSON.stringify({ a: 1 }));
    res.send(JSON.stringify(Results));
});
//#endregion
app.listen(port);
//# sourceMappingURL=server.js.map