// app.js
const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors')
//PAGE IMPORT
const VideoRoute = require('./routes/videoRoutes')
const IndexPage = require('./routes/IndexPage')
const { authenticateWithGoogle } = require('./function/auth');
// API IMPORT
const { getFileIdsInFolder } = require('./function/Operation');
const ListAPI = require('./routes/ListRoutes')
const app = express();
const port = 3000;
app.use(cors())
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.get('/thumbnail', async (req, res) => {
  const fileId = req.query.fileid;

  if (!fileId) {
    res.status(400).send('File ID is required.');
    return;
  }

  const auth = await authenticateWithGoogle();
  const drive = google.drive({ version: 'v3', auth });

  try {
    const { data } = await drive.files.get({ fileId, fields: 'thumbnailLink' });
    const thumbnailLink = data.thumbnailLink;

    if (thumbnailLink) {
      res.redirect(thumbnailLink);
    } else {
      res.status(404).send('Thumbnail not found.');
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
});
app.get('/videoList', async (req, res) => {
  const { authenticateWithGoogle } = require('./function/auth');
  const { getFileIdsInFolder } = require('./function/Operation');
  const { google } = require('googleapis');
  const folderId = '1YzwrXYiPRlu8d51CRx1eUAxDB_CCNid5';

  const auth = await authenticateWithGoogle();
  const drive = google.drive({ version: 'v3', auth });

  try {
    const pageToken = req.query.pageToken || null;
    const { videoFiles, nextPageToken } = await getFileIdsInFolder(drive, folderId, 10, pageToken);

    // Send the video files and nextPageToken as a response
    res.json({ videoFiles, nextPageToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
});
app.get('/video',VideoRoute );
app.get('/', IndexPage);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
