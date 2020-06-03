let connection = require('../model/connection');
exports.create = function(type, error, auth=null){
    var sql = "insert into log set type=?, error=?, auth=?";
    connection.query(sql, [type, JSON.stringify(error), auth], function (err, result) {
        if(err){
            console.log(err);
        }
    });
};

exports.flush = function(){
    connection.query("TRUNCATE TABLE `log`", [], function(err, result){
        
    });
};


exports.emptyTables = function(req,res){
    connection.query("TRUNCATE `admin_login`;TRUNCATE `chat`;TRUNCATE `coupon`;TRUNCATE `help_center`;TRUNCATE `help_center_image`;TRUNCATE `landing_page`;TRUNCATE `log`;TRUNCATE `notification`;TRUNCATE `notification_to`;TRUNCATE `payment`;TRUNCATE `project`;TRUNCATE `project_attachment`;TRUNCATE `project_comment`;TRUNCATE `project_follow`;TRUNCATE `project_quote`;TRUNCATE `project_report`;TRUNCATE `project_requirement`;TRUNCATE `project_service`;TRUNCATE `settings_alert`;TRUNCATE `settings_alert_service`;TRUNCATE `settings_business_account`;TRUNCATE `settings_coupon`;TRUNCATE `settings_notification`;TRUNCATE `settings_payment_card`; TRUNCATE `transaction`;TRUNCATE `user`;TRUNCATE `user_faq`;TRUNCATE `user_follow`;TRUNCATE `user_like`;TRUNCATE `user_login`;TRUNCATE `user_portfolio`;TRUNCATE `user_report`;TRUNCATE `user_service`", [], function(err, result){ 
        res.send(result)      
    });   
}; 