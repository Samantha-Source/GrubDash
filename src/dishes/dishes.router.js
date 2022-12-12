const router = require("express").Router();
const controller = require("./dishes.controller");

// ERROR HANDLERS
const methodNotAllowed = require("../errors/methodNotAllowed");



// ROUTES

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)
    


router.route("/:dishId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed)




module.exports = router;
