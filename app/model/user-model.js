const pool = require('./db')

//constructor

const User = function (userModel){
    this.name = userModel.name;
    this.address = userModel.address;
    this.role = userModel.role
}

User.create = (newUser, result) => {
    //adding data into db using the created database model being sent
    const insertUserQuery = `
    INSERT INTO users (name, address, role)
    VALUES ($1, $2, $3)
    RETURNING *;`;
  // Use the pool to query the database
  pool.query(insertUserQuery, [newUser.name, newUser.address, newUser.role], (err, res) => {
    if (err) {
      // Handle errors
      console.log({"ERROR: ": err});
      result(err, null);
    } else {
      // Log success and return the result
      console.log("Added User: ", { id: res.rows[0].user_id, ...newUser });
      result(null, { message: "success", id: res.rows[0].user_id, ...newUser });
    }
  });
};

User.find = (query, result) =>{
    console.log(query)
    pool.query(`SELECT role FROM users WHERE user_id=$1`, [query.user_id], (err, res) =>{
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
          }
        else if (res.rows.length == 0)
        {
            result({kind: "not_found"}, null);
        }

        else if (res.rows[0].role !='admin'){
            result({kind: "unauthorised"}, null);
        }

        else
            executeQuery();
    });

    function executeQuery(){
        const conditions = Object.keys(query).map(param =>{
            if (['name', 'address', 'role'].includes(param)) {
                return `${param} = '${query[param]}'`;
            
            }
            else if(param == 'user_id'){
                return null;
            }
            else if(param == 'userIdToCheck'){
                return `user_id = ${query[param]}`
            }
             else {
                return `${param} = ${query[param]}`;
            }
        }).filter(condition => condition!== null).join(' AND ');
        pool.query(`SELECT * FROM users WHERE ${conditions} `, [], (errr, ress)=>{
            if (errr) {
                console.log("ERROR: ", errr);
                result(errr, null);
              }
            if(ress.rows.length ==0){
                result({kind: "not_found"}, null);
        
            }
            else
            result(null, ress.rows);
        })    
    }
    }
   

module.exports = User;