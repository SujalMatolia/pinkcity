const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
app.use(bodyParser.json());

//azhm3fTfqSKWHfZM
// Database connection
mongoose
  .connect(
    "mongodb+srv://matoliasujal:azhm3fTfqSKWHfZM@cluster0.tq5mxpo.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/number", (req, res) => {
  res.sendFile(path.join(__dirname, "num.html"));
});

// APIs
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "pinkcitycom" && password === "3en9fusif923") {
    // Authentication successful
    res.status(200).json({ message: "Login successful" });
  } else {
    // Authentication failed
    res.status(401).json({ message: "Invalid credentials" });
  }
});
const numberSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const NumberModel = mongoose.model("Number", numberSchema);

app.post("/submitnumber", (req, res) => {
  const { number } = req.body;

  const newNumber = new NumberModel({ number });

  newNumber
    .save()
    .then(() => {
      // Successful insertion
      res.status(200).json({ message: "Number submitted successfully" });
    })
    .catch((error) => {
      // Error in database insertion
      res.status(500).json({ message: "Failed to submit number", error });
    });
});

app.get("/getnumbers-history", (req, res) => {
  NumberModel.find()
    .then((numbers) => {
      const formattedNumbers = numbers.map((entry) => ({
        date: entry.date.toISOString().slice(0, 10),
        number: entry.number,
      }));

      res.status(200).json({ numbers: formattedNumbers });
    })
    .catch((error) => {
      res.status(500).json({ message: "Failed to retrieve numbers", error });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
