// required packages
const express = require("express");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const IntaSend = require("intasend-node");
const dotenv = require("dotenv");

dotenv.config();

// firebase admin
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// const serviceAccount = require("./NewFuegoCred.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();

// aws configuration
const aws = require("aws-sdk");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, S3 } = require("@aws-sdk/client-s3");
const { unsubscribe } = require("diagnostics_channel");

// aws setup parameters
const region = "af-south-1";
const bucketName = "fuegoxrelvetti";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
aws.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

// initialise s3
const s3 = new S3({
  region,

  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// generate image upload link
async function generateUrl() {
  let date = new Date();
  let id = parseInt(Math.random() * 10000000000);

  const imageName = `${id}${date.getTime()}.jpg`;

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 300, //ms
    ContentType: "image/jpeg",
  };
  const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(params), {
    expiresIn: 300,
  });
  return uploadUrl;
}

// static path
let staticPath = path.join(__dirname, "public");

// initialize express
const app = express();

// middlewares
app.use(express.static(staticPath));
app.use(express.json());

// routes
// home route
app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// signup route
app.get("/signup", (req, res) => {
  res.sendFile(path.join(staticPath, "signup.html"));
});

app.post("/signup", (req, res) => {
  let { name, email, number, password, notification } = req.body;

  //   form validation
  if (name === "" && email === "" && number === "" && password === "") {
    return res.json({ alert: "please fill out all the input fields" });
  } else if (name.length < 3) {
    return res.json({ alert: "name must be atleast 3 characters long" });
  } else if (!email.length) {
    return res.json({ alert: "please enter your email" });
  } else if (!Number(number) || number.length < 10) {
    return res.json({ alert: "invalid number, please enter a valid number" });
  } else if (password.length < 8) {
    return res.json({ alert: "password must be atleast 8 characters long" });
  }

  // storing users in the database
  db.collection("users")
    .doc(email)
    .get()
    .then((user) => {
      if (user.exists) {
        return res.json({ alert: "user already exists" });
      } else {
        // encrypt user's password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            req.body.password = hash;
            db.collection("users")
              .doc(email)
              .set(req.body)
              .then((data) => {
                res.json({
                  name: req.body.name,
                  email: req.body.email,
                  number: req.body.number,
                  seller: req.body.seller,
                });
              });
          });
        });
      }
    });
});

// login route
app.get("/login", (req, res) => {
  res.sendFile(path.join(staticPath, "login.html"));
});

app.post("/login", (req, res) => {
  let { email, password } = req.body;

  if (!email.length || !password.length) {
    return res.json({ alert: "fill in all input fields" });
  }

  db.collection("users")
    .doc(email)
    .get()
    .then((user) => {
      if (!user.exists) {
        // if email does not exist
        return res.json({ alert: "user does not exist, create an account" });
      } else {
        // Comparing to see if the users' password matches

        bcrypt.compare(password, user.data().password, (err, result) => {
          if (result) {
            let data = user.data();
            return res.json({
              name: data.name,
              email: data.email,
              number: data.number,
              seller: data.seller,
            });
          } else {
            return res.json({ alert: "password is incorrect, try again" });
          }
        });
      }
    });
});

// Shop page route
app.get("/shop", (req, res) => {
  res.sendFile(path.join(staticPath, "shop.html"));
});

// About us page route
app.get("/about", (req, res) => {
  res.sendFile(path.join(staticPath, "about.html"));
});

// Single product route
app.get("/product", (req, res) => {
  res.sendFile(path.join(staticPath, "product.html"));
});

// add-products-seller page
app.get("/seller", (req, res) => {
  res.sendFile(path.join(staticPath, "seller.html"));
});

app.post("/seller", (req, res) => {
  let { about, address, email } = req.body;

  if (!address.length || !about.length) {
    return res.json({ alert: "enter all required information" });
  } else {
    // update users seller status
    db.collection("sellers")
      .doc(email)
      .set(req.body)
      .then((data) => {
        db.collection("users")
          .doc(email)
          .update({
            seller: true,
          })
          .then((data) => {
            res.json(true);
          });
      });
  }
});

// Add Products Page route
app.get("/add-product", (req, res) => {
  res.sendFile(path.join(staticPath, "addProduct.html"));
});

app.get("/add-product/:id", (req, res) => {
  res.sendFile(path.join(staticPath, "addProduct.html"));
});

