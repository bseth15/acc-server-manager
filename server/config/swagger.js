// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: 'ACC Server Manager API',
      description: 'ACC Server Manager API Information',
      contact: {
        name: 'Seth Brown',
        email: 'sethbrown.pe@gmail.com',
        url: 'https://github.com/bseth15',
      },
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:{port}/{basePath}',
        description: 'The development API server',
        variables: {
          port: {
            default: process.env.PORT,
            description: 'this value is assigned by the NODE_ENV environment variable',
          },
          basePath: {
            default: 'api',
          },
        },
      },
    ],
    basePath: '/api',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: ['JWT'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/api/*.js'],
};

module.exports = swaggerOptions;
