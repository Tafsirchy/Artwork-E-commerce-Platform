const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Contact = require('../models/Contact');
const connectDB = require('../config/db');

dotenv.config();

const contactsData = [
  {
    name: "Alexander Vance",
    email: "alex.vance@artcollector.com",
    subject: "Art Consultation",
    message: "I am interested in acquiring a large-scale abstract piece for my new gallery in London. Do you have any upcoming collections from Sarah Thorne?",
    status: "new",
    createdAt: new Date("2024-05-10T10:30:00Z")
  },
  {
    name: "Isabella Rossi",
    email: "isabella@rossidesigns.it",
    subject: "Exhibition Proposal",
    message: "We are organizing a 'Minimalist Echoes' exhibition in Milan this autumn and would love to feature some of your curated digital artworks.",
    status: "read",
    createdAt: new Date("2024-05-09T14:45:00Z")
  },
  {
    name: "Marcus Reel",
    email: "marcus.reel@shipping.com",
    subject: "Shipping & Logistics",
    message: "Confirming the arrival of the 'Celestial Bloom' shipment. The climate-controlled packaging was perfect.",
    status: "replied",
    createdAt: new Date("2024-05-08T09:15:00Z")
  },
  {
    name: "Julian Thorne",
    email: "j.thorne@collector.net",
    subject: "General Inquiry",
    message: "How often do you update the Chronicle records? I'm following the artist stories closely.",
    status: "new",
    createdAt: new Date("2024-05-11T16:20:00Z")
  },
  {
    name: "Elena Petrova",
    email: "elena.p@designstudio.ru",
    subject: "Other",
    message: "Interested in a collaborative project for a luxury hotel chain. Who is the best person to speak with regarding commercial licensing?",
    status: "new",
    createdAt: new Date("2024-05-12T11:05:00Z")
  }
];

const seedContacts = async () => {
  try {
    await connectDB();
    
    await Contact.deleteMany();
    console.log('Existing Contacts cleared.');

    await Contact.insertMany(contactsData);
    console.log('New Contacts Seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('Error seeding contacts:', error.message);
    process.exit(1);
  }
};

seedContacts();
