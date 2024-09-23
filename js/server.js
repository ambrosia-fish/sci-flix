/**
 * A simple HTTP server that logs requests and serves HTML files.
 * @module httpServer
 */

const http = require('http'),
  fs = require('fs'),
  url = require('url');

/**
 * Creates and starts an HTTP server.
 * @function
 * @name createServer
 * @listens {number} 8080 - The port on which the server listens.
 */
http.createServer((request, response) => {
  let addr = request.url,
    q = new URL(addr, 'http://localhost:8080'),
    filePath = '';

  /**
   * Logs the request URL and timestamp to a file.
   * @function
   * @name logRequest
   * @param {string} addr - The requested URL.
   */
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  /**
   * Determines the file path based on the requested URL.
   * @function
   * @name determineFilePath
   * @param {URL} q - The parsed URL object.
   * @returns {string} The file path to be served.
   */
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  /**
   * Reads the file and sends it as the response.
   * @function
   * @name serveFile
   * @param {string} filePath - The path of the file to be served.
   */
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });
}).listen(8080);

console.log('It\'s working! It\'s working!');