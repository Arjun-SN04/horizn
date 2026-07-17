const Notification = require('../models/notification');

module.exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate('listing', 'title');
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
  res.json({ notifications, unreadCount });
};

module.exports.markRead = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
  res.json({ success: true, notification });
};

module.exports.markAllRead = async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
  res.json({ success: true });
};
