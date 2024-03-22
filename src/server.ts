import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/userHandlers';
import productRoutes from './handlers/productHandlers';
import orderRoutes from './handlers/orderHandlers';
import dashboardRoutes from './handlers/dashboardHandlers';
import cors from 'cors';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

const corsOptions = {
  origin: '*', // Name of the domain (can be changed in the future)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);
dashboardRoutes(app);

export default app;
