const weatherAPIkey = "e31236ca2959caf5178b8298a93073e8"; // weather API key
const IQAirAPIkey = "3b7be9cf-cb62-4e05-b700-825f466ce4e1"; // IQAir API key

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

app.post("/weather", async (req, res) => {
  const city = req.body.city;
  const urls = [
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIkey}&units=metric`,
    `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIkey}&units=metric`,
  ];
  const [weatherResponse, forecastResponse] = await Promise.all(
    urls.map((url) => fetch(url))
  );

  const weatherData = await weatherResponse.json();
  const forecastData = await forecastResponse.json();

  console.log(weatherData);
  res.send({ weatherData, forecastData });
});
app.post("/randomImage", async (req, res) => {
  // Fetch a random image from the Unsplash API
  fetch("https://source.unsplash.com/random")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.url;
    })
    .then((imageUrl) => {
      res.send({ imageUrl });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      res.status(500).send({ error: "Internal server error" });
    });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
//
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
