const InvoiceModel = require('../model/invoice-model');

exports.add = (req, res) => {
    const invoice_model = new InvoiceModel({
        payer_id : req.body.payer_id,
        receiver_id : req.body.receiver_id,
        initiation_date : req.body.initiation_date,
        due_date : req.body.due_date,
        amount : req.body.amount
    })
    if(req.session.user.role!='admin'){
        if (req.session.user.user_id != req.body.receiver_id && req.session.user.role == 'receiver'){
            res.status(403).send({
                message: "Receiver can add only thier invoice"
            });
            return;
        }
    }
    InvoiceModel.create(invoice_model, (err, data) =>{

        if(err){
            if(err.kind == 'invalid_roles'){
                res.status(200).send({
                    message: "Invalide payer or receiver id"
                });
                return;
            }
            else if(err.kind == "payer or receiver id wrong"){
                res.status(404).send({
                    message: "payer or receiver id wrong"
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
    InvoiceModel.find(req, (err, data) =>{
        if (err){
            if(err.kind == 'unathorised'){
                res.status(401).send({"message": "You're not authorised"});
                return;
            }
            else if(err.kind == 'not_found'){
                res.status(404).send({"message": "payment not found"});
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
}

exports.updateStatus = (req, res) =>{

}

exports.delete = (req, res) =>{

}