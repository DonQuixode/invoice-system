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

module.exports = User;