const pool = require('../model/db')


exports.authenticate = (req, res, next) => {
    if(!req.headers.username || !req.headers.password){
        res.status(400).send({
            messsage: "username password cannot be empty"
        });
        return; 
    }
    const { username, password } = req.headers;

    pool.query(`SELECT role, user_id FROM users WHERE username=$1 AND password=$2`, [username, password], (err, ress) => {
        if (err) {
            res.status(500).send({
                message: "error authenticating"
            });
            return;
        } else {
            // Check if the query returned any results
            if (ress.rows.length > 0) {
                req.session.user = { role: ress.rows[0].role, user_id: ress.rows[0].user_id };
                next();
            } else {
                res.status(400).send({
                    message: "username password incorrect"
                });
            }
        }
    });
    

}   