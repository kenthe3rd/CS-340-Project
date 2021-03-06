module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getStudents(res, mysql, context, complete){
        mysql.pool.query("SELECT student.student_id, student.name, student.blood, house.tower, location.place FROM student INNER JOIN house ON house.house_id = student.dorm INNER JOIN location ON location.location_id = student.locatedAt ORDER BY student.name", function(error, results, fields){
            if(error){
                res.end();
            }
            context.students = results;
            complete();
        });
    }

    function getFilteredStudents(res, mysql, context, complete, filterParam){
        mysql.pool.query("SELECT student.student_id, student.name, student.blood, house.tower, location.place FROM student INNER JOIN house ON house.house_id = student.dorm INNER JOIN location ON location.location_id = student.locatedAt WHERE student.dorm = " + filterParam + " ORDER BY student.name", function(error, results, fields){
            if(error){
                res.end();
            }
            context.students = results;
            complete();
        });
    }
    function getLocations(res, mysql, context){
        mysql.pool.query("SELECT location_id, place FROM location ORDER BY place", function(error, results, fields){
            if(error){
                res.end();
            }
            context.locations = results;
        });
    }

    function getHouses(res, mysql, context){
        mysql.pool.query("SELECT house_id, tower FROM house ORDER BY tower", function(error, results, fields){
            if(error){
                res.end();
            }
            context.houses = results;
        });
    }

    router.post('/delete', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM student WHERE student_id = ?";
        var inserts = [req.body.student_to_delete];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("An error occurred while attempting the delete operation");
                res.redirect('/student');
            } else {
                res.redirect('/student');
            }
        });
    })

    router.post('/filter', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context);
        getHouses(res, mysql, context);
        getFilteredStudents(res, mysql, context, complete, req.body.house_id);
        function complete(){
            res.render('student', context);
        }
    })
    router.post('/', function(req, res){
        if(req.body.name && req.body.blood && req.body.dorm && req.body.locatedAt){
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO student (name, blood, dorm, locatedAt) VALUES (?,?,?,?)";
            var inserts = [req.body.name, req.body.blood, req.body.dorm, req.body.locatedAt];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    console.log("An error occurred when attempting to add a new student");
                    res.end();
                } else {
                    res.redirect('/student');
                }
            });
        } else {
            res.redirect('/student');
        }
    })

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context);
        getHouses(res, mysql, context);
        getStudents(res, mysql, context, complete);
        function complete(){
            res.render('student', context);
        }
    })   
       
    return router;
}();
