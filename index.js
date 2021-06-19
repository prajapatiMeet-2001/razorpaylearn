var express = require('express');
const Razorpay = require('razorpay');
const path = require('path');
const crypto = require("crypto");
require('dotenv').config();

var app = express();
app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

let rzp = new Razorpay({
  key_id: process.env.KEY_ID, // your `KEY_ID`
  key_secret: process.env.KEY_SECRET // your `KEY_SECRET`
})
var orderiD = ''

app.post('/orders',postOrder);
app.post('/paymentdetails',postdetails);
function postOrder(req,res) 
{
	orderObj = req.body;
	console.log(orderObj)
	//create order in database
	rzp.orders.create(orderObj, (err, order)=> 
	{
		if (err) 
			console.log(err)
	  	console.log(order);
	  	orderiD = order.id
	  	res.send(order)
	});
}
function postdetails(req,res)
{
	paydetails = req.body;
	console.log(orderiD)
	console.log(paydetails)
	const hmac = crypto.createHmac('sha256', process.env.KEY_SECRET);
	hmac.update(orderiD + "|" + paydetails.razorpay_payment_id);
	let generatedSignature = hmac.digest('hex');
	let isSignatureValid = generatedSignature == paydetails.razorpay_signature;

	if (isSignatureValid) 
		{
			//Payment Successful (update status in database)
			res.sendFile(path.join(__dirname+'/public/success.html'))
		} 
}

app.listen(3000,()=>console.log('Server Started'))

