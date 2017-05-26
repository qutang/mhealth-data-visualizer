const Import = require('./import.js')

module.exports = function(self){ 
  self.addEventListener('message', function(e) { // without self, onmessage is not defined
    console.log('Message received from main script');
    // var workerResult = 'Received from main: ' + (e.data);
	Import.importFile(e.data, (result)=> {
		console.log('Posting message back to main script');
    	self.postMessage(result.data); // here it's working without self
	});
	console.log('Processing message...');
  });
}