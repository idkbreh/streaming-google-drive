module.exports = async (req, res) => {
    const auth = await authenticateWithGoogle();
    const { getFileIdsInFolder, getFileSize } = require('../function/Operation');
    const drive = google.drive({ version: 'v3', auth });
  
    try {
      const fileIds = await getFileIdsInFolder(drive, folderId);
      res.json({ fileIds });
    } catch (error) {
      console.error(error.message);
      res.status(500).end();
    }
  }