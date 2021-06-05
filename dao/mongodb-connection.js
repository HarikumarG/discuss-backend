const mongoose = require('mongoose');

const URL = "mongodb+srv://"+process.env.MONGODB_USER+":"+process.env.MONGODB_PASSWORD+"@cluster0.orhi1.mongodb.net/"+process.env.MONGODB_NAME+"?retryWrites=true&w=majority";

async function connection() {
    try {
        await mongoose.connect(URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        console.log("Mongodb connection successful");
    } catch (error) {
        console.log(error);
    }
}

function generateMongoObjectId() {
    return mongoose.Types.ObjectId();
}

module.exports = {connection, generateMongoObjectId};