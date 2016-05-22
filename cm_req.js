/* Here is a script provides simple one-page interface to switch input services for single output
 * of TELESE Luminato chassis modules via CommonFusion iViewer 4 app
 * -------------------------------------------------------------------------
 * Author: Alexander Klimenko
 * Email: aeklmn@gmail.com                                                                    */



//chassis details
var main_url  = "10.3.6.123" 
var login_url = "http://" + main_url + "/login/" 	//url for login to the chassis
var url       = "http://" + main_url + "/api/v1"	//url for main work

function l_login() {

var data = {
	"action": "login", 
	"user": "admin",
	"password": "admin" 
}; //Login data


var login = JSON.stringify(data) //Convert login data to JSON Format
	CF.request(login_url, "POST", null, login, function(status, headers, body) {
		if (status == "200") {
		 //Process OK reply
			CF.log("setValue OK: " + status + ", "+ headers["Set-Cookie"]); //debug message
			CF.setJoin("d100","1")
		} else {
			CF.log("setValue Error: " + status + ", " + body); //debug message
		}
	});
}

/* Service switching function.
 * Arguments description: 
 * 1. Slot number of a Luminato module
 * 2. Input number of a Luminato module (logical value displaying in Luminato WEB GUI for "Output device" or id of physical interface)
 * 3. Real SID of the Service needed to switch
 * 4. Output number of the Luminato module (logical value displaying in Luminato WEB GUI for "Input device" or id of physical interface)
 * 5. Service ID. This is not real SID of the service. It is logical id of the service in particular output.
 */
function service_change(m, ii, ins, out, os){
	var data_service = {"enable": "true",
                        "serviceId": "1",
                        "inputRef": "in/"+ii+"/services/"+ ins				
	};
	var datas = JSON.stringify(data_service)
	CF.request(url+"/modules/"+m+"/out/"+out+"/services/"+os, "PUT", null, datas, function(status, headers, body){
		if (status == "200"){
			CF.log(ins + " ON AIR!"); //debug message
			CF.setJoin("s201", ins)
		} else {
			CF.log("Operation failed. Check arguments. Status: "+ status + headers + body); //debug message
		}
	});
}

function luminato_logout() {
var data = {
	"action": "logout"
}; 

var login = JSON.stringify(data) //Convert login data to JSON Format
	CF.request(login_url, "POST", null, login, function(status, headers, body) {
		if (status == "200") {
		 //Process OK reply
			CF.log("Logout OK: " + status); //debug message
			CF.setJoin("d100","0")
		} else {
			CF.log("setValue Error: " + status + ", " + body); //debug message
		}
	});
}