function hexToR(hex) {return parseInt((cutHex(hex)).substring(0,2),16)}
function hexToG(hex) {return parseInt((cutHex(hex)).substring(2,4),16)}
function hexToB(hex) {return parseInt((cutHex(hex)).substring(4,6),16)}
function cutHex(hex) {return (hex.charAt(0)=="#") ? hex.substring(1,7):hex}
function hexToRGBA(hex, opacity) {
	var R = hexToR(hex);
	var G = hexToG(hex);
	var B = hexToB(hex);
	var out = "rgba(";
	out += R + ",";
	out += G + ",";
	out += B + ",";
	out += (opacity / 100) + ")";
	return out;
}
