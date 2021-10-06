const parse = require("csv-parse");
const fs = require("fs");
const path = require("path");
const launchesRouter = require("../routes/launches/launches.router");

const planets = require("./planets.mongo");

const results = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/* 
const promise = new Promise((resolve, reject) => {
    resolve(42);
});
promise.then((result) => {
    
});
const result = await promise;
 */

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    //using dirname is to locate current file directory!!!
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitable(data)) {
          //async
          //upsert = insert+update
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const count = (await getAllPlanets()).length;
        console.log(`${count} habitable planets found`);
        resolve();
      });
  });
}

//parse();
async function getAllPlanets() {
  return await planets.find({});
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      { upsert: true }
    );
  } catch (e) {
    console.error(`Cannot save planet ${e}`);
  }
}
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
