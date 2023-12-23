const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const storeRoute = require("./route/storeRoute");
const bookRoute = require("./route/bookRoute");
const userRoute = require("./route/userRoute");
const loginRoute = require("./route/loginRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Every thing is OK!");
});

app.use("/api/v1", storeRoute);
app.use("/api/v1", bookRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", loginRoute);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
