const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://q815101630:q499820967@cluster0.ddja3.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

//mongoose.connection is a event emitter
// which emits event when some event happens

// event listener
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData(); //do async pre-requisite before running server

  server.listen(PORT, () => {
    console.log(`Listenting to ${PORT}`);
  });
}

startServer();
