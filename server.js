require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const buildingProjectRoutes = require('./routes/buildingProjectRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes');
const testimoniesRoutes = require('./routes/testimoniesRoutes');
const contactRoutes = require('./routes/contactRoutes');
const academyRoutes = require('./routes/academyRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const rehabRoutes = require('./routes/rehabRoutes');
const actsFellowshipRoutes = require('./routes/actsFellowshipRoutes');
const resourcesRoutes = require('./routes/resourcesRoutes');
const donateRoutes = require('./routes/donateRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

connectDB();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
  })
);

app.get('/', (req, res) => {
  res.send('VFM CMS API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/building-project', buildingProjectRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/testimonies', testimoniesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/rehab', rehabRoutes);
app.use('/api/acts-fellowship', actsFellowshipRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/donate', donateRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`VFM CMS server started on port ${PORT}`));
