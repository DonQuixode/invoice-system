const pool = require('./db')
const today = new Date().toISOString().split('T')[0];

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


module.exports = Payment;