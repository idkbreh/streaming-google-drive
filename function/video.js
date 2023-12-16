const rangeParser = require('range-parser');
const { getFileSize } = require('./Operation');
const ffmpeg = require('fluent-ffmpeg');

async function streamVideo(req, res, drive, fileId) {
  try {
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'size'
    });
    const fileSize = fileMetadata.data.size;
    const rangeHeader = req.headers.range;
    const range = rangeHeader ? rangeParser(fileSize, rangeHeader)[0] : null;

    // Output video settings (e.g., lower bitrate for smaller size)
    const outputSettings = [
      '-b:v 500k', // Set the video bitrate to 500k (adjust as needed)
      '-bufsize 1000k', // Set the buffer size (adjust as needed)
    ];

    if (!range) {
      const videoStream = await drive.files.get({
        fileId: fileId,
        alt: 'media'
      }, { responseType: 'stream' });

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });

      videoStream.data
        .pipe(ffmpeg())
        .videoCodec('libx264') // Set the video codec (adjust as needed)
        .inputFormat('mp4') // Set the input format (adjust as needed)
        .audioCodec('aac') // Set the audio codec (adjust as needed)
        .audioChannels(2) // Set the number of audio channels (adjust as needed)
        .outputOptions(outputSettings)
        .pipe(res, { end: true });
    } else {
      // Handle range requests for transcoded video similarly
      // ...
    }
  } catch (error) {
    console.error('Error streaming video:', error.message);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  streamVideo,
};
