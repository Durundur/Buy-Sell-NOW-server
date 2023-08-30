const express = require('express')
const cors = require('cors');
const config = require('config')
const passport = require('passport')
const db = require('./utils/db')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose')
const { Server } = require('socket.io')

const adsRoutes = require('./routes/api/v1/ads')
const authRoutes = require('./routes/api/v1/auth')
const conversationsRoutes = require('./routes/api/v1/conversations')
const errorHandler = require('./utils/errorHandler')
const settingsRoutes = require('./routes/api/v1/settings')
const ConversationChatModel = require('./models/ConversationChatModel')
const ConversationModel = require('./models/ConversationModel')

const app = express()
const PORT = process.env.PORT || 7000 || $PORT




app.use(express.static('static'))
app.use(cors({ origin: ["https://buysellnow.netlify.app", "http://localhost:3000"], credentials: true }));
app.use(express.json());


db.connect()
db.onDisconnectListener()
const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})
app.set('trust proxy', 1)
app.use(session({
    genid: function (req) {
        return uuidv4();
    },
    secret: config.get('secret'),
    resave: false,
    saveUninitialized: false,
    name: 'session_id',
    cookie: {
        maxAge: 60 * 60 * 1000,
         sameSite: 'none',
         secure: true,
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
app.use('/api/v1/conversations', conversationsRoutes)
app.use('/api/v1/settings/', settingsRoutes)


const io = new Server(server, {
    cors: {
        origin: ["https://buysellnow.netlify.app", "http://localhost:3000"], 
        credentials: true ,
    }
});

io.on('connection', (socket) => {
    
    socket.on('join room', (conversationId, callback) => {
        console.log(socket.id, 'join room', conversationId)
        if(!socket.rooms.has(conversationId.toString())){
            socket.rooms.forEach((room)=>{
                socket.leave(room.toString())
            })
            socket.join(conversationId.toString())
            callback({status: 'ok'})
        }
    })

    socket.on('room message', async (receivedMessage) => {
        const { conversationId, message, author } = receivedMessage;
        const newChatMessage = {
            message: message,
            author: author
        }
        try{
            await ConversationChatModel.findOneAndUpdate({_id: conversationId}, {$push: {messages: newChatMessage}}, { new: true })
            await ConversationModel.findOneAndUpdate({_id: conversationId}, {$set: {lastMessage: message}});
            socket.to(conversationId.toString()).emit('room message', newChatMessage);
        }
        catch(e){
            console.log(e)
        } 
    })

});

app.use(errorHandler);





