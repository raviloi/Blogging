//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');



const homeStartingContent = "Daily Chronicles: Your canvas for daily expression. Unleash creativity, share stories, and connect through the power of daily blogging. Start writing!";
const aboutContent = "Ravi's Company pioneers bespoke websites for daily bloggers, transforming the digital landscape for storytellers. Our focus is on crafting dynamic, user-friendly platforms that seamlessly integrate with the daily rhythm of life. With a commitment to innovation, we blend cutting-edge design and robust features, ensuring a personalized and efficient blogging experience. From minimalist aesthetics to vibrant layouts, our websites reflect the unique personality of each blogger. Ravi's Company envisions these platforms not just as spaces for words but as catalysts for positive change, fostering connections and empowering individuals to share their stories with the world.";
const contactContent = "Connect with Ravi's Company and embark on your blogging journey today. Whether you're a seasoned writer or just starting, our team is here to turn your vision into a captivating digital presence. Reach out for personalized consultations, expert advice, and tailored solutions. We're passionate about bringing your daily blogs to life with innovative design and seamless functionality. Contact us via email at ravi_dreamz81@yahoo.co.in. Let's collaborate to create a dynamic website that amplifies your voice and engages your audience. Your story starts here, and we're eager to be a part of it.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://coltravi:StK29w2fHgsidSE2@cluster0.kuzhpg3.mongodb.net/blogDatabase');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/blogDatabase');` if your database has auth enabled
}

const blogSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Blog = mongoose.model('Blog', blogSchema);


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = [];

app.get("/", function(req, res){
  
  Blog.find({}).then(function(posts){
    res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
  });


  
  // res.render("home", {
  //   startingContent: homeStartingContent,
  //   posts: posts
  //   });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };

  // posts.push(post);
const post = new Blog(
    { title: req.body.postTitle,
      body:  req.body.postBody     
    });
  
  post.save();
  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Blog.findOne({_id: requestedPostId}).then(function(post){

    res.render("post", {
 
      title: post.title,
 
      content: post.body
    
    });
 
  });

});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

// Start the server at Port 3000
app.listen(port, function () {
  console.log("Server started successfully.");
});