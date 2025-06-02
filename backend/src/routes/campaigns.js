const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');
const Communication = require('../models/communication');
const Customer = require('../models/customer');

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new campaign
router.post('/', async (req, res) => {
  const campaign = new Campaign({
    name: req.body.name,
    segmentName: req.body.segmentName,
    segmentRules: req.body.segmentRules,
    audienceSize: req.body.audienceSize
  });

  try {
    const newCampaign = await campaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get campaign logs
router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await Communication.find({ campaignId: req.params.id });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;