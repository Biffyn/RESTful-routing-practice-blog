var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
// ***App Config**

app.set("view engine", "ejs");    
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/blog_app");

// ***Mongoose Schema/Model Config***

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// ***ROUTES***

// root
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX - show all blogs

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs}); 
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Blog Server Is Running");
});