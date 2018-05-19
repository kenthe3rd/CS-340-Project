module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getFriends(res, mysql, context, complete){
        mysql.pool.query("SELECT DISTINCT t1.name AS n1, t2.name AS n2 FROM (SELECT student.name, isFriendOf.student FROM isFriendOf INNER JOIN student ON isFriendOf.student = student.student_id) AS t1 INNER JOIN (SELECT student.name, isFriendOf.student FROM isFriendOf INNER JOIN student ON isFriendOf.friend_id = student.student_id) AS t2 ON t1.student = t2.student", function(error, results, fields){
            if(error){
                res.end();
            }
            context.relationship = results;
            complete();
            
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getFriends(res, mysql, context, complete);
        function complete(){
            res.render('isFriendOf', context);
        }
    })
    return router;
}();