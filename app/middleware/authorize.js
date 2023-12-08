exports.authorize = (allowedRoles) => (req, res, next) => {
    if (!req.session.user) {
        res.status(401).send({
            message: "Unauthorized: User not authenticated"
        });
        return;
    }

    const { role, user_id } = req.session.user;
    if (role === 'admin' || allowedRoles.includes(role)) {
        next();
    } 
    else{
        res.status(403).send({
            message: "User Unauthorised"
        });
    }
};
