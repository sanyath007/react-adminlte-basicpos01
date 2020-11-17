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
  process.env.SENDGRID_API_KEY
);
// "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"

app.post('/login', async (req, res) => {
  let doc = await Users.findOne({ username: req.body.username });

  if(doc) {
    if(bcrypt.compareSync(req.body.password, doc.password)) {
      if(doc.status !== 'not_activated') {
        const payload = {
          id: doc._id,
          level: doc.level,
          username: doc.username
        };

        let token = jwt.sign(payload);
  
        res.json({ result: 'success', token, message: 'login successfully!!'});
      } else {
        return res.json({
          result: 'error',
          message: 'Your need to activate account first!!'
        });
      }
    } else {
      res.json({ result: 'error', message: 'Invalid password!!'});
    }
  } else {
    res.json({ result: 'error', message: 'Invalid username!!'});
  }
});

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
});

app.get('/profile/id/:id', async (req, res) => {
  let doc = await Users.findOne({ _id: req.params.id });

  res.json(doc);
});

app.put('/profile', async (req, res) => {
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      let doc = await Users.findByIdAndUpdate({ _id: fields.id }, fields);
      await uploadImage(files, fields);

      res.json({ result: 'success', message: 'Update Successfully!!' })
    })
  } catch (error) {
    res.json({ result: 'error', message: error.errmsg })
  }
});

uploadImage = async (files, doc) => {
  if(files.avatars != null) {
    var fileExtension = files.avatars.name.split(".").pop();
    doc.avatars = `${Date.now()}+${doc.username}.${fileExtension}`;
    var newpath = path.resolve(__dirname + '/uploaded/images/') + "/" + doc.avatars;
    console.log(newpath);
    
    if(fs.exists(newpath)) {
      await fs.remove(newpath);
    }

    await fs.move(files.avatars.path, newpath);

    await Users.findOneAndUpdate({ _id: doc.id }, doc);
  }
};

const port = 8080;

app.listen(port, () => {
  console.log("Server is running... on port " + port);
});
