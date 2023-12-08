module.exports = app => {
    const user = require('../controllers/user-controller')
    const invoice = require('../controllers/invoice-controller')
    const payment = require('../controllers/payment-controller')
    const formValidator = require('../middleware/form-validator')
    const authenticator = require('../middleware/authenticator')

    var router = require('express').Router();
    
    // User Routes
    router.post('/user/add', authenticator.authenticate, formValidator.user_validation, user.addNew);

    router.get('/user/fetch', authenticator.authenticate, formValidator.user_fetch_validation, user.fetch);

    router.put('/user/update',authenticator.authenticate, user.update)
    
    router.delete('/user/delete',authenticator.authenticate, user.delete)

    //Invoice Routes

    router.post('/invoice/add', authenticator.authenticate, formValidator.invoice_validation, invoice.add)

    router.get('/invoice/fetch', authenticator.authenticate, invoice.fetch)

    router.put('/invoice/updateStatus', authenticator.authenticate,invoice.updateStatus)

    router.delete('/invoice/delete', authenticator.authenticate, invoice.delete)

    //Payment Routes

    router.post('/payment/add', authenticator.authenticate, formValidator.payment_validation, payment.add)

    router.get('/payment/fetch',authenticator.authenticate, payment.fetch)

    router.delete('/payment/delete', authenticator.authenticate, payment.delete)

    app.use('/invoice-system', authenticator.authenticate,router);
};