module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getStudents(res, mysql, context, complete){
        mysql.pool.query("SELECT student.name, student.blood, house.tower, location.place FROM student INNER JOIN house ON house.house_id = student.dorm INNER JOIN location ON location.location_id = student.locatedAt", function(error, results, fields){
            if(error){
                res.end();
            }
            context.students = results;
            complete();
            
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getStudents(res, mysql, context, complete);
        function complete(){
            res.render('student', context);
        }
    })   
       
    return router;
}();
