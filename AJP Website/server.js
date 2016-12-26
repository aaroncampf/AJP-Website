//#region Variables
"use strict";
const Categories = require("./Demo Data/PriceList.json").CATG;
//import Express = require("express");
const Express = require("express");
let handlebars = require("express-handlebars"); // TODOL Add TypeScript Def files then replace with Imports *
const port = process.env.port || 1337;
const app = Express();
//#endregion
//#region Setup
let bodyParser = require("body-parser"); // required for POSTed form data
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
app.get("/", (req, res) => {
    res.render("Index");
});
app.get("/Products", (req, res) => {
    res.render("Products", {
        Categories: Categories.map(_ => _.Name),
        helpers: {
            escape: (text) => encodeURIComponent(text)
        }
    });
});
app.get("/Category/:id", (req, res) => {
    const Name = req.params.id;
    const Category = Categories.find(_ => _.Name === Name);
    if (Category === undefined) {
        res.render("Error");
    }
    else {
        res.render("Category", {
            Category: Category,
            helpers: {
                escape: (text) => encodeURIComponent(text)
            }
        });
    }
});
app.get("/AboutUs", (req, res) => {
    res.render("AboutUs");
});
app.get("/Group/:id", (req, res) => {
    const ArrayOfGroups = Categories.map(_ => _.Group).filter(_ => _ !== undefined);
    const merged = [].concat.apply([], ArrayOfGroups);
    const Group = merged.find(_ => _.Name === req.params.id);
    const Category = Categories.filter(_ => _.Group !== undefined).find(_ => _.Group.indexOf(Group) !== -1);
    res.render("Group", {
        Group: Group,
        CategoryName: Category.Name,
        helpers: {
            escape: (text) => encodeURIComponent(text)
        }
    });
});
var nodemailer = require("nodemailer");
app.post("/RequestQuote", (req, res) => {
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
        html: `<p>Company: ${req.body.Company}</p>
			   <p>Contact: ${req.body.Contact}</p>
			   <p>Email: ${req.body.Email}</p>
			   <p>Phone: ${req.body.Phone}</p>
			   <p>Details: ${req.body.Details}</p>`
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
app.post("/SearchItems", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify({ a: 1 }));
    const Search = req.body.Search;
    let Results = [];
    for (let i = 0; i < Categories.length; i++) {
        let Groups = Categories[i].Group;
        if (Groups == null)
            continue;
        for (var a = 0; a < Groups.length; a++) {
            let Products = Groups[a].Product;
            if (Products == null)
                continue;
            for (var b = 0; b < Products.length; b++) {
                let Product = Products[b];
                if (Product.Name.includes(Search)) {
                    Results.push(Product);
                }
            }
        }
    }
    //res.send(JSON.stringify({ a: 1 }));
    res.send(JSON.stringify(Results));
});
//#endregion
app.listen(port);
//# sourceMappingURL=server.js.map