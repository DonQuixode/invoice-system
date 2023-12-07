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
    console.log(req.query)
    
    UserModel.find(req.query, (err, data) =>{
        if (err){
            if(err.kind == 'unauthorised'){
                res.status(401).send({"message": "You're not authorised"});
                return;
            }
            else if(err.kind == 'not_found'){
                res.status(404).send({"message": "user_id not found"});
                return;
            }
            else
            res.status(500).send({
                message: err.message|| "Some error"});

        }
        else
        res.send(data);
        return;
    })
};

exports.update = (req, res) =>{

};

exports.delete = (req, res) =>{

};