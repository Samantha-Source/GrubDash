const router = require("express").Router();
const controller = require("./dishes.controller");

// ERROR HANDLERS
const methodNotAllowed = require("../errors/methodNotAllowed");
// NOT SURE IF I NEED THESE 2 HERE.....
const errorHandler = require("../errors/errorHandler");
const notFound = require("../errors/notFound");


// TODO: Implement the /dishes routes needed to make the tests pass

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)
    



router.route("/:dishId")
    .get(controller.read)
    .all(methodNotAllowed)








module.exports = router;
