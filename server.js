var mysql = require('mysql');
const express = require("express");
const app = express();
const bodyparser = require('body-parser');
var methodOverride = require('method-override')

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

    con.query( `SELECT e.eid,e.ename,e.venue, e.edate FROM eventlist AS e,location AS l where e.eid=l.eid and l.city='${req.params.city}'`, function(err,rows,fields) {
      if(err)
        console.log(err);
      else {
      //  console.log(rows);
        res.render('city',{ data:rows , title : req.params.city });
        }
    })
  })

app.get('/category/:category', function(req, res){
  con.query(`SELECT e.eid,e.ename,e.venue,e.edate from eventlist e,category c where e.cid=c.cid and c.cname='${req.params.category}'`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
    //  console.log(rows);
      res.render('category', { data : rows , title : req.params.category});
    }
  })
} )

app.get('/event',function(req , res){
  con.query(`SELECT eid,ename,venue,edate from eventlist order by edate limit 5`,function(err,rows,fields){
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
app.get('/event/eventdisc/:eventid',function(req,res){
  con.query(`select e.ename,e.venue,e.disc,d.edate from eventdisc e , eventlist d where e.eid=d.eid and e.eid=${req.params.eventid}`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      res.render('desc',{ data : rows[0] });
  //    console.log(rows);
    }
  })
})
app.get('/event/edit/:eid',function(req,res){
  con.query(`select e.eid,e.ename,e.venue,e.disc,d.edate from eventdisc e , eventlist d where e.eid=d.eid and e.eid=${req.params.eid}`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      res.render('edit',{ data : rows[0] });
  //    console.log(rows);
    }
  })

})
app.use(methodOverride('_method'));
app.put('/event/edit', urlencodedParser , function (req , res) {
   con.query(`update eventlist set ename="${req.body.ename}",edate="${req.body.edate}",cid="${req.body.cid}",oid="${req.body.oid}",venue="${req.body.venue}" where eid=?`,[req.query.person], function(err,fields){
    if(err)
      console.log(err);
      else {
      //  console.log(fields);
      }

  });

  con.query(`update eventdisc set disc="${req.body.comment}",ename="${req.body.ename}",venue="${req.body.venue}" where eid=? `,[req.query.person]);
  con.query(`update location set city="${req.body.city}" where eid=?`,[req.query.person] , function(err , result){
    if(err)
      console.log(err);
    else
      res.redirect('/event/deletion');
  });

  //console.log(req.body);
})

app.get('/event/deletion', function(req,res){
  con.query(`SELECT eid,ename,venue,edate from eventlist order by edate`,function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      res.render('deletion',{ data : rows });
    }
 })
})
// override with POST having ?_method=DELETE

app.delete('/resource', function(req , res){
  con.query(`DELETE from eventlist where eid=?`,[req.query.person],function(err,rows,fields){
    if(err)
      console.log(err);
    else {
      console.log("deletion succ");
    }
  })
 //  console.log(req.query.person);
  res.redirect('/event/deletion');
})

app.listen(3000, () => {
  console.log("Server running up on port 3000");
})
