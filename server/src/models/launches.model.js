const launchesDatabase = require("./launches.mongo");
//Map == dictionary
const planets = require("./launches.mongo");
const launches = new Map();
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

launches.set(launch.flightNumber, launch);

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

function getRandom() {
  return Math.floor((Math.random() * 1000) / 7);
}

function existLaunch(id) {
  return launches.has(id);
}

// async function getLatestFlightNumber() {
//   try {
//     const latestLaunch = await launchesDatabase
//       .findOne({})
//       .sort("-flightNumber");
//     if (!latestLaunch) {
//       return 0;
//     }
//     print(`my number: ${latestLaunch.flightNumber}`);
//     return latestLaunch.flightNumber;
//   } catch (e) {
//     throw new Error(e.message);
//   }
// }

async function saveLaunch(launch) {
  try {
    const planet = await planets.findOne({
      keplerName: launch.target,
    });

    if (!planet) {
      throw new Error("No matching planet found!");
    }

    await launchesDatabase.updateOne(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
}
// function addNewLaunch(launch) {
//   latestFlightNumber++;

//   //add key-value pair
//   launches.set(
//     latestFlightNumber,

//     // add more property to an existing object
//     Object.assign(launch, {
//       flightNumber: latestFlightNumber,
//       customer: ["ZTM", "NASA"],
//       upcoming: true,
//       success: tru ,
//     })
//   );
// }

async function scheduleNewLaunch(launch) {
  try {
    console.log(launch);
    const latestFlightNumber = getRandom();
    console.log(latestFlightNumber);

    const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    });

    console.log("123432424");
    await saveLaunch(newLaunch);
  } catch (e) {
    throw new Error(e.message);
  }
}

function abortLaunchById(id) {
  const aborted = launches.get(id);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunch,
  abortLaunchById,
};
