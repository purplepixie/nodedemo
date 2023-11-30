var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "travel",
  password: "travel",
  port: 8889,
  database: "travel"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

/*
sql = "SELECT * FROM trip"
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
*/
const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Trip Logic

/*
Trip Structure:
{
    id: "TRIP ID",
    locations: [
        {
            "name": "NAMEOFPLACE",
            "date": "DATEARRIVE"
        },
        ...
    ]
}
*/

// Add Trip
// Note: add trip we get the JSON but without an ID
app.post('/addtrip', (req, res) => {
    console.log(`Request to add trip`)
    trip = req.body

    // INSERT a trip
    tripid = 0
    sql = "INSERT INTO trip(tripowner) VALUES('test')"
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
        tripid = result.insertId
        console.log("Trip ID = "+tripid)

        // ITEMS
        for(i of trip.locations)
        {
            console.log("To: "+i.name+" on "+i.date)
            sql = "INSERT INTO itinerary(tripid,location,arrival) VALUES(?,?,?)"
            console.log(sql)
            con.query(sql, [tripid, i.name, i.date], function (err, result) {
                if (err) throw err;
                console.log("Result: " + result);
            });
        }

        trip.id = tripid
        res.send(trip)
      });
  })
// Get Trip
app.get('/gettrip/:tripid', (req, res) => {
    console.log(`Request to gettrip ID ${req.params.tripid}`)
    /*
    var trip = {
        id: "1234",
        locations: [
            {
                "name": "London",
                "date": "2023-12-24"
            },
            {
                "name": "Amsterdam",
                "date": "2023-12-30"
            }
        ]
    }
    */
   var trip = {
    id: 0,
    locations: []
   }
   sql = "SELECT * FROM itinerary WHERE tripid=?"
    con.query(sql, [req.params.tripid], function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
        if (result.length<=0)
        {
            trip.id = -1;
        }
        else // found trip!
        {
            trip.id = req.params.tripid
            for(i=0; i<result.length; ++i)
            {
                trip.locations.push(
                    {
                        "name": result[i].location,
                        "date": result[i].arrival
                    }
                )
            }
        }
        res.send(trip)
    });
  })

// Update Trip
// Delete Trip

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})