import 'dotenv/config'
import express from 'express';
import "reflect-metadata"
import helmet from 'helmet';
import { errorHanlder } from '@/middleware/error.middleware';
import { route } from '@/routes';
import { AppDataSource, dbFirstStartQuery } from '@/database/db.datasource';
import { formatResponse } from '@/middleware/format-response.middleware';
import { swaggerInit } from '@/utils/documentation/swagger.util';
import { workerService } from '@/container/worker.container';
const cors = require('cors')
const config = require('config');
const morgan = require('morgan')
const corsOption = config.get('cors');
const useHelmet = config.get('helmet');
const morganFormat = config.get('morganFormat');
const enviroment = config.get('enviroment');
const server_config = config.get('server');
const root_api = config.get('API_VERSION');
const app = express();

//Middleware
app.use(
  express.urlencoded({
      extended: true,
  }),
);
app.use(express.json());
app.use(morgan(morganFormat || 'dev'))
app.use(cors(corsOption))
if (useHelmet) {
  app.use(helmet());
}

//Disable console.log
if (enviroment === 'production') {
  console.log = function() {}
}

//Swagger init
const swagger_config = config.get('swagger');

if (swagger_config.enable){
  swaggerInit(app, root_api, server_config.port || 3000)
}

//Worker init
//workerService.init();

//Format response
app.use(formatResponse)

//Route
route(app, root_api);

//Error handler
app.use(errorHanlder)

//db connection
AppDataSource
  .initialize()
  .then(async () => {
    console.log('Database is connected');
    await dbFirstStartQuery();
    const port = server_config.port || 3000;  
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port} in ${enviroment} mode`)
    });
  })
  .catch((error) => {
    console.log(error)
  });


 