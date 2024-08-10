const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// const allowOrigins = ['http://localhost:3000','https://62aa1f25e3e65a612b257a02--extraordinary-mermaid-710456.netlify.app' /** other domains if any */ ]
// const corsOptions = {
//   credentials: true,
//   origin: function(origin, callback) {
//     if (allowOrigins.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.use(cors(corsOptions));
// app.use(function (req, res, next) {   
//     res.setHeader('Access-Control-Allow-Origin', ['http://localhost:3000','https://62aa1f25e3e65a612b257a02--extraordinary-mermaid-710456.netlify.app']);    
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
//      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');   
//     res.setHeader('Access-Control-Allow-Credentials', true);    
//     next();
// });
//adding cors
app.use(cors({
    origin: 'https://master--dynamic-mousse-172f8b.netlify.app',
    credentials: true
})); 

app.use(cookieParser());
app.use(express.json());
app.use("/api", router);
app.get("/", (req, res) => {
    res.send("Hello World");
}
);
const port = process.env.PORT || 5001;


mongoose
    .connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("db Connected"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});

 