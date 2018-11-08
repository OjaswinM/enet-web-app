var mysql = require('mysql');
const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
    origin: "localhost:1237",
    optionSuccessStatus: 200
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shivin",
  database:"eventman"
});

con.connect(function(err) {
  if(err)
    console.log(err);
  else {
    console.log('success');
  }
  });

app.use(cors(corsOptions));

app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));

app.delete('/edit/delete/:eventId',function(req , res){
  con.query(`DELETE from eventlist WHERE eid=${req.params.eventId}`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      console.log(`deleted ${req.params.ename}`);
      res.end();
    }
  });
})

app.get('/event/:eventId',function(req , res){
  con.query(`SELECT e.eid,e.ename,e.venue,e.edate,ed.disc,c.cname FROM (eventlist e JOIN eventdisc ed ON e.eid=ed.eid) JOIN category c on e.cid=c.cid WHERE e.eid = ${req.params.eventId}`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      console.log(JSON.stringify(rows))
      res.send(JSON.stringify(rows));
      res.end();
    }
  });
})

app.get ('/event/city/:city',function(req , res) {

    con.query( `SELECT e.eid,e.ename,e.venue, e.edate FROM eventlist AS e,location AS l where e.eid=l.eid and l.city='${req.params.city}'`, function(err,rows,fields) {
      if(err)
        console.log(err);
      else {
        res.send(JSON.stringify(rows));
        res.end();
      // res.render('one',{data:rows[0]})
        }
    })
  })

app.get('/event/category/:categoryId', function(req, res){
  con.query(`SELECT eid,e.ename,e.venue,e.edate from eventlist e where e.cid='${req.params.categoryId}'`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      res.send(JSON.stringify(rows));
      res.end();
    }
  })
} )

app.get('/event',function(req , res){
  con.query(`SELECT eid,ename,venue,edate from eventlist order by edate`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      console.log("GET");
      res.send(JSON.stringify(rows));
      res.end();
    }
  });
})

app.listen(1238, () => {
  console.log("Server running up on port 3000");
})