// getting the upload link
app.get("/s3url", (req, res) => {
  generateUrl().then((url) => res.json(url));
});

// adding products
app.post("/add-product", (req, res) => {
  let { name, des, images, sizes, productPrice, tags, email, id } = req.body;

  // validation
  if (!name.length) {
    return res.json({ alert: "enter product name" });
  } else if (!des.length) {
    return res.json({
      alert: "enter a detailed description about the product",
    });
  } else if (!images.length) {
    return res.json({ alert: "upload at least one product image" });
  } else if (!productPrice.length) {
    return res.json({ alert: "you must add pricing for your product" });
  } else if (!tags.length) {
    return res.json({
      alert: "enter a few tags to help when viewing your product in search",
    });
  }

  // adding products
  let docName =
    id == undefined
      ? `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}`
      : id;
  db.collection("products")
    .doc(docName)
    .set(req.body)
    .then((data) => {
      res.json({ product: name });
    })
    .catch((err) => {
      return res.json({ alert: "an error occured. Try again" });
    });
});

// get products
app.post("/get-products", (req, res) => {
  let { email, id, tag } = req.body;

  if (id) {
    docRef = db.collection("products").doc(id);
  } else if (tag) {
    docRef = db.collection("products").where("tags", "array-contains", tag);
  } else {
    docRef = db.collection("products").where("email", "==", email);
  }

  docRef.get().then((products) => {
    if (products.empty) {
      return res.json("no products");
    }
    let productArr = [];
    if (id) {
      return res.json(products.data());
    } else {
      products.forEach((item) => {
        let data = item.data();
        data.id = item.id;
        productArr.push(data);
      });
      res.json(productArr);
    }
  });
});

app.post("/delete-product", (req, res) => {
  let { id } = req.body;

  db.collection("products")
    .doc(id)
    .delete()
    .then((data) => {
      res.json("success");
    })
    .catch((err) => {
      res.json("err");
    });
});

// product page
app.get("/products/:id", (req, res) => {
  res.sendFile(path.join(staticPath, "product.html"));
});

// search page
app.get("/search/:key", (req, res) => {
  res.sendFile(path.join(staticPath, "search.html"));
});

// Contact page
app.get("/contact", (req, res) => {
  res.sendFile(path.join(staticPath, "contact.html"));
});

app.post("/formData", (req, res) => {
  const formData = req.body;
  const { name, email, reason, message } = formData;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL_EMAIL,
    subject: `Message from Fuego Contact Form : ${reason}`,
    text: `Name: ${name}\nEmail: ${email}\nReason: ${reason}\nMessage: ${message}`,
    replyTo: email,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.send("error");
    } else {
      console.log("Email sent successfully");
      res.status(200).send("Email sent successfully");
    }
  });
});

// Cart page
app.get("/cart", (req, res) => {
  res.sendFile(path.join(staticPath, "cart.html"));
});

// Checkout page
app.get("/checkout", (req, res) => {
  res.sendFile(path.join(staticPath, "checkout.html"));
});

// Intasend payment gateway
const isProduction = process.env.NODE_ENV === "production";

const PUBLISHABLE_KEY = isProduction
  ? process.env.INTASEND_PUBLISHABLE_KEY
  : process.env.INTASEND_TEST_PUBLISHABLE_KEY;

const SECRET_KEY = isProduction
  ? process.env.INTASEND_SECRET_KEY
  : process.env.INTASEND_TEST_SECRET_KEY;

const DOMAIN = isProduction ? process.env.DOMAIN : process.env.TEST_DOMAIN;

let intasend = new IntaSend(
  (publishable_key = PUBLISHABLE_KEY),
  (secret_key = SECRET_KEY),
  (test_mode = !isProduction) //true in development, false in production
);

let apiRef = Math.floor(Math.random() * 92834);

app.post("/intasend-checkout", async (req, res) => {
  try {
    let collection = await intasend.collection();
    const chargeResult = await collection.charge({
      first_name: req.body.first_name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      api_ref: `FXR-${apiRef}`,
      country: "KE",
      address: req.body.address,
      city: req.body.city,
      zipcode: req.body.zipcode,
      amount: req.body.amount,
      host: `${DOMAIN}`,
      redirect_url: `${DOMAIN}/success`,
      currency: "KES",
    });

    // successfull response
    const url = chargeResult.url;
    res.status(200).json({ url });
  } catch (error) {
    console.error(`Charge Error: ${error}`);
    res.status({ alert: "Payment process failed" });
  }
});

