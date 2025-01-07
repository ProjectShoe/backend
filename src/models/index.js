const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.products = require("./products.model");
db.order = require("./order.model");
db.timecards = require("./timecard.model.js");
db.leaveRequest = require("./leave-request.model.js");
db.customer = require("./customer.model.js");
db.order = require("./order.model.js");

module.exports = db;
