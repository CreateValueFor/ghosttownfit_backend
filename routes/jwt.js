const randToken = require('rand-token')
const jwt = require("jsonwebtoken")
const secreKey = require("../config/secretkey").secretKey
const options = require("../config/secretkey").options

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {

}