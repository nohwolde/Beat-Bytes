import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fetch from 'node-fetch';

const app = express();

app.use(
    cors({
        allowedHeaders: '*',
        allowMethods: '*',
        origin: '*',
    }),
    morgan('dev'),
);

app.get('/', function(req, res) {
    // do something here.
    res.send('Hello World!');
});

app.get('/search*', async function(req, res){
    const results = await fetch('https://soundcloud.com/search/sounds?q=kanye');
    var buff = await results.body._outBuffer;
    res.send(await buff);
    console.log(await buff);
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

