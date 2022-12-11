const path = require("path");
// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const notFound = require("../errors/notFound");
// TODO: Implement the /orders handlers needed to make the tests pass

// GET ("/orders")
function list(req, res, next) {
  res.json({ data: orders });
}

// FIND MATCHING ORDER BY ID
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

// GET ("/orders/orderId")
function read(req, res, next) {
  res.json({ data: res.locals.foundOrder });
}

function validateOrder(req, res, next){
    const { data: {id, deliverTo, mobileNumber, dishes} ={} } = req.body;
    const newOrder = {
        id,
        deliverTo,
        mobileNumber,
        dishes,
    }

    if(!deliverTo || deliverTo == ""){
        return next({status:400, message:"Order must include a deliverTo"})
    }
    if(!mobileNumber || mobileNumber == ""){
        return next({status:400, message:"Order must include a mobileNumber"})
    }
    if(!dishes){
        return next({status:400, message:"Order must include a dish"})
    }
    if(Array.isArray(dishes) == false || dishes.length < 1){
        return next({status:400, message:"Order must include at least one dish"})
    }
    //NEED TO CHECK FOR THE INDIVIDUAL DISH PROPERTIES
    //IMPORT DISHES CONTROLLER FUNCTION VALIDATEDISH
    res.locals.newOrder = newOrder;
    next()
}

function validateDishForOrder(req,res,next){
    const {dishes} = res.locals.newOrder;
    for(let dish of dishes){
        if(!dish.quantity || dish.quantity === 0){
            next({status:400, message:`Dish ${dish.index} must have a quantity that is an integer greater than 0`})
        }
    }
    next()
}

function create(req,res,next){
    const newOrder = res.locals.newOrder;
    newOrder.id = nextId()
    orders.push(newOrder);
    res.status(201).json({ data:newOrder })
}


module.exports = {
  list,
  read: [findOrder, read],
  create: [validateOrder, validateDishForOrder, create]
};
