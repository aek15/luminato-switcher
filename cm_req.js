/* Here is a script provides simple one-page interface to switch input services for single output
 * of TELESE Luminato chassis modules via CommonFusion iViewer 4 app
 * -------------------------------------------------------------------------
 * Author: Alexander Klimenko
 * Email: aeklmn@gmail.com                                                                    */



//chassis details
var main_url  = "192.168.1.36" 
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
 * 1. Slot number of a Luminato IP MUX module
 * 2. Input number of a Luminato module (logical value displaying in Luminato WEB GUI for INPUT GE or id in physical interface)
 * 3. Real SID of the Incoming Service needed to be switched on
 * 4. Output number of the Luminato module (logical value displaying in Luminato WEB GUI for OUTPUT GE or id of physical output MPTS)
 * 5. ID of physical input interface for IP MUX always 1 (can be checked in WEB GUI by holding mouse pointer on the (I) icon.
 */
function service_change(m, ii, ins, out, os){
	var data_service = {"enable": "true",
                        "serviceId": "100", //doesn't work. SID of output service must be pre-defined eg. by WEB gui
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