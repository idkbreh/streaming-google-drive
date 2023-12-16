const rangeParser = require('range-parser');
const {getFileSize} = require('./Operation')
async function streamVideo(req, res, drive, fileId) {
  try {
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'size'
    });
    const fileSize = fileMetadata.data.size;
    const rangeHeader = req.headers.range;
    const range = rangeHeader ? rangeParser(fileSize, rangeHeader)[0] : null;

    if (!range) {
      const videoStream = await drive.files.get({
        fileId: fileId,
        alt: 'media'
      }, { responseType: 'stream' });

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });

      videoStream.data.pipe(res);
    } else {
      const { start, end } = range;
      const chunkSize = (end - start) + 1;

      const videoStream = await drive.files.get({
        fileId: fileId,
        alt: 'media',
        headers: {
          Range: `bytes=${start}-${end}`
        }
      }, { responseType: 'stream' });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      videoStream.data.pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video:', error.message);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  streamVideo,
};