const Tickets = require("../Model/Ticket");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const Users = require("../Model/UserModel");
dotenv.config({ path: "./.env" });
const path = require("path");

//get tickets
const gettickets = expressAsyncHandler(async (req, res) => {
  const tickets = Tickets;
  console.log(tickets);
  res.status(200).json(tickets);
});

//get tickets with specific techsupport
const getTicketsForTs = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const tickets = Tickets.filter(
    (ticket) => ticket.assignedSupportId === parseInt(userId)
  );
  res.status(200).json(tickets);
});

const getTicketByUserId = (req, res) => {
  try {
    const { userId } = req.params;

    // Find the ticket in the tickets array
    const tickets = Tickets.filter(
      (ticket) => ticket.userId === parseInt(userId)
    );

    // Send updated ticket back as response
    res.status(200).json(tickets);
  } catch (err) {
    // Ticket not found
    res.status(404).json({ error: "Ticket not found" });
  }
};

const updateTechSupport = (req, res) => {
  const { ticketId } = req.params;
  const { techSupport } = req.body;
  console.log(techSupport);

  // Find the ticket in the tickets array
  const ticketIndex = Tickets.findIndex(
    (ticket) => ticket.id === parseInt(ticketId)
  );

  if (ticketIndex !== -1) {
    // Update the tech support ID for the ticket
    Tickets[ticketIndex].assignedSupportId = techSupport.id;
    Tickets[ticketIndex].assignedSupport = techSupport.email;

    // Send updated ticket back as response
    res.status(200).json(Tickets[ticketIndex]);
  } else {
    // Ticket not found
    res.status(404).json({ error: "Ticket not found" });
  }
};

const updateTicketStatus = (req, res) => {
  const { ticketId } = req.params;

  // Find the ticket in the tickets array
  const ticketIndex = Tickets.findIndex(
    (ticket) => ticket.id === parseInt(ticketId)
  );

  if (ticketIndex !== -1) {
    // Update the tech support ID for the ticket
    Tickets[ticketIndex].isResolved = !Tickets[ticketIndex].isResolved;

    // Send updated ticket back as response
    res.status(200).json(Tickets[ticketIndex]);
  } else {
    // Ticket not found
    res.status(404).json({ error: "Ticket not found" });
  }
};

const createTicket = (req, res) => {
  const { title, body, userId } = req.body;
  const file = req.file; // Contains file information

  // Save the file to database or perform other actions as needed
  // Example: saving file path to database
  const filePath = file ? path.basename(file.path) : null;

  // Create a new ticket object
  const newTicket = {
    id: Tickets.length + 1, // Generate a unique ID (you can use a proper ID generation logic)
    userId,
    title,
    body,
    filePath,
    assignedSupport: "",
    isResolved: false,
    createdAt: new Date().toISOString(), // Timestamp for ticket creation
  };

  // Add the new ticket to the ticketArray
  Tickets.push(newTicket);

  // Example: sending response back to client
  res.status(200).json({ title, body, filePath });
};

const deleteTicket = (req, res) => {
  const { ticketId } = req.params;
  const index = Tickets.findIndex((ticket) => ticket.id === parseInt(ticketId));

  if (index !== -1) {
    Tickets.splice(index, 1);
    res.status(200).json({ message: "Ticket deleted successfully" });
  } else {
    res.status(404).json({ message: "Ticket not found" });
  }
};

module.exports = {
  gettickets,
  getTicketsForTs,
  getTicketByUserId,
  updateTechSupport,
  updateTicketStatus,
  createTicket,
  deleteTicket,
};
