const express = require('express')
const cors = require('cors');
const config = require('config')
const passport = require('passport')
const db = require('./utils/db')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose')

const adsRoutes = require('./routes/api/v1/ads')
const authRoutes = require('./routes/api/v1/auth')
const errorHandler = require('./utils/errorHandler')


const app = express()
const PORT = process.env.PORT || 7000 || $PORT


app.use(express.static('static'))
app.use(cors({ origin: ["https://buysellnow.netlify.app", "http://localhost:3000"], credentials: true }));
app.use(express.json());


db.connect()
db.onDisconnectListener()
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})
app.set('trust proxy', 1)
app.use(session({
    genid: function(req) {
        return uuidv4();
    },
    secret: config.get('secret'),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000,
        //  sameSite: 'none',
        //  secure: true,
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        stringify: false
    })
}));

app.use(passport.initialize());
app.use(passport.session());



app.use('/api/v1/ads', adsRoutes)
app.use('/api/v1/auth', authRoutes)
app.use(errorHandler);





