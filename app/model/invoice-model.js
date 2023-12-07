const pool = require('./db')
const moment = require('moment'); // Import the moment library for date parsing

function parseDate(dateString) {
  // Parse the date string in DD/MM/YYYY format
  return moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
}

//constructor
const Invoice = function(invoiceModel){
    this.payer_id = invoiceModel.payer_id;
    this.receiver_id = invoiceModel.receiver_id;
    this.initiation_date = invoiceModel.initiation_date;
    this.due_date = invoiceModel.due_date;
    this.amount = invoiceModel.amount;
    this.status = "PENDING";
}

async function getUserRole(user_id) {
    try {
      const getUserRoleQuery = 'SELECT role FROM users WHERE user_id = $1';
      const { rows } = await pool.query(getUserRoleQuery, [user_id]);
      return rows[0].role;
    } catch (error) {
      throw error; // Rethrow the error to be caught by the calling function
    }
  }
  
  async function insertInvoice(newInvoice) {
    const insertInvoiceQuery = `
      INSERT INTO invoices (payer_id, receiver_id, initiation_date, due_date, amount, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
  
    const { rows } = await pool.query(
      insertInvoiceQuery,
      [
        newInvoice.payer_id,
        newInvoice.receiver_id,
        parseDate(newInvoice.initiation_date),
        parseDate(newInvoice.due_date),
        newInvoice.amount,
        newInvoice.status
      ]
    );
  
    return { "invoice_id": rows[0].invoice_id, ...newInvoice };
  }
  
  Invoice.create = async (user_id, newInvoice, result) => {
    try {
      const userRole = await getUserRole(user_id);
      console.log("userRole", userRole);
  
      if (userRole === 'admin' || (userRole === 'receiver' && user_id === newInvoice.receiver_id)) {
        try {
          const payer_role = await getUserRole(newInvoice.payer_id);
          const receiver_role = await getUserRole(newInvoice.receiver_id);
  
          if (payer_role === 'payer' && receiver_role === 'receiver') {
            const insertedInvoice = await insertInvoice(newInvoice);
            console.log("Added Invoice: ", insertedInvoice);
            result(null, { message: "success", ...insertedInvoice });
          } else {
            console.log("Invalid roles for payer or receiver.");
            result({ kind: "invalid_roles" }, null);
          }
        } catch (errorPayerReceiver) {
          console.error(errorPayerReceiver);
          result({kind: "payer or receiver id wrong"}, null);
        }
      } else {
        console.log("Unauthorized");
        result("unauthorized", null);
      }
    } catch (errorUser) {
      console.error(errorUser);
      result({kind: "user_id wrong"}, null);
    }
  };
  

  module.exports = Invoice
  