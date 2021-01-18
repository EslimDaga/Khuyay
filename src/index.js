const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const morgan = require("morgan");

//Initialization
const app = express();
require("./database");

//Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs({
  defaultLayout : "main",
  layoutsDir : path.join(app.get("views"), "layouts"),
  partialsDir : path.join(app.get("views"), "partials"),
  extname : ".hbs",
  handlebars : allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", ".hbs");

//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended : false }));
app.use(methodOverride("_method"));
app.use(session({
  secret : "mysecretapp",
  resave : true,
  saveUninitialized : true
}));

//Routes
app.use(require("./routes/index"));
app.use(require("./routes/users"));
app.use("/notes", require("./routes/notes"));

//Static Files
app.use(express.static(path.join(__dirname, "public")));

//Server is starting
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});