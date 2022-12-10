const path = require("path");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// ERROR HANDLERS ///HOW TO USE THEM???????
const notFoundHandler = require("../errors/notFound");
const errorHandler = require("../errors/errorHandler")



// GET ("/dishes")
function list(req, res, next) {
    res.json({ data: dishes });
  }

// FIND DISH BY ID
function findDish(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.foundDish = foundDish;
    return next();
  }
//   next(notFound);    // CAN WE USE THE IMPORT?
//   next({ status: 404, message: `Path not found: ${req.originalUrl}` })
    next({ status: 404, message: `Dish does not exist ${dishId}`});
}


// GET ("/dishes/:dishId")
function read(req, res, next) {
    res.json({ data:res.locals.foundDish })
}

function validateDish(req, res, next){
    const { data: {id, name, description, price, image_url} ={} } = req.body;
    const newDish = {
        id,
        name,
        description,
        price,
        image_url
        }

    if(!name || name == ""){
        return next({status:400, message:"Dish must include a name"})
    }
    if(!description || description == ""){
        return next({status:400, message:"Dish must include a description"})
    }
    if(!price){
        return next({status:400, message:"Dish must include a price"})
    }
    if(price <= 0){
        return next({status:400, message:"Dish must have a price that is an integer greater than 0"})
    }
    if(!Number.isInteger(price)){
        return next({status:400, message:"Dish must have a price that is an integer greater than 0"})
    }
    if(!image_url || image_url == "" ){
        return next({status:400, message:"Dish must include a image_url"})
    }
    res.locals.newDish = newDish;
    next()
}


// POST ("/dishes")
function create(req, res, next){
    const newDish = res.locals.newDish;
    const newId = nextId()
    newDish.id = newId;
    dishes.push(res.locals.newDish);
    res.status(201).json({ data:res.locals.newDish })
}

// PUT ("/dishes/:dishId")
function update(req, res, next){
    const { data: {id, name, description, price, image_url} ={} } = req.body;
    const {dishId} = req.params;
    const foundDish = res.locals.foundDish;
    const newDish = res.locals.newDish

    if(newDish.id){
        if(newDish.id !== dishId){
            return next({status:511, message:`Dish id does not match route id.  Dish: ${newDish.id}, Route:${dishId}`})
        }
    }

    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price,
    foundDish.image_url = image_url;

    res.status(201).json({ data:foundDish })
    // if id is present it must match :dishId
}





module.exports = {
    list,
    read:[findDish, read],
    create:[validateDish, create],
    update:[findDish, validateDish, update]
};
