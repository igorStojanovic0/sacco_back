const express = require('express');

// const NotificationCtrl = require('../../controllers/dashboard/NotificationCtrl');

module.exports = function (app) {

    // Initializing route groups
    const apiRoutes = express.Router();

    // ==================  Set url for API group routes ==================
    app.use('/socket', apiRoutes);
};