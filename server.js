var mysql = require('mysql');
const express = require("express");
const app = express();
const bodyparser = require('body-parser');

app.set('view engine','ejs');
app.use('/',express.static('public'));

var urlencodedParser = bodyparser.urlencoded({ extended: false });

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

app.get ('/city/:city',function(req , res) {

    con.query( `SELECT e.ename,e.venue, e.edate FROM eventlist AS e,location AS l where e.eid=l.eid and l.city='${req.params.city}'`, function(err,rows,fields) {
      if(err)
        console.log(err);
      else {
      //  console.log(rows);
        res.render('city',{ data:rows , title : req.params.city });
        }
    })
  })

app.get('/category/:category', function(req, res){
  con.query(`SELECT e.ename,e.venue,e.edate from eventlist e,category c where e.cid=c.cid and c.cname='${req.params.category}'`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
    //  console.log(rows);
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
  //    console.log(rows);
    }
  });
})
app.post('/event', urlencodedParser , function(req , res ){
      con.query(`insert into eventlist(ename,venue,cid,edate,oid) values(?,?,?,?,?)`,[ req.body.ename ,req.body.venue, req.body.cid, req.body.edate , req.body.oid ], function(err,rows,fields){
        if(err)
          console.log(err);
        else
            console.log("success insert");
      }
    );
    con.query(`select eid from eventlist where ename="${req.body.ename}"`, function(err,rows,fields) {
        con.query(`insert into location values(?,?)`, [ rows[0].eid , req.body.city]);
        con.query(`insert into eventdisc(eid,disc,ename,venue) values(?,?,?,?)`,[rows[0].eid, req.body.comment , req.body.ename, req.body.venue]);
    });

//     console.log(req.body);
      res.redirect('back');

})

app.listen(3000, () => {
  console.log("Server running up on port 3000");
})
