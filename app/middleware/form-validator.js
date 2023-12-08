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

exports.payment_fetch_validation = (req, res, next) => {
    console.log("HERE",req.query);

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    const { payment_id, invoice_id, mode, date, amount, payer_id } = req.query;
    // Check if none of the parameters are present
    if (Object.keys(req.query).length === 0 || (!payment_id && !invoice_id && !mode && !date && !amount && !payer_id)) {
        res.status(400).send({
            message: "At least one of the parameters (payment_id, invoice_id, mode, date, amount, payer_id) is required"
        });
        return;
    }

    // If payment_id is present, check if it's a valid integer
    else if (payment_id && (isNaN(parseInt(payment_id)) || !Number.isInteger(parseFloat(payment_id)))) {
        res.status(400).send({
            message: "Invalid payment_id parameter. Must be a valid integer"
        });
        return;
    }

    // If invoice_id is present, check if it's a valid integer
    else if (invoice_id && (isNaN(parseInt(invoice_id)) || !Number.isInteger(parseFloat(invoice_id)))) {
        res.status(400).send({
            message: "Invalid invoice_id parameter. Must be a valid integer"
        });
        return;
    }

    // If mode is present, check if it's either online or offline
    else if (mode && (mode !== 'online' && mode !== 'offline')) {
        res.status(400).send({
            message: "Invalid mode parameter. Must be either 'online' or 'offline'"
        });
        return;
    }

    // If date is present, check if it's in DD/MM/YYYY format
    else if (date && !date.match(dateRegex)) {
        res.status(400).send({
            message: "Invalid date parameter. Must be in DD/MM/YYYY format"
        });
        return;
    }

    // If amount is present, check if it's a valid decimal
    else if (amount && isNaN(parseFloat(amount))) {
        res.status(400).send({
            message: "Invalid amount parameter. Must be a valid decimal"
        });
        return;
    }

    // If all checks pass, move to the next middleware
    else
    next();
};

exports.invoice_fetch_validation = (req, res, next) => {
    const { invoice_id, payer_id, receiver_id, initiation_date, due_date, amount, status } = req.query;

    // Check if at least one parameter is present
    if (!invoice_id && !payer_id && !receiver_id && !initiation_date && !due_date && !amount && !status) {
        res.status(400).send({
            message: "At least one of the parameters (invoice_id, payer_id, receiver_id, initiation_date, due_date, amount, status) is required"
        });
        return;
    }

    // If invoice_id is present, check if it's a valid integer
    if (invoice_id && (isNaN(parseInt(invoice_id)) || !Number.isInteger(parseFloat(invoice_id)))) {
        res.status(400).send({
            message: "Invalid invoice_id parameter. Must be a valid integer"
        });
        return;
    }

    // If payer_id is present, check if it's a valid integer
    if (payer_id && (isNaN(parseInt(payer_id)) || !Number.isInteger(parseFloat(payer_id)))) {
        res.status(400).send({
            message: "Invalid payer_id parameter. Must be a valid integer"
        });
        return;
    }

    // If receiver_id is present, check if it's a valid integer
    if (receiver_id && (isNaN(parseInt(receiver_id)) || !Number.isInteger(parseFloat(receiver_id)))) {
        res.status(400).send({
            message: "Invalid receiver_id parameter. Must be a valid integer"
        });
        return;
    }

    // If initiation_date is present, check if it's in DD/MM/YYYY format
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (initiation_date && !initiation_date.match(dateRegex)) {
        res.status(400).send({
            message: "Invalid initiation_date parameter. Must be in DD/MM/YYYY format"
        });
        return;
    }

    // If due_date is present, check if it's in DD/MM/YYYY format
    if (due_date && !due_date.match(dateRegex)) {
        res.status(400).send({
            message: "Invalid due_date parameter. Must be in DD/MM/YYYY format"
        });
        return;
    }

    // If amount is present, check if it's a valid decimal
    if (amount && isNaN(parseFloat(amount))) {
        res.status(400).send({
            message: "Invalid amount parameter. Must be a valid decimal"
        });
        return;
    }

    // If status is present, check if it's one of the specified values
    const validStatusValues = ["PENDING", "REJECTED", "COMPLETED"];
    if (status && !validStatusValues.includes(status.toUpperCase())) {
        res.status(400).send({
            message: "Invalid status parameter. Allowed values are PENDING, REJECTED, COMPLETED"
        });
        return;
    }

    // If all checks pass, move to the next middleware
    next();
}






