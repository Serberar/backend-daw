
const { port } = require('./config');
const app = require('./infrastructure/http/app');

app.listen(port, () => console.log(`http://localhost:${port}`));
