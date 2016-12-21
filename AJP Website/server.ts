//#region Variables

const Categories: any = require("./Demo Data/PriceList.json").CATG;
//import Express = require("express");
import * as Express from "express";
let handlebars: any = require("express-handlebars"); // TODOL Add TypeScript Def files then replace with Imports *
const port: number = process.env.port || 1337;
const app: Express.Application = Express();


//#endregion

//#region Setup

let bodyParser = require("body-parser"); // required for POSTed form data
app.use(bodyParser.json());             // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({         // to support URL-encoded bodies
	extended: true
}));



app.engine(".hbs", handlebars({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./Views");
app.use(Express.static("./node_modules/bootstrap/dist/css"));
app.use(Express.static("./node_modules/jquery/dist"));

//#endregion

//#region Index
app.get("/", (req: any, res: any) => {
	res.render("Index");
});

app.get("/Products", (req: any, res: any) => {
	res.render("Products",
		{
			Categories: Categories.map(_ => _.Name),
			helpers: {
				escape: (text) => encodeURIComponent(text)
			}
		}
	);
});

app.get("/Category/:id", (req: any, res: any) => {
	const Name: any = req.params.id;
	const Category: any = Categories.find(_ => _.Name === Name);
	if (Category === undefined) {
		res.render("Error");
	}
	else {
		res.render("Category",
			{
				Category,
				helpers: {
					escape: (text) => encodeURIComponent(text)
				}
			}
		);
	}
});

app.get("/AboutUs", (req: any, res: any) => {
	res.render("AboutUs");
});

app.get("/Group/:id", (req: any, res: any) => {
	const ArrayOfGroups = Categories.map(_ => _.Group).filter(_ => _ !== undefined);
	const merged = [].concat.apply([], ArrayOfGroups);
	const Group = merged.find(_ => _.Name === req.params.id);
	const Category = Categories.filter(_ => _.Group !== undefined).find(_ => _.Group.indexOf(Group) !== -1);

	res.render("Group",
		{
			Group,
			CategoryName: Category.Name,
			helpers: {
				escape: (text) => encodeURIComponent(text)
			}
		}
	);
});

var nodemailer = require("nodemailer");

app.post("/RequestQuote", (req: any, res: any) => {
	var transporter: any = nodemailer.createTransport({
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
		} else {
			console.log("Message sent: " + info.response);
			res.json({ yo: info.response });
		};
	});
});

//#endregion



app.listen(port);