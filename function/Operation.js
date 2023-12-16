const { google } = require('googleapis');
const rangeParser = require('range-parser');

async function getFileIdsInFolder(drive, folderId, maxResults) {
  const { data } = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id)',
    maxResults,
  });

  if (data.files && data.files.length > 0) {
    return data.files.map(file => file.id);
  } else {
    throw new Error('No video files found in the specified folder.');
  }
}
async function getRandomFileIdsInFolder(drive, folderId, maxResults) {
  const { data } = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='video/mp4'`,
    fields: 'files(id)',
    maxResults,
  });

  if (data.files && data.files.length > 0) {
    const shuffledFiles = shuffleArray(data.files);
    return shuffledFiles.slice(0, maxResults).map(file => file.id);
  } else {
    throw new Error('No video files found in the specified folder.');
  }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
async function getFileSize(drive, fileId) {
  const { data } = await drive.files.get({
    fileId,
    fields: 'size',
  });
  return data.size;
}

module.exports = {
  getRandomFileIdsInFolder,
  getFileIdsInFolder,
  getFileSize,
};
