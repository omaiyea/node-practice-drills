//file with controller code
const app = require('./app');

// server needs to listen to a specific port (ex. 8000) so that requests to that port are correctly routed to the server
app.listen(8000, () => {
    console.log('express server is listening on port 8000!');
});