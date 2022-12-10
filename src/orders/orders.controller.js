const path = require("path");
// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const notFound = require("../errors/notFound");
// TODO: Implement the /orders handlers needed to make the tests pass

function list(req, res, next) {
  res.json({ data: orders });
}

function findOrder(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.foundOrder = foundOrder;
    next();
  }
  // next(notFound)
  next({ status: 404, message: `Path not found: ${req.originalUrl}` });
}

function read(req, res, next) {
  res.json({ data: res.locals.foundOrder });
}

module.exports = {
  list,
  read: [findOrder, read],
};
