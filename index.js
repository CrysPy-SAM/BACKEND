require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;  

app.get('/', (req, res) => {
  res.send('Hello World!');
});              
app.get('/about', (req, res) => {
  res.send('About Page');
});
app.get('/contact', (req, res) => {
    res.send('Contact Page');
    });
    
app.get('/services', (req, res) => {
    res.send('Services Page');
});

app.listen( process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); 