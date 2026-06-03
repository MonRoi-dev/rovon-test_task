import { app } from './app';

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

app.listen(Number(PORT), HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
