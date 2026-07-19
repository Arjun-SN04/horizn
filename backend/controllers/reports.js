const Report = require('../models/report');
const Listing = require('../models/listing');

module.exports.getAllReports = async (req, res) => {
  const reports = await Report.find({})
    .sort({ createdAt: -1 })
    .populate('listing', 'title image')
    .populate('reporter', 'username email');
  res.json({ success: true, reports });
};

module.exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['open', 'resolved', 'dismissed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const report = await Report.findByIdAndUpdate(id, { status }, { new: true })
    .populate('listing', 'title image')
    .populate('reporter', 'username email');

  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  res.json({ success: true, report });
};

module.exports.createReport = async (req, res) => {
  const { id } = req.params;
  const { reason, details } = req.body.report;

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  await Report.create({
    listing: id,
    reporter: req.user._id,
    reason,
    details: details || '',
  });

  res.status(201).json({ success: true, message: "Thanks — we'll review this listing." });
};
