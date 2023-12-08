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
  
  Invoice.find = (req, result) => {
    executeQuery();

    function executeQuery() {
        const conditions = Object.keys(req.query).map(param => {
            if (['status'].includes(param)) {
                return `${param} = '${req.query[param]}'`;
            } else if (param === 'due_date' || param === 'inititation_date') {
                // Convert dueDate from DD/MM/YYYY to YYYY-MM-DD
                date_string = parseDate(req.query[param])
                return `${param} = '${dateString}'`;
            } else {
                return `${param} = ${req.query[param]}`;
            }
        }).filter(condition => condition !== null).join(' AND ');

        pool.query(`SELECT * FROM invoices WHERE ${conditions} `, [], (err, res) => {
            if (err) {
                console.log("ERROR: ", err);
                result(err, null);
            }

            if (res.rows.length === 0) {
                result({ kind: "not_found" }, null);
            } else {
                if(req.session.user.role ==='admin')
                result(null, res.rows);
                else if(req.session.user.role=='receiver'){
                  const filteredInvoices = res.rows.filter(invoice => invoice.receiver_id == req.session.user.user_id);
                  if(filteredInvoices.length == 0){
                    result({kind: "unathorised"}, null);
                  }
                  else
                  result(null, filteredInvoices)
                }
                else
                result({kind: "unathorised"}, null)

            }
        });
    }
};
  

  module.exports = Invoice
  