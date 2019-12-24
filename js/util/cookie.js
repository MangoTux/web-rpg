//Saves player object as JSON string here
function setCookie(c_name, value, exdays) {
	var exdate=new Date();
	var playerSave = JSON.stringify(value);
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(playerSave) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

//Return JSON string if cookie exists, null otherwise
function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1) {
		c_value = null;
	} else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start, c_end));
	}
	return c_value;
}

//Load file if data exists
function checkCookie() {
  var loadObject = getCookie("player_save");
	if (loadObject != null && loadObject != "") {
		return jQuery.parseJSON(loadObject);
	}
	return '';
}
