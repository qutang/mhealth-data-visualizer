
const getSensorId = function(filename){
	const sensorId = filename.split(".")[1].split("-")[0]
	return sensorId;
}

const getSensorName = function(filename){
	const sensorName = filename.split(".")[0].split("-")[0]
	return sensorName;
}

const getFileType = function(filename){
	const tokens = filename.split(".")
	const fileType = tokens[tokens.length - 2]
	return fileType;
}

const getTimeDurationStr = function(ms){
	if( ms > 1000 * 60 * 2 && ms <= 1000 * 3600 * 2) {
		var value = ms / 1000 / 60;
		return value.toFixed(2) + " minutes"
	}else if(ms > 1000 * 3600 * 2 && ms <= 1000 * 3600 * 24){
		var value = ms / 1000 / 3600;
		return value.toFixed(2) + " hours"
	}else if(ms > 1000 * 3600 * 24){
		var value = ms / 1000 / 3600 / 24;
		return value.toFixed(2) + " days"
	}else{
		var value = ms / 1000;
		return value.toFixed(2) + " seconds";
	}
}

export default {
	getSensorId, getSensorName, getFileType, getTimeDurationStr
}