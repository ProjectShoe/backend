const EmployeeRoute = require("./employee.routes");
const AuthRoute = require("./auth.routes");
const ProductRoute = require("./products.routes");
const TimeCardRoute = require("./timecard.routes.js");
const LeaveRequest = require("./leaveRequest.routes.js");
const CustomerRoute = require("./customer.routes");
const OrderRoute = require("./order.routes");

const routes = (app) => {
  app.use("/employee", EmployeeRoute);
  app.use("/auth", AuthRoute);
  app.use("/product", ProductRoute);
  app.use("/time-card", TimeCardRoute);
  app.use("/leave-request", LeaveRequest);
  app.use("/customer", CustomerRoute);
  app.use("/order", OrderRoute);

};

module.exports = routes;
