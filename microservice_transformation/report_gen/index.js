const express = require("express");
const app = express();
const port = process.env.PORT || 3333;
/* modify the host for mysql connection from `minikube ip` output */
var mysql = require('mysql');
var con = mysql.createConnection({
                                                          host: "172.17.0.57",
                                                          user: "root",
                                                          password: "password",
                                                          database: "fortunedb"
});

con.connect(function(err) {
                                                          if (err) throw err;
                                                          console.log("Connected!");
});

app.get("/", async (req, res) => {
                                      var sql = "select fortune_sender, fortune from fortunes order by fortune_id desclimit 10";
                              var response = "<html><head><title>Fortune Report</title></head><body><h4><b>";
                                      con.query(sql, function (err, result) {
                                                          if (err) throw err;
                                                            Object.keys(result).forEach(function(key) {
                                                                            var row = result[key];
                                                                            console.log(row.fortune_sender + " " + row.fortune)
                                                                           response += row.fortune_sender + ": " + row.fortune + "</br>";
                                                                          });
                    response += "</body></html>";
                    res.send(response);
                                              });


});

app.use(express.json());

const server = app.listen(port, () => {
                 console.log(`Report Gen Server running on port:  ${port} at ${new Date()} on process: ${process.pid}`);
});

const shutdown = async (signal) => {
                    let shutdownMessage;

                    if(!signal){
                                            shutdownMessage = (`${appName} API Server shutting down at ${new Date()}`);
                                        }else{
                                                                shutdownMessage = (`Signal ${signal} : API Server shutting down at ${new Date()}`);
                                                            }
                    const obj = {status:'SHUTDOWN', shutdownMessage, pid:process.pid};
                    await server.close(function () {
                                            console.log(obj);
                                            process.exit(0);
                                        }).catch(err => {
                                                                console.error(err);
                                                                return {status:'ERROR',err}
                                                            })

};

process.on('SIGTERM', function () {
                    shutdown('SIGTERM');
});

process.on('SIGINT', function () {
                    shutdown('SIGINT');
});


module.exports = {server,shutdown};
