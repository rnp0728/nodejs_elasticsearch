require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const {
  insertAll,
  insertOne,
  search,
  deleteOne,
  updateOne,
} = require("./test-es");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Insert all test API
app.post("/api/test/bulk", async (req, res) => {
  try {
    const response = await insertAll(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert one solution API
app.post("/api/test", async (req, res) => {
  const { mongoId, data } = req.body;
  try {
    const response = await insertOne(mongoId, data);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search test API
app.get("/api/test/search", async (req, res) => {
  const { businessId, cardtype, query } = req.query;
  try {
    const response = await search(businessId, cardtype, query);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update one solution API
app.put("/api/test/:mongoId", async (req, res) => {
  const mongoId = req.params.mongoId;
  const newData = req.body;
  try {
    const response = await updateOne(mongoId, newData);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Remove one solution API
app.delete("/api/test/:mongoId", async (req, res) => {
  const mongoId = req.params.mongoId;
  try {
    const response = await deleteOne(mongoId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
