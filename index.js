const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cnltwph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotsCollection = client.db("spotsDB").collection("spots");
    const countriesCollection = client.db("spotsDB").collection("countries");

    app.get("/spots", async (req, res) => {
      const cursor = spotsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/countries", async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/spots", async (req, res) => {
      const newSpots = req.body;
      // console.log(newSpots);
      const result = await spotsCollection.insertOne(newSpots);
      res.send(result);
    });

    app.put("/updatespots/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          tourists_spot_name: req.body.tourists_spot_name,
          country_name: req.body.country_name,
          location: req.body.location,
          short_description: req.body.short_description,
          avg_cost: req.body.avg_cost,
          seasonality: req.body.seasonality,
          travel_time: req.body.travel_time,
          visitors_per_year: req.body.visitors_per_year,
          photo: req.body.photo,
        }
      }
    const result = await spotsCollection.updateOne(query, data);
    console.log(result);
    res.send(result);
    });

    app.get("/mySpots/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await spotsCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
        const result = await spotsCollection.deleteOne({_id: new ObjectId(req.params.id)})
        console.log(result);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourism site server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
