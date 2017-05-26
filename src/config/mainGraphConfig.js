var deepcopy = require('deepcopy')

const config = {      
      chart: {
        height: "400",
        type: "line"
      },
      annotationsOptions: {
        enabledButtons: false
      },
      legend: {
        enabled: true
      },
      series: [],
      annotations: [],
      credits: {
          enabled: false
      },
      plotOptions: {
      }
}

module.exports = deepcopy(config);