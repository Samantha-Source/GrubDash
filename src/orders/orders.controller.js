const path = require("path");
// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");



// GET ("/orders")
function list(req, res) {
  res.json({ data: orders });
};

// FIND MATCHING ORDER BY ID
function findOrder(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.foundOrder = foundOrder;
    next();
  };
  return next({ status: 404, message: `Path not found: ${req.originalUrl}` });
};

// GET ("/orders/orderId")
function read(req, res, next) {
  res.json({ data: res.locals.foundOrder });
};

// VALIDATE ORDER INFO FOR CREATE & UPDATE
function validateOrderForm(req, res, next) {
    const { data: {id, deliverTo, mobileNumber, status, dishes} = {} } = req.body;
    const orderForm = {
        id,
        deliverTo,
        mobileNumber,
        status,
        dishes,
    };

    if(!deliverTo || deliverTo == ""){
        return next({status:400, message:"Order must include a deliverTo"})
    };
    if(!mobileNumber || mobileNumber == ""){
        return next({status:400, message:"Order must include a mobileNumber"})
    };
    if(!dishes){
        return next({status:400, message:"Order must include a dish"})
    };
    if(Array.isArray(dishes) == false || dishes.length < 1){
        return next({status:400, message:"Order must include at least one dish"})
    };
    res.locals.orderForm = orderForm;
    return next();
}

// VALIDATE DISHES IN AN ORDER
function validateDishForOrder(req, res, next) {
    const {dishes} = res.locals.orderForm;
    for(let dish of dishes){
        if(!dish.quantity || dish.quantity === 0 || !Number.isInteger(dish.quantity)){
            let dishIndex = dishes.indexOf(dish);
            next({status:400, message:`Dish ${dishIndex} must have a quantity that is an integer greater than 0`});
        };
    };
    next();
};

// POST ("/orders")
function create(req, res) {
    const newOrder = res.locals.orderForm;
    newOrder.id = nextId();
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
};

// DELETE ("/orders/:orderId")
function destroy(req, res, next) {
    const { orderId } = req.params;
    const { status } = res.locals.foundOrder;
    const index = orders.findIndex((order) => order.id === orderId);

    if(status !== 'pending'){
        return next({status:400, message:"An order cannot be deleted unless it is pending."});
    }
    const deletedOrders = orders.splice(index,1);
    res.sendStatus(204);
};

// VALIDATE ORDER FOR UPDATE
function validateUpdate(req, res, next) {
    const { id, status } = res.locals.orderForm;
    const { orderId } = req.params;

    if(!res.locals.orderForm){
        return next({status:404, message:"Order not found"});
    };
    if(!status || status === ""){
        return next({status:400, message:"Order must have a status of pending, preparing, out-for-delivery, delivered"});
    };
    if(status !== "pending" && status !== "preparing" && status !== "out-for-delivery"){
        return next({status:400, message:"Order must have a status of pending, preparing, out-for-delivery"});
    };
    if(status === "delivered"){
        return next({status:400, message:"A delivered order cannot be changed"});
    };
    if(id && id !== orderId){
        return next({status:400, message:`Order id does not match route id. Order id:${id}, Route:${orderId}`});
    };
    next();
};

// PUT ("/orders/:orderId")
function update(req, res){
    const { deliverTo, mobileNumber, dishes } = res.locals.orderForm;
    const foundOrder = res.locals.foundOrder;

    foundOrder.deliverTo = deliverTo;
    foundOrder.mobileNumber = mobileNumber;
    foundOrder.dishes = dishes;

    res.status(200).json({data:foundOrder});
};



module.exports = {
  list,
  read:[findOrder, read],
  create:[validateOrderForm, validateDishForOrder, create],
  delete:[findOrder, destroy],
  update:[findOrder, validateOrderForm, validateDishForOrder, validateUpdate, update]
};
