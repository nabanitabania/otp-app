var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var sendotp=require("sendotp");
var sendOtp=new sendotp("288851AdWYGYurDi5d4c712e",'OTP for your order is {{otp}}, please do not share it with anybody'); 
var phnnumber;



mongoose.connect("mongodb://localhost/form_app",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// sendOtp.send(contactNumber, senderId, otp, callback); //otp is optional if not sent it'll be generated automatically
// sendOtp.retry(contactNumber, retryVoice, callback);
//sendOtp.verify(contactNumber, otpToVerify, callback);

var formSchema = mongoose.Schema({
	number: String,
	Created: {type: Date, default: Date.now()}
});

var form = mongoose.model("form", formSchema);

// form.create({
// 	number: "9678211331"
// })

app.get("/sent",function(req,res){
	form.find({},function(err,data){
		if(err)
			{
				console.log(err)
			}
		else
			{
				res.render("page");
			}
	});
});

app.get("/form",function(req,res){
	res.render("form");
});

app.post("/verifyform",function(req,res){
	
	 phnnumber= req.body.form["number"];

	
	form.create(req.body.form,function(err,data){
		if(err)
			{
				console.log(err);
			}
		else
			{				
				sendOtp.send(phnnumber, "biitan", function(error,data){
					
							console.log(data);
							res.render("verifyform");
						
				}); 
				
			}
	});		
				//otp is optional if not sent it'll be generated automatically
});

app.post("/success",function(req,res){
	
	var otp  = req.body.otp;
	console.log(otp);
	sendOtp.verify(phnnumber, otp, function (error, data) {
  console.log(data); // data object with keys 'message' and 'type'
  if(data.type == 'success') 
  {
	  console.log('OTP verified successfully');
	  res.render("success");
  }
  else
	  {
		  console.log("error");
		  res.render("fail");
	  }
});
})

//sendOtp.verify(contactNumber, otpToVerify, callback);
app.listen(9000,function(){
	console.log("serven started");
});