app.get("/success", async (req, res) => {
  let { checkout_id, tracking_id } = req.query;

  try {
    let collection = await intasend.collection();
    const statusResult = await collection.status(tracking_id);

    const session = await checkout_id;
    const customer = await statusResult.meta.customer;
    const email = await statusResult.meta.customer.email;
    const name =
      await `${statusResult.meta.customer.first_name} ${statusResult.meta.customer.last_name}`;

    // Getting the date
    let date = new Date();

    let currentTime = new Date(date.getTime());

    // Extract the date components (day, month, year)
    let day = currentTime.getDate().toString().padStart(2, "0");
    let month = (currentTime.getMonth() + 1).toString().padStart(2, "0");
    let year = currentTime.getFullYear().toString();

    // Format the date
    let formattedDate = `${day}-${month}-${year}`;

    // Have an email get sent to user to inform order being sent
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAIL_EMAIL,
      to: email,
      subject: "Fuego X Relvetti : Order Placed",
      html: `
        <!DOCTYPE html>
        <html lang="en">

            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
            </head>

            <body style="margin: 0; padding: 0; text-align: center; background: #040303;">

                <img src="https://fuegoxrelvetti.s3.af-south-1.amazonaws.com/Fuego-R-Star-Logo+(1).png" alt="Fuego X Relvetti Logo" class="logo" style="display: block; margin: 0 auto 50px; max-width: 200px; padding-top: 20px;" />

                <div class="email-container" style="margin: 0 20px; padding: 20px; height: 50vh; display: block; ">

                    <h2 style="text-transform: uppercase; color: #f5f5f5; font-size: 35px; font-weight: 700; font-family: 'Nunito', sans-serif;">Order Confirmation - Order ID: ${tracking_id}</h2>

                    <p style="font-size: 18px; color: #f5f5f5; font-family: 'Playfair Display', serif;">Dear <span style="color: #f26700; font-weight: 500; text-transform: capitalize;">${name}</span></p>

                    <p style="color: #f5f5f5;">This is an order confirmation email for an order placed on ${formattedDate}</p>
                    <p style="color: #f5f5f5;">We are currently processing your order and will keep you updated on its status</p>
                    <p style="color: #f5f5f5;">If you have any questions feel free to contact us at <a href="tel:0704217069" style="color: #f26700;">0704217069</a> or via email at <a href="mailto:fuegoxrelvetti@gmail.com" style="color: #f26700;">fuegoxrelvetti@gmail.com</a></p>
                    <p style="color: #f5f5f5;">Thank you for choosing Fuego X Relvetti. We value your business and look forward to serving you again soon</p>
                </div>

                <div class="footer" style="margin: 0 20px; padding: 20px 0;  opacity: 0.8; font-size: 12px; border-radius: 8px;">
                    <p style="color: #f5f5f5;">All rights reserved @2023 Fuego X Relvetti | <a href="www.fxrnation.co.ke" style="color: #f26700;">www.fxrnation.co.ke</a></p>
                </div>

            </body>

        </html>

        `,
    };
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        // res.json({ 'alert': "oops! seems like an error occurred. Please try again" })
        console.log("An error occurred sending the mail");
      } else {
        // res.json({ 'alert': "your order has been placed" })
        console.log("Order email placed");
      }
    });
  } catch (err) {
    console.error(`Status Resp error:`, err);
  }

  res.sendFile(path.join(staticPath, "success.html"));
});

