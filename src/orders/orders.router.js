const router = require("express").Router();
const controller = require("./orders.controller");

// ERROR HANDLERS
const methodNotAllowed = require("../errors/methodNotAllowed");


// ROUTES
router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)


router.route("/:orderId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed)




module.exports = router;
