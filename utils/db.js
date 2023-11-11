const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
	try {
		mongoose.connect(process.env.DB_URL);
		console.log('Connected to DB.');
	} catch (error) {
		throw error;
	}
};

const onDisconnectListener = () => {
	mongoose.connection.on('disconnect', () => {
		console.log('Disconnected from DB');
	});
};

module.exports = { connect, onDisconnectListener };
