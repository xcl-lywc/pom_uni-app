export const debug  =true;
export{
	timeToDate,
	isNumber
}
function timeToDate(timestamp){
	if(!isNumber(timestamp))return;
	var date = new Date(timestamp);
	return date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8); 
}
function isNumber(val){

    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }

}