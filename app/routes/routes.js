module.exports = app => {
    const user = require('../controllers/user-controller')
    //const invoice = require('../controllers/invoice-controller')
    //const payment = require('../controllers/payment-controller')
    const formValidator = require('../middleware/form-validator')

    var router = require('express').Router();
    
    // User Routes
    router.post('/user/add', formValidator.user_validation, user.addNew);

    router.get('/user/fetch', user.fetch)

    router.put('/user/update', user.update)
    
    router.delete('/user/delete', user.delete)

    //Invoice Routes

    /* router.post('/invoice/add', invoice.add)

    router.get('/invoice/fetch', invoice.fetch)

    router.update('/invoice/updateStatus', invoice.updateStatus)

    router.delete('/invoice/delete', invoice.delete)

    //Payment Routes

    router.post('/payment/add', payment.add)

    router.get('/payment/fetch', payment.fetch)

    router.update('/payment/updateStatus', payment.updateStatus)

    router.delete('/payment/delete', payment.delete) */

    app.use('/invoice-system', router);
};