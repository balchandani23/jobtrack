const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// GET /api/jobs (with search and status filter)
router.get('/', auth, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { userId: req.user };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/jobs/stats (metric counters)
router.get('/stats', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user });

    const stats = {
      total: jobs.length,
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };

    jobs.forEach((job) => {
      const key = job.status.toLowerCase();
      if (stats[key] !== undefined) {
        stats[key]++;
      }
    });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/jobs (create application)
router.post('/', auth, async (req, res) => {
  const { company, position, status, location, salary, notes, interviewDate, appliedDate } = req.body;

  if (!company || !position) {
    return res.status(400).json({ msg: 'Company and position are required' });
  }

  try {
    const newJob = new Job({
      userId: req.user,
      company,
      position,
      status,
      location,
      salary,
      notes,
      interviewDate: interviewDate || null,
      appliedDate: appliedDate || Date.now(),
    });

    const job = await newJob.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/jobs/:id (update application)
router.put('/:id', auth, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job application not found' });

    if (job.userId.toString() !== req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/jobs/:id (delete application)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job application not found' });

    if (job.userId.toString() !== req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Job application removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;