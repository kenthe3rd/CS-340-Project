module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getClasses(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM class", function(error, results, fields){
            if(error){
                res.end();
            }
            context.classes = results;
            complete();
            
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getClasses(res, mysql, context, complete);
        function complete(){
            res.render('class', context);
        }
    })
    return router;
}();