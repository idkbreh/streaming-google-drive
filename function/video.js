const rangeParser = require('range-parser');
const { getFileSize } = require('./Operation');
const ffmpeg = require('fluent-ffmpeg');

async function streamVideo(req, res, drive, fileId) {
  try {
    // Retrieve file metadata to get the size of the video
    const fileMetadata = await drive.files.get({ fileId: fileId, fields: 'size' });
    const fileSize = fileMetadata.data.size;
    const rangeHeader = req.headers.range;

    // Check if there's a range header
    if (rangeHeader) {
      const range = rangeParser(fileSize, rangeHeader)[0];
      const { start, end } = range;
      const chunkSize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      const videoStream = await drive.files.get({
        fileId: fileId,
        alt: 'media',
        headers: {
          Range: `bytes=${start}-${end}`
        }
      }, { responseType: 'stream' });

      videoStream.data.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });

      const videoStream = await drive.files.get({
        fileId: fileId,
        alt: 'media'
      }, { responseType: 'stream' });

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
