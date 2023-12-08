const pool = require('./db')
const today = new Date().toISOString().split('T')[0];
const moment = require('moment'); // Import the moment library for date parsing


function parseDate(dateString) {
    // Parse the date string in DD/MM/YYYY format
    return moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }

async function getInvoice(invoice_id) {
    try {
      const getInvoiceQuery = 'SELECT * FROM invoices WHERE invoice_id = $1';
      const { rows } = await pool.query(getInvoiceQuery, [invoice_id]);
      return rows[0];
    } catch (error) {
      throw error; // Rethrow the error to be caught by the calling function
    }
  }
async function checkPaymentStatus(invoice_id) {
    try {
        const getPaymentQuery = 'SELECT * FROM payments WHERE invoice_id = $1';
        const { rows } = await pool.query(getPaymentQuery, [invoice_id]);
        return rows[0];
        } catch (error) {
            throw error; // Rethrow the error to be caught by the calling function
        }
    }
async function updateInvoiceStatus(invoice_id){
    try{
        const updateQuery = 'UPDATE invoices SET status = $1 WHERE invoice_id = $2';
        await pool.query(updateQuery, ['COMPLETED', invoice_id]);
    } catch (error){
        throw error;
    }
}

async function insertPayment(newPayment) {
const insertInvoiceQuery = `
    INSERT INTO payments (payer_id, invoice_id, mode, date, amount)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`;

const { rows } = await pool.query(
    insertInvoiceQuery,
    [
    newPayment.payer_id,
    newPayment.invoice_id,
    newPayment.mode,
    newPayment.date,
    newPayment.amount
]
);
  
    return { "invoice_id": rows[0].payment_id, ...newPayment };
  }

//contructor
const Payment = function(paymentModel){
    this.invoice_id = paymentModel.invoice_id;
    this.payer_id = paymentModel.payer_id;
    this.mode = paymentModel.mode;
    this.amount = paymentModel.amount;
    this.date = today;
}

Payment.create = async (newPayment, result) => {
    console.log(newPayment);

    try {
        let paymentStatus;
        try {
            paymentStatus = await checkPaymentStatus(newPayment.invoice_id);
            paymentStatus = paymentStatus || [];

        } catch (error) {
            // Handle the error when invoice_id doesn't exist in payments table
            console.error("Error during checkPaymentStatus:", error);
            paymentStatus = [];
        }

        if (paymentStatus.length !== 0) {
            result({ kind: "payment done" }, null);
            return;
        }

        try {
            const invoiceDetails = await getInvoice(newPayment.invoice_id);
            console.log(invoiceDetails);

            if (invoiceDetails.payer_id === newPayment.payer_id) {
                if (invoiceDetails.amount == newPayment.amount) {
                    const paymentDate = new Date(newPayment.date);
                    const dueDate = new Date(invoiceDetails.due_date);

                    if (paymentDate <= dueDate) {
                        const insertedPayment = await insertPayment(newPayment);
                        await updateInvoiceStatus(newPayment.invoice_id);
                        console.log("Added Payment: ", insertedPayment);
                        result(null, { message: "success", ...insertedPayment });
                    } else {
                        result({ kind: "due_date" }, null);
                    }
                } else {
                    result({ kind: "amount_invalid" }, null);
                }
            } else {
                result({ kind: "payer_id mismatch" }, null);
            }
        } catch (error) {
            // Log the error or take appropriate action
            console.error("Error during invoiceDetails retrieval:", error);
            result({ kind: "invoice_id mismatch" }, null);
        }
    } catch (error) {
        // Log the error or take appropriate action
        console.error("Error during checkPaymentStatus:", error);
        result(error, null);
    }
};

Payment.find = (query, result) => {
    
        const conditions = Object.keys(query).map(param => {
            if (['mode'].includes(param)) {
                return `${param} = '${query[param]}'`;
            } else if (param === 'date') {
                // Convert dueDate from DD/MM/YYYY to YYYY-MM-DD
                date_string = parseDate(query[param])
                return `${param} = '${date_string}'`;
            } else {
                return `${param} = ${query[param]}`;
            }
        }).filter(condition => condition !== null).join(' AND ');
        console.log(conditions)
        pool.query(`SELECT * FROM payments WHERE ${conditions} `, [], (err, res) => {
            if (err) {
                console.log("ERROR: ", err);
                result(err, null);
            }

            if (res.rows.length === 0) {
                result({ kind: "not_found" }, null);
            } else {
                result(null, res.rows)
            }
        });
    
    
};
module.exports = Payment;