app.post("/order", async (req, res) => {
  const { order, email, address, name, number } = req.body;

  // Getting Date and Time
  let date = new Date();

  let currentTime = new Date(date.getTime());

  // Extract the date components (day, month, year)
  let day = currentTime.getDate().toString().padStart(2, "0");
  let month = (currentTime.getMonth() + 1).toString().padStart(2, "0");
  let year = currentTime.getFullYear().toString();

  // Extract the time components (hours, minutes, seconds)
  let hours = currentTime.getHours().toString().padStart(2, "0");
  let minutes = currentTime.getMinutes().toString().padStart(2, "0");
  let seconds = currentTime.getSeconds().toString().padStart(2, "0");

  // Format the date and time
  let formattedDate = `${day}-${month}-${year}`;
  let formattedTime = `${hours}:${minutes}:${seconds}`;

  try {
    let orderNumber = Math.floor(Math.random() * 12371928773392);

    let docName = `${email}-order-${orderNumber}`;
    db.collection("orders")
      .doc(docName)
      .set(req.body)
      .then((data) => {
        // Owners Order Email Confirmation
        const orderItems = order
          .map(
            (item) => `
                   <table width="90%" cellpadding="0" cellspacing="0" border="0"
                        style="width: 90%; height: 85px; margin-bottom: 35px;">
                        <tr>
                            <td style="vertical-align: middle;">
                                <img src="${item.image}" alt="FXR Product Image"
                                    class="sm-product-img" />
                            </td>
                            <td style="vertical-align: middle;">
                                <div class="sm-text">
                                    <p class="sm-product-name">${item.name}</p>
                                    <p class="sm-size">Size: <span style="color: #f26700;">${item.size}</span></p>
                                </div>
                            </td>
                            <td style="vertical-align: middle;">
                                <div class="quantity">
                                    <p class="item-count">${item.item}x</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                `
          )
          .join("");

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.MAIL_EMAIL,
            pass: process.env.MAIL_PASSWORD,
          },
        });

        let mailOptions = {
          from: process.env.MAIL_EMAIL,
          to: process.env.MAIL_EMAIL,
          subject: `A New Order Has Been Placed`,
          html: `
                        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #040303;
            color: #f5f5f5;
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            display: block;
            margin: 30px auto 60px;
            min-height: auto;
        }

        .heading {
            text-align: center;
            margin: 0 auto;
            font-size: 30px;
            width: 50%;
            display: block;
            line-height: 50px;
            text-transform: capitalize;
        }

        .heading span {
            font-weight: 300;
        }

        .customer-order,
        .order-details {
            margin-top: 5%;
            min-width: 700px;
            padding: 10px 20px;
        }

        .customer-order h2 {
            font-weight: 500;
        }

        /* Order details */
        .product-list,
        .details {
            width: 100%;
            padding-right: 30px;
        }

        .details h4 {
            margin: 15px 0;
            color: #f26700;
        }

        .details h4 span {
            color: #040303;
        }

        .orders {
            width: 100%;
            padding: 20px;
            margin-bottom: 35px;
        }


        .sm-product-img {
            height: 70px;
            width: 70px;
            object-fit: cover;
            border-radius: 5px;
        }

        .sm-product-name {
            font-size: 17px;
            font-weight: 300;
            font-family: var(--heading);
            text-transform: capitalize;
            color: #040303;
            margin: 15px 0 10px;
        }

        .sm-size {
            color: #040303;
            opacity: 0.6;
            font-family: var(--heading);
        }

        .sm-size span {
            color: var(--secondary-color);
            font-weight: 500;
            text-transform: uppercase;
        }


        .item-count {
            height: 30px;
            text-align: center;
            color: #040303;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1 class="heading">
            <span>You have received a new order from</span>, ${name}
        </h1>

        <div class="order-details">
            <h2 style="margin-bottom: 20px;">Order Details</h2>
            <div class="details">
                <h4>Customer Number: <span style="font-weight: lighter;">${number}</span></h4>
                <h4>Customer Email: <span style="font-weight: lighter;">${email}</span></h4>
                <h4>Order Date: <span style="font-weight: lighter;">${formattedDate}</span></h4>
                <h4>Order Time: <span style="font-weight: lighter;">${formattedTime}</span></h4>
                <h4>Customer Address: <span style="font-weight: lighter;">
                        <div class="address-details">
                            ${address.address},<br>
                            ${address.city},<br>
                            Delivery Zone: [${address.delivery}],<br>
                            ${address.postcode}
                        </div>
                    </span>
                </h4>
                 <h4>Delivery Message: <span style="font-weight: lighter;">${address.deliveryMessage}</span>
                </h4>
            </div>
        </div>

        <div class="customer-order">
            <h2>Item(s) Ordered</h2>
            <div class="product-list">

                <div class="orders">
                  ${orderItems}
                </div>
            </div>
        </div>
    </div>

</body>

</html>
                    `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Owner email sent successfully");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.redirect("/404");
  }
});

// Terms and conditions page
app.get("/terms-and-conditions", (req, res) => {
  res.sendFile(path.join(staticPath, "term_cond.html"));
});

// 404 error route
app.get("/404", (req, res) => {
  res.sendFile(path.join(staticPath, "404.html"));
});

app.use((req, res) => {
  res.redirect("/404");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
