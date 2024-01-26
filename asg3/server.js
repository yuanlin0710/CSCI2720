/* 
    I declare that the lab work here submitted is original except for source material explicitly acknowledged, 
    and that the same or closely related material has not been previously submitted for another course. 
    I also acknowledge that I am aware of University policy and regulations on honesty in academic work, 
    and of the disciplinary guidelines and procedures applicable to breaches of such policy and regulations, 
    as contained in the website. University Guideline on Academic Honesty: https://www.cuhk.edu.hk/policy/academichonesty/ 

    Student Name : YUAN Lin 
    Student ID : 1155141399 
    Class/Section : CSCI2720 
    Date : Dec 14, 2023 
*/

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
  // use json middleware to parse json requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/assignment3');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));

db.once("open", function () {
    console.log("Connection is open...");

// Define Mongoose schemas
const eventSchema = new mongoose.Schema({
    eventId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    loc: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    quota: { type: Number }
});

const locationSchema = new mongoose.Schema({
    locId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    quota: { type: Number }
});

// Define Mongoose models
const Event = mongoose.model('Event', eventSchema);
const Location = mongoose.model('Location', locationSchema);


//Test: Creating a new event and a new location to check db connection
/*
let newLocation = new Location({
    locId: 2,
    name: "test location",
    quota: 999,

});

newLocation
    .save()
    .then(() => {
      console.log("a new location created successfully");
    })
    .catch((error) => {
      console.log("failed to save new location");
    });
  
  // Read all data
  Location.find({})
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("failed to read");
  });  

  let newEvent = new Event({
    eventId: 20,
    name: "Event helloworld",
    loc: "6578a2d66e1f10733541d11f",
    quota: 5,
});

  //Saving this new event to database
  newEvent
    .save()
    .then(() => {
      console.log("a new event created successfully");
    })
    .catch((error) => {
      console.log("failed to save new event");
    });
  
  // Read all data
  Event.find({})
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("failed to read");
  });  

*/


// Endpoints


// Problem 2
app.get('/ev/:eventID', async (req, res) => {
    try {
        const eventID = parseInt(req.params.eventID);
        const event = await Event.findOne({ eventId: eventID }).populate('loc').lean().exec();

        if (!event) {
            res.status(404).send('Event not found');
        } else {
            
            const responseObject = {
                eventId: event.eventId,
                name: event.name,
                loc: 
                {
                    locId: event.loc.locId,
                    name: event.loc.name
                },
                quota: event.quota
            };

            
            const responseText = JSON.stringify(responseObject, null, 2); 
            res.type('text/plain').send(responseText);
            
            
            
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Problem 3
app.post('/ev', async (req, res) => {
    try {
        const { name, locId, quota } = req.body;
        const location = await Location.findOne({ locId: locId }).exec();

        if (!location) {
            res.status(406).send('Location not found');
            return;
        }
        if (location.quota < quota) {
            res.status(406).send('Location quota insufficient');
            return;
        }
        

        const maxEventId = await Event.find().sort({ eventId: -1 }).limit(1);
        const newEventId = maxEventId.length === 0 ? 1 : maxEventId[0].eventId + 1;

        const newEvent = await Event.create({
            eventId: newEventId,
            name: name,
            loc: location._id,
            quota: quota
        });
        await newEvent.save();

        res.status(201).send(`http://localhost:3000/ev/${newEventId}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Problem 4
app.delete('/ev/:eventID', async (req, res) => {
    try {
        const eventID = parseInt(req.params.eventID);
        const event = await Event.findOneAndDelete({ eventId: eventID });

        if (!event) {
            res.status(404).send('Event not found');
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Problem 5

/*
  app.get('/ev', async (req, res) => {
    try {
        const events = await Event.find().populate('loc').exec();
        
        const eventArray = events.map((event) => ({
            eventId: event.eventId,
            name: event.name,
            loc: {
              locId: event.loc.locId,
              name: event.loc.name,
            },
            quota: event.quota,
          }));
    
          const responseText = JSON.stringify(eventArray, null, 2);
          res.type('text/plain').send(responseText);
        }


    catch (error) {
        res.status(500).send(error.message);
    }
});

*/
/*
        let responseText = "[";
        let responseObject = events.map(event => {
        return `
        {
        "eventId": "${event.eventId}"
        "name": "${event.name}"
        "loc":
        {
        "locId": "${event.loc.locId}"
        "name": "${event.loc.name}"
        },
        "quota": "${event.quota}"
        }`;
        }).join('\n');
        responseText += responseObject;
        responseText += "\n]";
        
        res.type('text/plain').send(responseText);
*/



//Q2

app.get('/lo/:locationID', async (req, res) => {
    try {
        const locationID = parseInt(req.params.locationID);
        const location = await Location.findOne({ locId: locationID });

        if (!location) {
            res.status(404).send('Location not found');
        } 
        else {
            const responseObject = {
            locId: location.locId,
            name: location.name,
            quota: location.quota
            };
            const responseText = JSON.stringify(responseObject, null, 2); 
            res.type('text/plain').send(responseText);
        };
            
        
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/*
app.get('/lo/:locationID', async (req, res) => {
    try {
        const locationID = parseInt(req.params.locationID);
        const location = await Location.findOne({ locId: locationID });
        if (!location) {
            res.type('text/plain');
            return res.status(404).send('Location not found');
        }
        res.type('text/plain');
        res.status(200).send(JSON.stringify(location));
    } catch (error) {
        res.type('text/plain');
        res.status(500).send('Internal Server Error');
    }
});
*/


//Q3
app.get('/lo', async (req, res) => {
    try {


        const locations = await Location.find().lean().exec();

        if (!locations || locations.length === 0) {
            res.status(404).send('No locations found');
        } 
        else {
            const locationArray = locations.map((location) => ({
            locId: location.locId,
            name: location.name,
            quota: location.quota,
        }));

        const responseText = JSON.stringify(locationArray, null, 2);
        res.type('text/plain').send(responseText);
        }
        /*
        const locations = await Location.find({});

        let responseText = locations.map(location => {
            return `"locId": "${location.locId}"
            "name": "${location.name}"
            "quota": "${location.quota}"`;
        }).join('\n\n');
        res.type('text/plain').send(responseText);
        */

    } catch (error) {
        res.type('text/plain');
        res.status(500).send('Internal Server Error');
    }
});


//Q1&Q4



app.get('/ev', async (req, res) => {
   
    const quotaFilter = req.query.q ? { quota: { $gte: parseInt(req.query.q, 10) } } : {};
  
    try {
      const events = await Event.find(quotaFilter).populate('loc'); 
  
      res.type('text/plain');
      if (events.length === 0) {
        return res.status(200).send('[]');
      } else {
        const eventArray = events.map((event) => ({
          eventId: event.eventId,
          name: event.name,
          loc: event.loc ? {
            locId: event.loc.locId,
            name: event.loc.name,
          } : null, 
          quota: event.quota,
        }));
  
        const responseText = JSON.stringify(eventArray, null, 2);
        res.type('text/plain').send(responseText);
      }
    } catch (error) {
      res.type('text/plain');
      res.status(500).send('Internal Server Error');
    }
  });

/*
app.get('/ev', async (req, res) => {
    const quota = parseInt(req.query.q);
    try {
        const events = await Event.find({ quota: quota });
        res.type('text/plain');
        if (events.length === 0) {
            return res.status(200).send('[]');
        }
        else{
            const eventArray = events.map((event) => ({
                eventId: event.eventId,
                name: event.name,
                loc: {
                  locId: event.loc.locId,
                  name: event.loc.name,
                },
                quota: event.quota,
              }));
        
              const responseText = JSON.stringify(eventArray, null, 2);
              res.type('text/plain').send(responseText);
            

        }
        
    } catch (error) {
        res.type('text/plain');
        res.status(500).send('Internal Server Error');
    }
});
*/




// Problem 6
app.put('/ev/:eventID', async (req, res) => {
    const { name, locID, quota } = req.body;

    try {
        const location = await Location.findOne({ locId: locID });
        if (!location) {
            res.type('text/plain');
            return res.status(404).send('Location not found');
        }

        const event = await Event.findOneAndUpdate(
            { eventId: req.params.eventID }, 
            {
              name,           
              loc: location._id, 
              quota          
            },
            {
              new: true,      
              runValidators: true 
            }
        ).populate('loc');
        

        if (!event) {
            res.type('text/plain');
            return res.status(404).send('Event not found');
        }
        
        const responseObject = {
            eventId: event.eventId,
            name: event.name,
            loc: 
            {
                locId: event.loc.locId,
                name: event.loc.name
            },
            quota: event.quota
        };
      
        const responseText = JSON.stringify(responseObject, null, 2); 
        res.type('text/plain').send(responseText);



    } catch (error) {
        console.error(error);
        res.type('text/plain');
        res.status(500).send('Internal Server Error');
    }
});



// handle all other requests
app.all("/*", (req, res) => {
    // send this to client
    res.send("Hello World! This is Asg3 of CSCI2720!");
});

});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});