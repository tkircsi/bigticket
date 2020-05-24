import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/users/currentuser', (req, res) => {
  res.send('Health check!');
});

app.listen(3000, () => {
  console.log('Auth service is listening on port 3000...!!!!!');
});
