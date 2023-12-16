module.exports = async (req, res) => {
    const { authenticateWithGoogle } = require('../function/auth');
    const { getFileIdsInFolder, getFileSize,getRandomFileIdsInFolder } = require('../function/Operation');
    const folderId = '1YzwrXYiPRlu8d51CRx1eUAxDB_CCNid5';
    const { google } = require('googleapis');
    const auth = await authenticateWithGoogle();
    const drive = google.drive({ version: 'v3', auth });
    try {
      const fileIds = await getRandomFileIdsInFolder(drive, folderId, 12);
      res.render('index', { fileIds });
    } catch (error) {
      console.error(error.message);
      res.status(500).end();
    }
  }
