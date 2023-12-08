const isValidDate = (dateString) => {
    // Custom function to check if the date string is in the format DD/MM/YYYY
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(dateString);
};

exports.user_validation = (req, res, next) => {
    if (!req.body){
        res.status(400).send({
            messsage: "Content Cannot be empty"
        });
        return; 
    }
    const { name, address, role, username, password } = req.body;

    if (!name || !address || !role || !username || !password) {
        res.status(400).send({
            message: "Name, address, username, password and role are required fields"
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

exports.invoice_validation = (req, res, next) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty"
        });
        return;
    }
    const { payer_id, receiver_id, initiation_date, due_date, amount } = req.body;

    if (!payer_id || !receiver_id || !initiation_date || !due_date || !amount) {
        res.status(400).send({
            message: "Payer ID, Receiver ID, initiation date, due date, and amount are required fields"
        });
        return;
    }

    if (!Number.isInteger(payer_id) || !Number.isInteger(receiver_id)) {
        res.status(400).send({
            message: "Payer ID and Receiver ID must be integers"
        });
        return;
    }

    if (!isValidDate(initiation_date) || !isValidDate(due_date)) {
        res.status(400).send({
            message: "Initiation date and due date must be in the format DD/MM/YYYY"
        });
        return;
    }

    if (isNaN(amount) || !Number.isFinite(amount)) {
        res.status(400).send({
            message: "Amount must be a decimal number"
        });
        return;
    }
    next();
};

exports.payment_validation = (req, res, next) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty"
        });
        return;
    }
    const { invoice_id, payer_id, mode, amount } = req.body;

    if (!invoice_id || !payer_id || !mode || !amount) {
        res.status(400).send({
            message: "Invoice ID, Payer ID, Mode, and Amount are required fields"
        });
        return;
    }

    if (!Number.isInteger(invoice_id) || !Number.isInteger(payer_id)) {
        res.status(400).send({
            message: "Invoice ID and Payer ID must be integers"
        });
        return;
    }

    if (typeof mode !== 'string' || (mode !== 'online' && mode !== 'offline')) {
        res.status(400).send({
            message: "Mode must be either 'online' or 'offline'"
        });
        return;
    }

    if (isNaN(amount) || !Number.isFinite(amount)) {
        res.status(400).send({
            message: "Amount must be a decimal number"
        });
        return;
    }
    next();
};




