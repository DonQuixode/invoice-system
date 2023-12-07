const UserModel = require('../model/user-model');

exports.addNew = (req, res) => {
    const user_model = new UserModel({
        name : req.body.name,
        address: req.body.address,
        role: req.body.role
    })
    UserModel.create(user_model, (err, data) =>{

        if(err){
            if(err.kind == 'duplicate'){
                res.status(200).send({
                    message: "username exists"
                });
                return;
            }
            else{
                res.status(500).send({
                    message: err.message|| "Some error"});
                    return;
            }
        }
    else
    res.send(data);
    })
};

exports.fetch = (req, res) =>{

};

exports.update = (req, res) =>{

};

exports.delete = (req, res) =>{

};