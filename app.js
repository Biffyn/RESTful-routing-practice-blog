var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override");
    
// ***App Config***

app.set("view engine", "ejs");    
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
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

// NEW - show form to create new post
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// CREATE - 

app.post("/blogs", function(req, res){
   // create blog
   Blog.create(req.body.blog, function(err, newBlog){
       if (err) {
           console.log(err);
           res.render("new");
       } else {
           // redirect
           res.redirect("/blogs");
       }
   });
});

// SHOW

app.get("/blogs/:id", function(req, res) {
    // find blog
    Blog.findById(req.params.id, function (err, foundBlog){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function (err, foundBlog){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE

app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else {
              //redirect somewhere 
           res.redirect("/blogs");
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Blog Server Is Running");
});