import express from 'express';
import bodyParser from 'body-parser';
import equipmentRoutes from './routes/equipment';
import requestRoutes from './routes/request';

const app = express();
app.use(bodyParser.json());

app.use('/api/equipments', equipmentRoutes);
app.use('/api/requests', requestRoutes);

app.get('/api/me', (_req, res) => res.json({ id: 1, name: 'Demo User' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening ${port}`));
