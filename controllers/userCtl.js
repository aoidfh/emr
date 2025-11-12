"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = exports.getData = exports.getTestData = void 0;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const validator = require("validator");
const daoBase = require("../models/baseDao");
const getTestData = async () => {
    try {
        //let result = await daoBase.getData(office_id, user_id); 
        let result = [{ id: 88, name: 'nova', age: 33 },
            { id: 99, name: 'genesis', age: 44 },
            { id: 100, name: 'genesis', age: 55 }];
        return (result);
    }
    catch (error) {
        return { msg: 'error...' };
    }
};
exports.getTestData = getTestData;
const getData = async (office_id, user_id) => {
    try {
        let result = await daoBase.getData(office_id, user_id);
        return (result);
    }
    catch (error) {
        return { msg: 'error...' };
    }
};
exports.getData = getData;
const createAccount = async (req, res) => {
    try {
        const validationErrors = [];
        if (!validator.isEmail(req.body.email))
            validationErrors.push('Please enter a valid email address.');
        if (validator.isEmpty(req.body.password))
            validationErrors.push('Password cannot be blank.');
        if (validationErrors.length) {
            req.flash('error', validationErrors);
            return res.status(300).send({ msg: validationErrors }); //redirect('/login');
        }
        const _account = req.body;
        const hashedPassword = await bcrypt.hash(_account.password, saltRounds);
        _account.password = hashedPassword;
        let result = await daoBase.createAccount(_account);
        res.status(200).send(result);
    }
    catch (error) {
        return res.status(500).send({ msg: 'error...' });
    }
};
exports.createAccount = createAccount;
//# sourceMappingURL=userCtl.js.map