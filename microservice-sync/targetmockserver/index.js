const express = require("express");
const app = express();

const port = process.env.TARGET_MOCK_SERVER_PORT || 3000;

const validateDependencyEnvVars = () =>{
    const missingTargets = [];

    if(!process.env.TARGET_NAME) missingTargets.push('TARGET_NAME');
    if(missingTargets.length > 0){
        const str =  `The following required environment variable are missing: ${JSON.stringify(missingTargets)}. Server shutting down at ${new Date()}.`;
        throw new Error(str);
    }
};

const getResponseObject = (req, method) =>{
    const obj = {};
    obj.date = new Date();
    obj.method = method;
    obj.message = `Hello from target: ${process.env.TARGET_NAME}.`;
    return obj;
};

//optional command line param to declare target is, ?target=value
app.get("/", (req, res, next) => {
    res.status = 200;
    const str = JSON.stringify(getResponseObject(req, 'GET'));
    const msg = `${process.env.TARGET_NAME} is sending a GET at ${new Date()}`;
    console.log(msg);
    res.send(str).end();
});

//optional command line param to declare target is, ?target=value
app.post("/", (req, res, next) => {
    res.status = 200;
    const str = JSON.stringify(getResponseObject(req, 'POST'));
    const msg = `${process.env.TARGET_NAME} is sending a POST at ${new Date()} with the body ${JSON.stringify(req)}.`;
    console.log(msg);
    res.send(str).end();
});

validateDependencyEnvVars();

const server = app.listen(port);
console.log(`Target Server ${process.env.TARGET_NAME} started at ${new Date()} and listening on port ${port}`);

const shutdown = () => {
    console.log(`Target Server ${process.env.TARGET_NAME}  shutting down at ${new Date()}`);
    server.close()
};

module.exports = {server, shutdown};

