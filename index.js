const weatherAPIkey = "e31236ca2959caf5178b8298a93073e8";
const yandexMapAPIkey = "51c0bddc-7a68-44a3-9392-80d80e716549";

import express from "express";
import path from "path";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.post("/weather", async (req, res) => {
  const city = req.body.city;

  let urls = [
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIkey}&units=metric`,
    `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIkey}&units=metric`,
  ];

  if (city.trim() === "") {
    console.error("City name is empty");
    return;
  }
  try {
    let requests = urls.map((url) => fetch(url));

    const responses = await Promise.all(requests);
    const data = await Promise.all(
      responses.map(async (response) => {
        const jsonData = await response.json();
        if (response.ok) {
          return jsonData;
        } else {
          throw new Error(jsonData.message || "Error fetching data");
        }
      })
    );

    if (data[0] && data[1]) {
      res.send({
        weather: data[0],
        forecast: data[1],
      });
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    res.send({
      error: error.message,
    });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
