// routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
// const verifyToken = require("../middleware/Auth");
const { loginUser, createUser } = require("../Controllers/LoginController.js");
const { gettechsupport } = require("../Controllers/UserController.js");
const {
  gettickets,
  getTicketsForTs,
  updateTechSupport,
  updateTicketStatus,
  getTicketByUserId,
  createTicket,
  deleteTicket,
} = require("../Controllers/TicketController.js");

// router.post("/verifytoken", verifyUser);

// router.get("/users", getUsers).post(createUser);
// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/aladeen/sidtask/ticketing-server/uploads/"); // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define the filename
  },
});

// Multer upload instance
const upload = multer({ storage: storage });

router.post("/login", loginUser);

router.get("/techsupport", gettechsupport);

router.get("/gettickets", gettickets);

router.get("/getticketsbyts/:userId", getTicketsForTs);

router.get("/gettickets/:userId", getTicketByUserId);

router.put("/updatetechsupport/:ticketId", updateTechSupport);

router.put("/updateticketstatus/:ticketId", updateTicketStatus);

router.post("/createticket", upload.single("file"), createTicket);

router.delete("/tickets/:ticketId", deleteTicket);

router.post("/register", createUser);

module.exports = router;
