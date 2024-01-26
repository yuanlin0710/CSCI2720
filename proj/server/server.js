const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Use cors middleware to allow cross-origin requests (development only)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow the React dev server to make requests
  })
);
// use json middleware to parse json requests
app.use(express.json());
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/project");

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open...");

  // Database Schema
  // creating a mongoose model for user
  const UserSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Username already been used!"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // a list for storing favorite locations, identified by their venue_id
    favList: {
      type: Array,
      required: [true, "Favorite list is required"],
    },
  });

  const User = mongoose.model("User", UserSchema);

  const EventSchema = mongoose.Schema({
    eventId: {
      type: String,
      required: [true, "Event ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    venueId: {
      type: String,
      required: [true, "Venue ID is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    presenter: {
      type: String,
      required: [true, "Presenter is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
  });
  const Event = mongoose.model("Event", EventSchema);

  // creating a mongoose model for venue
  // attributes:
  // "venueId": "3110031",
  // "venue_name": "North District Town Hall (Auditorium)",
  // "latitude": "22.501639",
  // "longitude": "114.128911"
  const VenueSchema = mongoose.Schema({
    venueId: {
      type: String,
      required: [true, "Venue ID is required"],
    },
    venue_name: {
      type: String,
      required: [true, "Venue name is required"],
    },
    latitude: {
      type: String,
      required: [true, "Latitude is required"],
    },
    longitude: {
      type: String,
      required: [true, "Longitude is required"],
    },
  });
  const Venue = mongoose.model("Venue", VenueSchema);

  // creating a mongoose model for comment
  // attributes:
  // "username": "user",
  // "comment": "good",
  // "date": "2021-04-01",
  const CommentSchema = mongoose.Schema({
    venueId: {
      type: String,
      required: [true, "Venue ID is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
  });
  const Comment = mongoose.model("Comment", CommentSchema);

  app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(username, password);
      const userData = await User.findOne({
        name: username,
        password: password,
      });
      if (userData) {
        res.status(200).send(userData);
      } else {
        res.status(404).send("User not found");
      }
    } catch {
      res.status(500).send("Internal server error");
    }
  });


  // return comment of location
  app.get("/comment/:commentId", async (req, res) => {
    try {
      // Query MongoDB to retrieve all comment about a venue
      const { commentId } = req.params;
      console.log(commentId);
      const commentData = await Comment.find({ commentId: commentId });
      console.log(commentData);
      res.status(200).send(commentData);
    } catch {
      res.status(500).send("Internal server error");
    }
  });
  app.get("/comment", async (req, res) => {
    try {
        // Query MongoDB to retrieve all comment about a venue
        const commentData = await Comment.find({}, "venueId username comment");
        console.log(commentData);
        res.status(200).send(commentData);
        } catch {
            res.status(500).send("Internal server error");
        }
  });

  app.post("/comment", async (req, res) => {
        try {
          const newEvent = new Comment(req.body);
          await newEvent.save();
          res.status(201).json(newEvent);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
  });

  app.post('/event', async (req, res) => {
    try {
      const newEvent = new Event(req.body);
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // POST - Create a new user
app.post('/user', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Retrieve a single user by name
    app.get('/user/:userId', async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findOne({ _id: userId });
      if (user) {
          console.log(user);
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update a user by ID
app.put('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let userUpdate = req.body;

    // Directly update user information without hashing the password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      userUpdate,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/user/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const userUpdate = req.body;
    const updatedUser = await User.findOneAndUpdate({ name: name }, userUpdate, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete a user by ID
app.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId); // Use findByIdAndDelete if you're deleting by ID
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: `User ${userId} deleted successfully` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
    app.get('/event/:eventId', async (req, res) => {
        try {
            const { eventId } = req.params;
            const eventUpdate = req.body;
            const event = await Event.findOne({ eventId: eventId });
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
  app.put('/event/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      const eventUpdate = req.body;
      const updatedEvent = await Event.findOneAndUpdate({ eventId: eventId }, eventUpdate, { new: true });
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete('/event/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      const deletedEvent = await Event.findOneAndDelete({ eventId });
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json({ message: `Event ${eventId} deleted successfully` });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // return all venues
  app.get("/venue", async (req, res) => {
    try {
      // Query MongoDB to retrieve all events
      const venueData = await Venue.find({}, "venueId venue_name latitude longitude");
      // count the number of events
      console.log(venueData.length);
      res.status(200).send(venueData);
    } catch {
      res.status(500).send("Internal server error");
    }
  });

  // return all users
  app.get("/user", async (req, res) => {
    try {
      // Query MongoDB to retrieve all events
      const userData = await User.find({}, "name password");
      // count the number of users
      console.log(userData.length);
      res.status(200).send(userData);
    } catch {
      res.status(500).send("Internal server error");
    }
  });

  // return all events
  app.get("/event", async (req, res) => {
    try {
      // Query MongoDB to retrieve all events
      const eventData = await Event.find(
        {},
        "eventId title date time venueId description presenter price"
      );
      // count the number of events
      console.log(eventData.length);
      res.status(200).send(eventData);
    } catch {
      res.status(500).send("Internal server error");
    }
  });

  // return favorite locations of user
  app.get("/fav/:username", async (req, res) => {
    try {
      const { username } = req.params;
      // Query MongoDB to retrieve all events
      const userData = await User.findOne({ name: username });
      const favList = userData.favList;
      console.log(favList);
      const venueList = await Venue.find(
        { venueId: { $in: favList } },
        "venueId venue_name"
      );
      console.log(venueList);
      res.status(200).send(venueList);
    } catch {
      res.status(500).send("Internal server error");
    }
  });

    app.put('/favupdate/:username', async (req, res) => {
        try {
            const { username } = req.params;
            const locid = req.body.locid;
            const updatedEvent = await User.findOneAndUpdate({ name: username }, { $push: { favList: locid } }, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ message: 'Location not found' });
            }
            res.json(updatedEvent);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
    app.delete('/favupdate/:username', async (req, res) => {
        try {
            const { username } = req.params;
            const locid = req.body.locid;
            const updatedEvent = await User.findOneAndUpdate({ name: username }, { $pull: { favList: locid } }, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ message: 'Location not found' });
            }
            res.json(updatedEvent);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

  // handle all requests
  app.all("/*", (req, res) => {
    // send this to client
    res.send("Hello World! This is CSCI2720 Group 17!");
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
