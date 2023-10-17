// update16. This code works on level 1-5 in glitch on everything
const express = require("express");
const cors = require("cors");
const moment = require("moment");
const { isEmail } = require("validator");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.static("public"));

const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.get("/bookings/search", (req, res) => {
  const searchDate = req.query.date;
  const searchTerm = req.query.term;

  if (searchDate) {
    if (!moment(searchDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        error: "Invalid date format. Please use 'YYYY-MM-DD' format.",
      });
    }

    const bookingsForDate = bookings.filter((booking) => {
      const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
      const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
      return (
        checkInDate.isSameOrBefore(searchDate, "day") &&
        checkOutDate.isSameOrAfter(searchDate, "day")
      );
    });

    return res.json(bookingsForDate);
  }

  if (searchTerm) {
    const matchedBookings = bookings.filter((booking) => {
      const emailMatch = booking.email.includes(searchTerm);
      const firstNameMatch = booking.firstName.includes(searchTerm);
      const surnameMatch = booking.surname.includes(searchTerm);
      return emailMatch || firstNameMatch || surnameMatch;
    });

    return res.json(matchedBookings);
  }

  return res.status(400).json({
    error:
      "Invalid search parameters. Please provide either 'date' or 'term' in the query.",
  });
});

app.get("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const booking = bookings.find((booking) => booking.id === id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found." });
  }

  return res.json(booking);
});

