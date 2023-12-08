const pool = require('./db')

//constructor

const User = function (userModel){
    this.name = userModel.name;
    this.address = userModel.address;
    this.role = userModel.role;
    this.username = userModel.username;
    this.password = userModel.password
}

User.create = (newUser, result) => {
    //adding data into db using the created database model being sent
    const insertUserQuery = `
    INSERT INTO users (name, address, role, username, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`;
  // Use the pool to query the database
  pool.query(insertUserQuery, [newUser.name, newUser.address, newUser.role, newUser.username, newUser.password], (err, res) => {
    if (err) {
      // Handle errors
      if(err.constraint == 'unique_username')
      result({kind: "duplicate"}, null);
        else{
            console.log({"ERROR: ": err});
      result(err, null);
        }
      
    } else {
      // Log success and return the result
      console.log("Added User: ", { id: res.rows[0].user_id });
      result(null, { message: "success", id: res.rows[0].user_id});
    }
  });
};

User.find = (query, result) =>{
    console.log(query)
    executeQuery();
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
        pool.query(`SELECT user_id, name, address, role FROM users WHERE ${conditions} `, [], (errr, ress)=>{
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