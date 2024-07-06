const bcrypt = require("bcrypt")

async function hashPassword (plainPassword,salt){
    return bcrypt.hash(plainPassword,salt)
}

async function comparePassword (plainPassword,hashPassword){
    return bcrypt.compare(plainPassword,hashPassword)
}

module.exports = {hashPassword,comparePassword}