app.post("/bookings", (req, res) => {
  const newBooking = {
    ...req.body,
  };

  for (const key in newBooking) {
    if (!newBooking[key]) {
      return res
        .status(400)
        .json({ error: "Invalid booking data. Missing or empty property." });
    }
  }

  if (!isEmail(newBooking.email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const checkInDate = moment(newBooking.checkInDate, "YYYY-MM-DD");
  const checkOutDate = moment(newBooking.checkOutDate, "YYYY-MM-DD");
  if (!checkOutDate.isAfter(checkInDate)) {
    return res
      .status(400)
      .json({ error: "Checkout date must be after checkin date." });
  }

  newBooking.id = bookings.length + 1;
  bookings.push(newBooking);
  res.json(newBooking);
});

app.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = bookings.findIndex((booking) => booking.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Booking not found." });
  } else {
    bookings.splice(index, 1);
    res.json({ message: "Booking deleted successfully." });
  }
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// test
// scp -i "AWS-EC2-key-pair.pem" /Users/jansofta/Documents/GitHub/aws-hotel-server/* ec2-user@ec2-18-168-197-240.eu-west-2.compute.amazonaws.com:path/

// ssh -i "AWS-EC2-key-pair.pem" ec2-user@ec2-18-168-197-240.eu-west-2.compute.amazonaws.com

// update12. This code work on level 1-5 except bookings id on level1.
// const express = require("express");
// const cors = require("cors");
// const moment = require("moment");
// const { isEmail } = require("validator");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// app.use(express.static("public"));

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/search", (req, res) => {
//   const searchDate = req.query.date;
//   const searchTerm = req.query.term;

//   if (searchDate) {
//     if (!moment(searchDate, "YYYY-MM-DD", true).isValid()) {
//       return res.status(400).json({ error: "Invalid date format. Please use 'YYYY-MM-DD' format." });
//     }

//     const bookingsForDate = bookings.filter((booking) => {
//       const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
//       const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
//       return checkInDate.isSameOrBefore(searchDate, "day") && checkOutDate.isSameOrAfter(searchDate, "day");
//     });

//     return res.json(bookingsForDate);
//   }

//   if (searchTerm) {
//     const matchedBookings = bookings.filter((booking) => {
//       const emailMatch = booking.email.includes(searchTerm);
//       const firstNameMatch = booking.firstName.includes(searchTerm);
//       const surnameMatch = booking.surname.includes(searchTerm);
//       return emailMatch || firstNameMatch || surnameMatch;
//     });

//     return res.json(matchedBookings);
//   }

//   return res.status(400).json({ error: "Invalid search parameters. Please provide either 'date' or 'term' in the query." });
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...req.body,
//   };

//   for (const key in newBooking) {
//     if (!newBooking[key]) {
//       return res.status(400).json({ error: "Invalid booking data. Missing or empty property." });
//     }
//   }

//   if (!isEmail(newBooking.email)) {
//     return res.status(400).json({ error: "Invalid email address." });
//   }

//   const checkInDate = moment(newBooking.checkInDate, "YYYY-MM-DD");
//   const checkOutDate = moment(newBooking.checkOutDate, "YYYY-MM-DD");
//   if (!checkOutDate.isAfter(checkInDate)) {
//     return res.status(400).json({ error: "Checkout date must be after checkin date." });
//   }

//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// update 11. this works on level4 in glitch
// const express = require("express");
// const cors = require("cors");
// const moment = require("moment");
// const validator = require("validator");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());
// app.use(express.static("public"));

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/search", (req, res) => {
//   const searchDate = req.query.date;

//   if (!searchDate || !moment(searchDate, "YYYY-MM-DD", true).isValid()) {
//     return res.status(400).json({ error: "Invalid date format. Please use 'YYYY-MM-DD' format." });
//   }

//   const bookingsForDate = bookings.filter((booking) => {
//     const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
//     const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
//     return checkInDate.isSameOrBefore(searchDate, "day") && checkOutDate.isSameOrAfter(searchDate, "day");
//   });

//   res.json(bookingsForDate);
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...req.body,
//   };

//   for (const key in newBooking) {
//     if (!newBooking[key]) {
//       return res.status(400).json({ error: "Invalid booking data. Missing or empty property." });
//     }
//   }

//   if (!validator.isEmail(newBooking.email)) {
//     return res.status(400).json({ error: "Invalid email address." });
//   }

//   const checkInDate = moment(newBooking.checkInDate, "YYYY-MM-DD");
//   const checkOutDate = moment(newBooking.checkOutDate, "YYYY-MM-DD");
//   if (!checkOutDate.isAfter(checkInDate)) {
//     return res.status(400).json({ error: "Checkout date must be after check-in date." });
//   }

//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.get("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const booking = bookings.find((booking) => booking.id === id);

//   if (!booking) {
//     return res.status(404).json({ error: "Booking not found." });
//   } else {
//     res.json(booking);
//   }
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// update10. this one can handle all request for level 3 using glitch
// const express = require("express");
// const cors = require("cors");
// const moment = require("moment");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());
// app.use(express.static("public"));

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/search", (req, res) => {
//   const searchDate = req.query.date;

//   if (!searchDate || !moment(searchDate, "YYYY-MM-DD", true).isValid()) {
//     return res.status(400).json({ error: "Invalid date format. Please use 'YYYY-MM-DD' format." });
//   }

//   const bookingsForDate = bookings.filter((booking) => {
//     const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
//     const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
//     return checkInDate.isSameOrBefore(searchDate, "day") && checkOutDate.isSameOrAfter(searchDate, "day");
//   });

//   res.json(bookingsForDate);
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...req.body,
//   };

//   for (const key in newBooking) {
//     if (!newBooking[key]) {
//       return res.status(400).json({ error: "Invalid booking data. Missing or empty property." });
//     }
//   }

//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.get("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const booking = bookings.find((booking) => booking.id === id);

//   if (!booking) {
//     return res.status(404).json({ error: "Booking not found." });
//   } else {
//     res.json(booking);
//   }
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// update9. this version does not find specified booking by Id
// const express = require("express");
// const cors = require("cors");
// const moment = require("moment");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// app.use(express.static("public"));

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/search", (req, res) => {
//   const searchDate = req.query.date;

//   if (!searchDate || !moment(searchDate, "YYYY-MM-DD", true).isValid()) {
//     return res.status(400).json({ error: "Invalid date format. Please use 'YYYY-MM-DD' format." });
//   }

//   const bookingsForDate = bookings.filter((booking) => {
//     const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
//     const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
//     return checkInDate.isSameOrBefore(searchDate, "day") && checkOutDate.isSameOrAfter(searchDate, "day");
//   });

//   res.json(bookingsForDate);
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...req.body,
//   };

//   for (const key in newBooking) {
//     if (!newBooking[key]) {
//       return res.status(400).json({ error: "Invalid booking data. Missing or empty property." });
//     }
//   }

//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// update8 this version do level 1 & 2 and added css
// const express = require("express");
// const cors = require("cors");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// app.use(express.static("public"));

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const booking = bookings.find((booking) => booking.id === id);

//   if (!booking) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     res.json(booking);
//   }
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...req.body,
//   };

//   for (const key in newBooking) {
//     if (!newBooking[key]) {
//       res.status(400).json({ error: "Invalid booking data. Missing or empty property." });
//       return;
//     }
//   }

//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// update7 this version works for level 1 & 2
// const express = require("express");
// const cors = require("cors");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const booking = bookings.find((booking) => booking.id === id);

//   if (!booking) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     res.json(booking);
//   }
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...req.body,
//   };

//   for (const key in newBooking) {
//     if (!newBooking[key]) {
//       res.status(400).json({ error: "Invalid booking data. Missing or empty property." });
//       return;
//     }
//   }

//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// update6
// const express = require("express");
// const cors = require("cors");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const booking = bookings.find((booking) => booking.id === id);

//   if (!booking) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     res.json(booking);
//   }
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...req.body,
//   };

//   for (const key in newBooking) {
//     if (!newBooking[key]) {
//       res.status(400).json({ error: "Invalid booking data. Missing or empty property." });
//       return;
//     }
//   }

//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// update5.
// const express = require("express");
// const cors = require("cors");
// const dataModel = require("./dataModel.js");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.send("Hotel booking server. Ask for /bookings, etc.");
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const booking = bookings.find((booking) => booking.id === id);

//   if (!booking) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     res.json(booking);
//   }
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...dataModel,
//     ...req.body,
//   };

//   for (const key in newBooking) {
//     if (!newBooking[key]) {
//       res.status(400).json({ error: "Invalid booking data. Missing or empty property." });
//       return;
//     }
//   }

//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

//update4. This version can handle all requirements for level1
// const express = require("express");
// const cors = require("cors");
// const dataModel = require("./dataModel.js");
// const path = require("path");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.sendFile(path.join(__dirname, "index.html"));
// });

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const booking = bookings.find((booking) => booking.id === id);

//   if (!booking) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     res.json(booking);
//   }
// });

// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...dataModel,
//     ...req.body,
//   };
//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

//update3

// const express = require("express");
// const cors = require("cors");
// const dataModel = require("./dataModel.js");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// //Use this array as your (in-memory) data store.
// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.send("Hotel booking server. Ask for /bookings, etc.");
// });

// // Get all bookings
// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// // Get one booking by ID
// app.get("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const booking = bookings.find((booking) => booking.id === id);

//   if (!booking) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     res.json(booking);
//   }
// });

// // Create a new booking
// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...dataModel,
//     ...req.body,
//   };
//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// // Delete a booking by ID
// app.delete("/bookings/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = bookings.findIndex((booking) => booking.id === id);

//   if (index === -1) {
//     res.status(404).json({ error: "Booking not found." });
//   } else {
//     bookings.splice(index, 1);
//     res.json({ message: "Booking deleted successfully." });
//   }
// });

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

//update2 I can type in bookings and it displays all bookings

// const express = require("express");
// const cors = require("cors");
// const dataModel = require("./dataModel.js");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// //Use this array as your (in-memory) data store.
// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.send("Hotel booking server.  Ask for /bookings, etc.");
// });

// // Get all bookings
// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// // Create a new booking
// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...dataModel,
//     ...req.body,
//   };
//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// // TODO: Add routes to handle other operations (e.g., delete, update) as needed.

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// update1 works I can type in bookings and it displays all bookings

// const express = require("express");
// const cors = require("cors");
// const dataModel = require("./dataModel.js");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// //Use this array as your (in-memory) data store.
// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.send("Hotel booking server.  Ask for /bookings, etc.");
// });

// // Get all bookings
// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// // Create a new booking
// app.post("/bookings", (req, res) => {
//   const newBooking = {
//     ...dataModel,
//     ...req.body,
//   };
//   newBooking.id = bookings.length + 1;
//   bookings.push(newBooking);
//   res.json(newBooking);
// });

// // TODO: Add routes to handle other operations (e.g., delete, update) as needed.

// const listener = app.listen(port, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

//original
// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(express.json());
// app.use(cors());

// //Use this array as your (in-memory) data store.
// const bookings = require("./bookings.json");

// app.get("/", function(request, response){
//   response.send("Hotel booking server.  Ask for /bookings, etc.");
// });

// // TODO add your routes and helper functions here

// const listener = app.listen(process.env.PORT, function() {
//   console.log("Your app is listening on port " + listener.address().port);
// });
