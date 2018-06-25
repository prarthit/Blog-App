var express = require("express"),
	app = express(),
	expressSanitizer = require("express-sanitizer"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_app");

// APP CONFIG
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema)

// RESTFUL ROUTES
app.get("/", function(req,res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index.ejs", {blogs: blogs});
		}
	})
});

// NEW ROUTE
app.get("/blogs/new", function(req,res){
	res.render("new.ejs");
});

// CREATE ROUTE
app.post("/blogs", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err,newBlog){
		if(err){
			res.render("new.ejs")
		}
		else{
			res.redirect("/blogs");
		}
	})
});

// SHOW ROUTE
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show.ejs", {blog: foundBlog});
		}
	})
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit.ejs",{item: foundBlog});
		}
	})
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,foundBlog){
		res.redirect("/blogs");
	})
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
       } else {
           blog.remove();
           res.redirect("/blogs");
       }
   }); 
});

app.listen(3000,function(){
	console.log("Blog app server running!");
});