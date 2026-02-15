import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! This is the AirGrab server.');
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
