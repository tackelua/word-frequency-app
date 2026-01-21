const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otpExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user' // 'user' or 'admin'
    }
});

module.exports = User;
