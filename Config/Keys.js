module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    MONGO_URI: this.ENV == 'production' ? process.env.MONGO_URI : 'mongodb://localhost/Ticket',
    JWT_SECRET: this.ENV == 'production' ? process.env.JWT_SECRET : 'jsonWebTokenSecret',
}