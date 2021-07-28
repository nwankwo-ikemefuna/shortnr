"use strict";

require('dotenv').config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// middlewares
import error from './middlewares/error';

const app = express();

//routes
import appRoutes from './routes';

//express stuff
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//utils
//cors
const corsOptions = {
	//allowed domains
	origin: [ 
		'http://localhost:5000',
		'http://localhost:5001',
	],
	methods: 'HEAD,GET,POST',
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(helmet()); //for additional protection 

//route delegations
appRoutes(app);

//unknown route
app.all('*', function(_req: Request, res: Response) {
	res.status(404).send('Route not found!');
});

//handle errors
app.use(error);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started at port ${port}`));