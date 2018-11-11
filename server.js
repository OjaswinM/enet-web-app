var mysql = require('mysql');
const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require('body-parser');

var corsOptions = {
  origin: "localhost:1237",
  optionSuccessStatus: 200
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shivin",
  database: "eventman"
});

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

con.connect(function(err) {
  if (err)
    console.log(err);
  else {
    console.log('success');
  }
});

app.use(cors(corsOptions));

app.use(express.static("enetv2"));

// app.use(express.static(__dirname + "/public"));

app.delete('/api/edit/delete/:eventId', function(req, res) {
  con.query(`DELETE from eventlist WHERE eid=${req.params.eventId}`, function(err, rows, fields) {
    if (err)
      console.log(err);
    else {
      console.log(`deleted ${req.params.eventId}`);
      res.end();
    }
  });
})

app.get('/api/event/:eventId', function(req, res) {
  con.query(`SELECT e.eid,e.ename,e.venue,e.edate,ed.disc,c.cname FROM (eventlist e JOIN eventdisc ed ON e.eid=ed.eid) JOIN category c on e.cid=c.cid WHERE e.eid = ${req.params.eventId}`, function(err, rows, fields) {
    if (err)
      console.log(err);
    else {
      res.send(JSON.stringify(rows));
      res.end();
    }
  });
})

app.get('/api/event/city/:city', function(req, res) {

  con.query(`SELECT e.eid,e.ename,e.venue, e.edate FROM eventlist AS e,location AS l where e.eid=l.eid and l.city='${req.params.city}'`, function(err, rows, fields) {
    if (err)
      console.log(err);
    else {
      res.send(JSON.stringify(rows));
      res.end();
      // res.render('one',{data:rows[0]})
    }
  })
})

app.get('/api/event/category/:categoryId', function(req, res) {
  con.query(`SELECT eid,e.ename,e.venue,e.edate from eventlist e where e.cid='${req.params.categoryId}'`, function(err, rows, fields) {
    if (err)
      console.log(err);
    else {
      res.send(JSON.stringify(rows));
      res.end();
    }
  })
})

app.get('/api/event', function(req, res) {
  con.query(`SELECT eid,ename,venue,edate from eventlist order by edate`, function(err, rows, fields) {
    if (err)
      console.log(err);
    else {
      res.send(JSON.stringify(rows));
      res.end();
    }
  });
})

app.get('/api/event/:eventId/full', function(req, res) {
  con.query(`SELECT e.eid,e.ename,e.venue,e.edate,ed.disc,e.cid,e.oid,l.city FROM ((eventlist e JOIN eventdisc ed ON e.eid=ed.eid) JOIN location l ON e.eid=l.eid) WHERE e.eid=${req.params.eventId} `, function(err, rows, fields) {
    if (err)
      console.log(err);
    else {
      res.send(JSON.stringify(rows));
      res.end();
    }
  });
})

app.post('/api/edit/add', bodyParser(), function(req, res) {

      console.log(req.body);
      let date = req.body.edate.split("-");
      date = new Date(date[0], date[1] - 1, date[2]);

      con.query(`insert into eventlist(ename,venue,cid,edate,oid) values(?,?,?,?,?)`, [req.body.ename, req.body.venue, req.body.cid, date, req.body.oid], function(err, rows, fields) {
        if (err)
          console.log(err);
        else {
          con.query(`select eid from eventlist where ename="${req.body.ename}" AND edate="${req.body.edate}"`, function(err, rows, fields) {
              if (err)
                console.log(err);
              else {
                con.query(`insert into location values(?,?)`, [rows[0].eid, req.body.city], function(err, rows, fiels) {
                    if (err) {
                      console.log(err);
                    } else {
                      con.query(`select eid from eventlist where ename="${req.body.ename}" AND edate="${req.body.edate}"`, function(err, rows, fields) {
                          if (err)
                            console.log(err);
                          else {
                            con.query(`insert into eventdisc(eid,disc,ename,venue) values(?,?,?,?)`, [rows[0].eid, req.body.disc, req.body.ename, req.body.venue], function(err, rows, fields) {
                                if (err)
                                  console.log(err);
                                else {
                                  console.log(`successful insert of ${req.body.ename}`)
                                }
                              });
                            }
                          });
                        }
                      });
                  }
                });
            }
          });
      });

      app.put('/api/edit/modify/:eventId', bodyParser(), function(req, res) {

        console.log(req.body);
        // let date = req.body.edate.split("-");
        // date = new Date(date[0], (date[1]-1), date[2]);

        con.query(`UPDATE eventlist SET ename="${req.body.ename}",
        venue="${req.body.venue}",
        cid="${req.body.cid}",
        edate="${req.body.edate}",
        oid="${req.body.oid}"
        WHERE eid = "${req.body.eid}"`,
          function(err, rows, fields) {
            if (err)
              console.log(err);
            else {
              console.log("success edit");
              con.query(`UPDATE location SET city="${req.body.city}" WHERE eid = "${req.body.eid}"`,
                function(err, rows, field) {
                  if (err) {
                    console.log(err);
                  } else {
                    con.query(`UPDATE eventdisc SET eid="${req.body.eid}",disc="${req.body.disc}",ename="${req.body.eid}",venue="${req.body.eid}" WHERE eid = "${req.body.eid}"`, function(err, rows, fields) {
                      if (err) {
                        console.log(err);
                      }
                      else
                      {
                        console.log(`successful edit of ${req.body.eid}`);
                      }
                    });
                  }
                }
              )
            }
          });
      });

      app.use("/*", express.static("enetv2"));


      app.listen(1239, () => {
        console.log("Server running up on port");
      });
