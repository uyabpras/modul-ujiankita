const swaggerJSDoc = require('swagger-jsdoc');

// Definisikan konfigurasi Swagger
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'soal API',
        description: 'API untuk soal service',
        version: '1.0.0',
      },
    },
    apis: ['./controller/*.js'],
  };
  
  // Inisialisasi Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;