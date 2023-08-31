import app from '../index.js';
import { config } from 'dotenv';
config({ path: process.ENV });

config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(
    `Library management is listening in ${process.env.NODE_ENV} mode on PORT `,
    port
  );
});
