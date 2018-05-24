module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTakes(res, mysql, context, complete){
        mysql.pool.query("SELECT DISTINCT t1.name, t2.course FROM (SELECT student.name, takes.student_id, takes.class_id FROM takes INNER JOIN student ON takes.student_id = student.student_id) AS t1 INNER JOIN (SELECT class.course, takes.class_id FROM takes INNER JOIN class ON takes.class_id = class.class_id) AS t2 ON t1.class_id = t2.class_id ORDER BY t1.name", function(error, results, fields){
            if(error){
                res.end();
            }
            context.takes = results;
            complete();
            
        });
    }

    function getStudents(res, mysql, context){
        mysql.pool.query("SELECT student_id, name FROM student ORDER BY name", function(error, results, fields){
            if(error){
                res.end();
            }
            context.students = results;
        })
    }
	
	function getClasses(res, mysql, context){
        mysql.pool.query("SELECT class_id, course FROM class ORDER BY course", function(error, results, fields){
            if(error){
                res.end();
            }
            context.courses = results;
        })
    }

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getStudents(res, mysql, context);
		getClasses(res, mysql, context);
        getTakes(res, mysql, context, complete);
        function complete(){
            res.render('takes', context);
        }
    })

    router.post('/delete', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM takes WHERE student_id = ? AND class_id = ?";
        var inserts = [req.body.student, req.body.course];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("An error occurred while attempting to withdraw from course.");
            }
        });
        res.redirect('/takes');
    })

    router.post('/transfer', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE takes SET class_id = ? WHERE student_id = ? AND class_id = ?";
        var inserts = [req.body.transferTo, req.body.student, req.body.transferFrom];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("An error occurred while attempting to transfer to/from course.");
            }
        });
        res.redirect('/takes');
    })
    router.post('/', function(req, res){
        if(req.body.student != req.body.course){
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO takes (student_id, class_id) VALUES (?,?)";
            var inserts = [req.body.student, req.body.course];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    console.log("An error occurred when attempting to enrol in course.");
                }
            });
        } else {
            console.log("ERROR");
        }
        res.redirect('/takes');
    })

    router.post('/delete', function(req, res){

    })
    return router;
}();