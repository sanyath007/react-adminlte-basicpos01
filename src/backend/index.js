require('dotenv').config({ path: __dirname + "/.env" });

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs-extra');
const jsonwebtoken = require('jsonwebtoken');
const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail');

require('./db');
const Users = require('./models/user_schema');
const jwt = require('./jwt');

const app = express();

app.use(express.static(__dirname + "/uploaded"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

sgMail.setApiKey(
  "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"
);

app.post('/register', async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);

    // const { first_name, last_name, email } = req.body;
    // const token = jsonwebtoken.sign(
    //   { first_name, last_name, email },
    //   "process.env.JWT_ACCOUNT_ACTIVATION",
    //   { expiresIn: "365d" }
    // );
    // const emailData = {
    //   from: "admin@basicpos.io",
    //   to: email,
    //   subject: `Account activation link`,
    //   html: `
    //     <h1>Please use the following link to activate your account</h1>
    //     <p><a href="localhost:8080/activation/${token}">Activation link</p>
    //     <hr />
    //     <p>This email may contain sensetive information</p>
    //     <p>and link will  expired in 365 days</p>
    //   `
    // };

    // req.body.activated_token = token;

    let user = await Users.create(req.body);

    res.json({ result: "success", message: "Register successfully" });
    // sgMail.send(emailData)
    //   .then(sent => {
    //     return res.json({
    //       result: "success",
    //       message: `Email has been sent to ${email}. Follow the instruction to activate your account`
    //     });
    //   })
    //   .catch(err => {
    //     return res.json({
    //       result: "error",
    //       message: err.message
    //     });
    //   });
  } catch(err) {
    res.json({ result: 'error', message: err.errmsg });
  }
})

const port = 8080;

app.listen(port, () => {
  console.log("Server is running... on port " + port);
});
