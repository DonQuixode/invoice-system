const PaymentModel = require('../model/payment-model');

exports.add = (req, res) =>{
    const payment_model = new PaymentModel({
        invoice_id : req.body.invoice_id,
        payer_id : req.body.payer_id,
        mode : req.body.mode,
        amount : req.body.amount,
    })
    if(req.session.user.role!='admin'){
        if (req.session.user.user_id != req.body.payer_id && req.session.user.role!='payer'){
            res.status(403).send({
                message: "Only Payer is allowed to pay"
            });
        }
    }
    PaymentModel.create (payment_model, (err, data) =>{
        if(err){
            if(err.kind == 'due_date'){
                res.status(200).send({
                    message: "Due date over"
                });
                return;
            }
            else if(err.kind == 'amount_invalid'){
                res.status(404).send({
                    message: "Invalid Amount"
                });
                return;
            }
            else if(err.kind == 'payer_id mismatch'){
                res.status(404).send({
                    message: "Invalid payer id"
                });
                return;
            }
            else if(err.kind == 'invoice_id mismatch'){
                res.status(404).send({
                    message: "Invalid invoice id"
                });
                return;
            }
            else if(err.kind == 'payment done'){
                res.status(200).send({
                    message: "Payment Done"
                });
                return;
            }
            else {
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
    
    PaymentModel.find(req.query, req.session.user, (err, data) =>{
        if (err){
            if(err.kind == 'unauthorised'){
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
};

exports.updateStatus = (req, res) =>{

};

exports.delete = (req, res) =>{

};

