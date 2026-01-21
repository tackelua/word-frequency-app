const User = require('./User');
const SavedWord = require('./SavedWord');
const Feedback = require('./Feedback');
const sequelize = require('../db');

User.hasMany(SavedWord, { onDelete: 'CASCADE' });
SavedWord.belongsTo(User);

Feedback.belongsTo(User); // Optional association if logged in

// Sync DB
sequelize.sync();

module.exports = {
    User,
    SavedWord,
    Feedback,
    sequelize
};
