/*
config = {
  firstName:string
  lastName:string
  userId:string;
}
 */

var redis = require('redis');
var mysql = require('mysql');
var SqlString = require('sqlstring');
var con = mysql.createConnection({
                                          host: "172.17.0.57",
                                          user: "root",
                                          password: "password",
                                          database: "fortunedb"
});

var client = redis.createClient("6379", "172.17.0.57");
client.on('connect', function() {
                    console.log('connected');
});
con.connect(function(err) {
                                          if (err) throw err;
                                          console.log("Connected!");
});

const send = (config, fortune) =>{
                                    console.log(`Greetings from ${config.firstName} ${config.lastName}: ${fortune}`);
                                 var sql = "INSERT INTO fortunes (fortune_sender, fortune, fortune_date) VALUES ('" + config.firstName.replace(/'/g, '\\\'') + " " + config.lastName.replace(/'/g, '\\\'')   + "', '" + fortune.replace(/'/g,'\\\'')+"',CURDATE())";
                                                  con.query(sql, function (err, result) {
                                                                                                                if (err) throw err;
                                                                                                                console.log("1 record inserted into fortunedb:fortunes");
                                                                                                              });
                                      var key = config.firstName + " " + config.lastName;
                                      client.set(key, fortune);
                                      client.expire(key,60);
};
module.exports = {send};
