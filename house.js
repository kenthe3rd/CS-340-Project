module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getHouses(res, mysql, context, complete){
        mysql.pool.query("SELECT house_id, tower, colors, animal, founder FROM house", function(error, results, fields){
            if(error){
                res.end();
            }
            context.houses = results;
            complete();
            
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getHouses(res, mysql, context, complete);
        function complete(){
            res.render('house', context);
        }
    })
    return router;
}();
