
const getSensorId = function(filename){
	const sensorId = filename.split(".")[1].split("-")[0]
	return sensorId;
}

const getSensorName = function(filename){
	const sensorName = filename.split(".")[0].split("-")[0]
	return sensorName;
}

const getFileType = function(filename){
	const fileType = filename.split(".")[3]
	return fileType;
}

export default {
	getSensorId, getSensorName, getFileType
}