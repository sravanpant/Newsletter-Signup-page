
// // API Key
// // b383a7d3b8be0653c2809f7ecec6664d-us10

// // List id
// // d4f623b2b5

const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get('/', function (req, res){
    res.sendFile(__dirname + "/signup.html");
})

mailchimp.setConfig({
    apiKey: "b383a7d3b8be0653c2809f7ecec6664d-us10",
    server: "us10",
});

app.post('/', function(req, res){

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const listId = "d4f623b2b5";

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    async function run(){
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            res.sendFile(__dirname + "/success.html");
            console.log(`Successfully created an audience. The audience id is ${response.id}.`);
        } catch (error){
            console.log(error);
            res.sendFile(__dirname + "/failure.html");
        }      

    };

    run();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
})