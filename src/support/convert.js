import moment from 'moment'
import Math from 'mathjs'

// This method is slower than the following method
// const convertCsvToHighChartLineSeries = function(data, columns){
// 	data.splice(0,1);
// 	const data2 = Math.transpose(data)
// 	const nRows = data.length;
// 	let i = nRows;
// 	data2[0] = data2[0].map((value) =>{return Date.parse(value)})
// 	return [1,2,3].map((col) => {
// 		data2[col] = Math.number(data2[col]);
// 		const rowRange = new Math.range(0, data.length);
// 		const data3 = Math.subset(data2, Math.index([0,col], rowRange));
// 		const data4 = Math.transpose(data3);
// 		return {
// 			data: data4,
// 			type: "line",
// 			name: col,
// 			tooltip: {
//           	valueDecimals: 2
// 			}
// 		}
// 	});
	
// }

const convertCsvToHighChartLineSeries = function(data, columns){
	data.splice(0,1);
	return [1,2,3].map((col) => {
		const data2 = data.map((row) => {
		return [Date.parse(row[0]), parseFloat(row[col])];
	});
		return {
			data: data2,
			type: 'line',
			name: col,
			tooltip: {
          	valueDecimals: 2
        }
		};
	});
}

const convertCsvToHighChartAnnotations = function(data){
	data.splice(0,1);
	const data2 = data.map((row) => {
		const y = Math.random()*3;
		return {
			yValue: y,
			yValueEnd: y, 
			anchorX: "left",
			anchorY: "top",
			xValue: Date.parse(row[1]), 
			xValueEnd: Date.parse(row[2]),
			shape: {
				type: "path",
				params: {
					stroke: "#c55",
				}
			},
			title: {
				text: "",
				style: {
					fontSize: "0.5em"
				}
			},
			events: {
          mouseover: function (e) {
            this.update({
              title: {
                text: row[3],
                style: {
                  fontSize: "0.7em"
                },
				x: 0,
				y: -15
              }
            })
          },
          mouseout: function (e) {
            this.update({
              title: {
                text: "",
                style: {
                  fontSize: "0.7em"
                },
				x: 0,
				y: -15
              }
            })
          }
        }
		};
	});
	console.log(data2)
	return data2;
}

export default {
	convertCsvToHighChartLineSeries,
	convertCsvToHighChartAnnotations
}