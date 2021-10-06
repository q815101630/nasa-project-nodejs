const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunch,
  abortLaunchById,
} = require("../../models/launches.model");
async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  console.log(launch);
  try {
    if (
      !launch.mission ||
      !launch.rocket ||
      !launch.launchDate ||
      !launch.target
    ) {
      return res.status(400).json({ error: "Missing info" });
    }

    launch.launchDate = new Date(launch.launchDate);

    // launch.launchDate.toString() === "Invalid Date"
    if (isNaN(launch.launchDate)) {
      return res.status(400).json({ error: "Invalid date" });
    }
    console.log("Heasdjkasdhashdasdasre");
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  if (!existLaunch(launchId)) {
    return res.status(404).json({ error: "Launch not found" });
  } else {
    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
  }
}
module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
