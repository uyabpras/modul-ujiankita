const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerSpec = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const app = express();
const modulRoute = require('./routes/routing');

app.use(express.json());
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api/modul', modulRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const db = require('./db/connect');
db.sequelize.sync({alter: true})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// require('./routes/routing')(app)

app.listen(port, () => {
  console.log(`Example app listening on port localhost:${port}/api-docs`);
})