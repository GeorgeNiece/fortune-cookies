Tested in Katacoda Minikube environment on Ubuntu 18.04

minikube start
git clone https://github.com/reselbob/fortune-cookies.git 
docker run -d --name redis -p 6379:6379 redis
docker volume create fortunedb-volume
docker run --name fortunedb -p3306:3306 -v fortunedb-volume:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=fortunedb -d mysql:5.7
docker exec -it fortunedb bash

In Mysql Container
# mysql -u root -p
Pwd: password

mysql> use fortunedb;
mysql> 
create table fortunes (
    fortune_id INT NOT NULL AUTO_INCREMENT,
    fortune_sender VARCHAR(256) NOT NULL,
    fortune VARCHAR(256) NOT NULL,
    fortune_date DATE,
    PRIMARY KEY (fortune_id)
     );
     
 mysql> quit
 # exit
 
minikube ip


cd ~/fortune-cookies/report_gen
npm install express
// update index.js host in vi for the output from the `minikube ip` 
cd ~/fortune-cookies/monolith/sender
// update index.js host in vi for the output from the `minikube ip` 
cd ~/fortune-cookies/monolith
npm install redis
npm install mysql
docker build -t monolith .
docker run -p 3000:3000 -d --name fc-monolith monolith
cd ~/fortune-cookies/report_gen
node index.js
