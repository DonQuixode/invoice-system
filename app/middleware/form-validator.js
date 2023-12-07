exports.user_validation = (req, res, next) => {
    if (!req.body){
        res.status(400).send({
            messsage: "Content Cannot be empty"
        });
        return; 
    }
    const { name, address, role } = req.body;

    if (!name || !address || !role) {
        res.status(400).send({
            message: "Name, address, and role are required fields"
        });
        return;
    }

    // Valid roles: admin, payer, receiver
    const validRoles = ["admin", "payer", "receiver"];
    if (!validRoles.includes(role)) {
        res.status(400).send({
            message: "Invalid role. Valid roles are: admin, payer, receiver"
        });
        return;
    }

    // If all checks pass, move to the next middleware
    next();
}

exports.user_fetch_validation = (req, res, next) => {
    if (!req.query.user_id) {
        res.status(400).send({
            message: "user_id parameter is required"
        });
        return;
    }

    const allowedRoles = ['payer', 'admin', 'receiver'];

    if (
        !req.query.userIdToCheck &&
        !req.query.address &&
        !req.query.name &&
        !req.query.role
    ) {
        res.status(400).send({
            message: "At least one of userTIdoCheck, address, name, or role parameters is required"
        });
        return;
    }

    if (req.query.role && !allowedRoles.includes(req.query.role)) {
        res.status(400).send({
            message: "Invalid role parameter. Allowed roles are payer, admin, and receiver"
        });
        return;
    }

    // If all checks pass, move to the next middleware
    next();
}