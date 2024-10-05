const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const PORT = 3001;
const REVIEWS_FILE = path.join(__dirname, "reviews.json");

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/api/reviews" && req.method === "GET") {
    try {
      const data = await fs.readFile(REVIEWS_FILE, "utf8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify([]));
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error reading reviews" }));
      }
    }
  } else if (req.url === "/api/reviews" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const newReview = JSON.parse(body);
        let reviews = [];
        try {
          const data = await fs.readFile(REVIEWS_FILE, "utf8");
          reviews = JSON.parse(data);
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
        reviews.push(newReview);
        await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newReview));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error saving review" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
