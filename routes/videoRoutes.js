module.exports = async (req, res) => {
  const { google } = require('googleapis');
  const { streamVideo } = require('../function/video');
  const { authenticateWithGoogle } = require('../function/auth');
  const fileId = req.query.fileid;
  if (!fileId) {
    return res.status(400).send('File ID is required');
  }
  const auth = await authenticateWithGoogle();
  const drive = google.drive({ version: 'v3', auth });
  await streamVideo(req, res, drive, fileId);
}