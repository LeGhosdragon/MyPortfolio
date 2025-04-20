const httpInstance = require('http');
const httpStatusInstance = require('http-status-codes');
const fsInstance = require('fs');
const path = require('path');
const portNumber = 8080;

// Create a server instance
const httpServer = httpInstance.createServer((req, res) => {
    // Determine the file path based on the URL
    let filePath = '';
    let contentType = 'text/html';

    if (req.url === '/' || req.url === '/index') {
        filePath = redirectToHtml('index');
    } else if (req.url === '/page1') {
        filePath = redirectToHtml('pages/page1');
    } else if (req.url === '/page2') {
        filePath = redirectToHtml('pages/page2');
    } else {
        // Serve static files (e.g., images, CSS, JavaScript)
        filePath = path.join(__dirname, req.url);
        const ext = path.extname(filePath).toLowerCase();

        switch (ext) {
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'application/javascript';
                break;
            default:
                contentType = 'text/plain';
        }
    }

    readFile(filePath, res, contentType);
});

// Concat the URL with `.html` extension
const redirectToHtml = (url) => {
    return `${url}.html`;
};

// Read file and handle the response
const readFile = (filePath, res, contentType) => {
    fsInstance.readFile(filePath, (error, data) => {
        if (error) {
            console.log(error);
            handleError(res);
            return;
        }

        res.writeHead(httpStatusInstance.StatusCodes.OK, {
            "Content-Type": contentType
        });
        res.end(data);
    });
};

const handleError = (res) => {
    if (!res.headersSent) {
        res.writeHead(httpStatusInstance.StatusCodes.NOT_FOUND, {
            "Content-Type": "text/html"
        });
    }
    res.end(`<h1>HTML file not found!</h1>`);
};

// Setup the server to listen on port 8080
httpServer.listen(portNumber, () => {
    console.log(`Server is listening on port ${portNumber}`);
});

/*      cd OneDrive\Images\Documents\WebAppLocal     */
/*      nodemon index.js                             */
/*      http://localhost:8080/                       */