const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "China Tiangong",
    rocket: "DF15",
    target: "moon",
    launchDate: "March 15, 2030",
  };

  const withoutLaunchDate = {
    mission: "China Tiangong",
    rocket: "DF15",
    target: "moon",
    };
    
    const LaunchInvalidDate = {
        mission: "China Tiangong",
        rocket: "DF15",
        target: "moon",
        launchDate: "Maasdasdrch 15, 2030",
      };

  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);
    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(withoutLaunchDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(withoutLaunchDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({ error: "Missing info" });
  });
    test("It should catch invalid dates", async () => {
        const response = await request(app)
        .post("/launches")
        .send(LaunchInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({ error: "Invalid date" });
    });
  });
