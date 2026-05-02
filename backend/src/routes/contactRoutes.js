const express = require('express');
const {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(protect, admin, getContacts);

router.route('/:id')
  .get(protect, admin, getContact)
  .put(protect, admin, updateContactStatus)
  .delete(protect, admin, deleteContact);

module.exports = router;
