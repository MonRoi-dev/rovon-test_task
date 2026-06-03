import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { deliveryRoutes } from './routes/delivery.routes';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const app = express();

//Раз это просто тестовый сценарий, по безопасности особо не буду париться
app.use(express.json({ limit: '100kb' }));

//Это просто для красоты, чтобы можно было открыть md документацию сразу в браузере
app.get('/', async (req, res) => {
  try {
    const readmePath = path.join(process.cwd(), 'README.md');
    const content = await fs.readFile(readmePath, 'utf-8');
    const rawHtml = await marked.parse(content);
    const cleanHtml = purify.sanitize(rawHtml);
    
    const pageHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Microservice Documentation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css">
  <style>
    body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; }
    @media (max-width: 767px) { body { padding: 15px; } }
  </style>
</head>
<body class="markdown-body">
  ${cleanHtml}
</body>
</html>`;
    
    res.type('text/html').send(pageHtml);
  } catch (error) {
    res.status(404).send('README.md not found');
  }
});

//Так как это микросервис добавл ему хэлзчек
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use('/api', deliveryRoutes);

export { app };
