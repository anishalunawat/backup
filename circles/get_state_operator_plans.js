var fs = require('fs');
var request = require('request');
var path = require('path');
var circle = "Karnataka";
var database = "localhost/" + circle ;
var dburl = database;
var db = require('mongojs').connect(dburl);

if(fs.existsSync(circle)){
	console.log("folder " + circle + " exists");
}
else 
{

	fs.mkdirSync(circle);
}

function getStorePlans(i,operators){ // i denotes index of file in data 
	
	if(i < operators.data.length)
		{
		request('http://api.dataweave.in/v1/telecom_data/listByCircle/?api_key=13c590840cdeb51e0d34f090667e1c411bfa6fa9&operator=' + operators.data[i].operator_master +  '&circle=' + circle + '&page=1&per_page=1000', function (error, response, doc) {
					if (!error && response.statusCode == 200) {
						console.log("request for " +  circle + operators.data[i].operator_master + "success ");
						var tmp_name = operators.data[i].operator_master + "_" + "allplans" + ".json" ;
						var dir = path.join(__dirname,circle,operators.data[i].operator_master);
						if(fs.existsSync(dir)){
							console.log("folder " + dir + " exists");
						}
						else 
						{

							fs.mkdirSync(dir);
						}
						var file1 = path.join(dir,tmp_name);
						(function(i) {

							fs.writeFile(file1,doc, function(err){
								if(err){
									console.log(err);
								}
								else {
											console.log(file1 + " saved succesfully");
											getStorePlans(i+1,operators);
								}
								});
							var collName = circle + operators.data[i].operator_master + "all";
							var data = JSON.parse(doc);
							var col = db.collection(collName);
							col.save(data,function(err,savedData){
								if(err)
									{
										console.log(err + "saving in dabase failed");
									}
								else
									{
									    console.log(collName + "saved in database successfully");
									}
							});
							
						})(i);
						
		}
});
}
}	


request('http://api.dataweave.in/v1/telecom_data/listUniqOperator/?api_key=13c590840cdeb51e0d34f090667e1c411bfa6fa9&page=1&per_page=1000', function (err, response,data) {
	if (!err && response.statusCode == 200) {
		var file = path.join(__dirname, circle, 'list_operator.json');
		fs.writeFileSync(file, data);
		console.log("list operator succeded ");

		fs.readFile( file, function(err,data){
			if(err){
				console.log(err);
			}
			else
			{
				var operators = JSON.parse(data);
				getStorePlans(0,operators);


			}
			var collName = circle + "List";
			var storeData = JSON.parse(data);
			var col = db.collection(collName);
			col.save(storeData,function(err,savedData){
				if(err)
					{
						console.log(err + "saving in dabase failed");
					}
				else
					{
					    console.log(collName + "saved in database successfully");
					}
			});

		});


	}

});




/*

for (var i = 0; i < Number(operators.count); i++) {
	(function(i){

		request('http://api.dataweave.in/v1/telecom_data/listByCircle/?api_key=13c590840cdeb51e0d34f090667e1c411bfa6fa9&operator=' 
				+ operators.data[i].operator_master +  '&circle=' + circle + '&page=1&per_page=1000', function (error, response, doc) {
					if (!error && response.statusCode == 200) {
						console.log("request for " +  circle + operators.data[i].operator_master + "success ");
						var tmp_name = operators.data[i].operator_master + "_" + "allplans" + ".json" ;
						var file1 = path.join(__dirname, circle, tmp_name);
						(function(i) {

							fs.writeFile(file1,doc, function(err){
								if(err){
									console.log(err);
								}
								else {
									console.log("file saved succesfully");
								}
							});
						})(i);

					}
				});
	}(i));

}
*/


