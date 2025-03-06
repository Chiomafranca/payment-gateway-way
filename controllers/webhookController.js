const WebhookEvent = require('../models/webhookModel');

// POST: Save a new webhook event
const saveEvent = async (req, res) => {
  const event = req.event; // From middleware after signature verification

  try {
    const newEvent = new WebhookEvent({
      eventId: event.id,
      eventType: event.type,
      data: event.data.object, // You can adjust based on the event data structure
    });
    await newEvent.save();
    res.status(200).send('Webhook event received and saved.');
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).send('Internal server error');
  }
};

// GET: Retrieve all webhook events
const getAllEvents = async (req, res) => {
  try {
    const events = await WebhookEvent.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).send('Internal server error');
  }
};

// GET: Retrieve a specific event by eventId
const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await WebhookEvent.findOne({ eventId });
    if (!event) {
      return res.status(404).send('Event not found');
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error retrieving event by ID:', error);
    res.status(500).send('Internal server error');
  }
};

// PATCH: Update an event (e.g., mark as processed)
const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const updatedData = req.body;

  try {
    const updatedEvent = await WebhookEvent.findOneAndUpdate(
      { eventId },
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedEvent) {
      return res.status(404).send('Event not found');
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).send('Internal server error');
  }
};

// DELETE: Delete an event by eventId
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const deletedEvent = await WebhookEvent.findOneAndDelete({ eventId });

    if (!deletedEvent) {
      return res.status(404).send('Event not found');
    }
    res.status(200).send('Event deleted');
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  saveEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
