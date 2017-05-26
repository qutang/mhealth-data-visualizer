const Papa = require('papaparse');

const importFile = function (file, onComplete) {
	if (!onComplete) {
		onComplete = function (results) {
			console.log("Finished:", results.data);
		};
	}
	const complete = (result) => {
		return onComplete(null, result)
	}
	Papa.parse(file, {
		skipEmptyLines: true,
		complete: complete
	})
};

export default { importFile };