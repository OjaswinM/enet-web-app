var mysql = require('mysql');
const express = require("express");
const app = express();

app.set('view engine','ejs');
app.use('/',express.static('public'));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database:"eventman"
});

con.connect(function(err) {
  if(err)
    console.log(err);
  else {
    console.log('success');
  }
  });

app.get ('/event/city/:city',function(req , res) {

    con.query( `SELECT e.ename,e.venue, e.edate FROM eventlist AS e,location AS l where e.eid=l.eid and l.city='${req.params.city}'`, function(err,rows,fields) {
      if(err)
        console.log(err);
      else {
        console.log(rows);
      // res.render('one',{data:rows[0]})
        }
    })
  })

app.get('/category/:category', function(req, res){
  con.query(`SELECT e.ename,e.venue,e.edate from eventlist e,category c where e.cid=c.cid and c.cname='${req.params.category}'`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      console.log(rows);
      res.render('category', { data : rows , title : req.params.category});
    }
  })
} )

app.get('/event',function(req , res){
  con.query(`SELECT ename,venue,edate from eventlist order by edate`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      res.render('index',{ data : rows });
      console.log(rows);
    }
  });
})

app.listen(3000, () => {
  console.log("Server running up on port 3000");
})
