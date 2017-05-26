var deepcopy = require('deepcopy')

const config = {      
      chart: {
        height: "300",
        type: "line"
      },
      annotationsOptions: {
        enabledButtons: false
      },
      legend: {
        enabled: true,
        layout: "vertical",
        align:'left',
        verticalAlign: 'middle'
      },
      series: [],
      annotations: [],
      credits: {
          enabled: false
      },
      plotOptions: {
          series: {
              showInNavigator: true
          }
      }
}

module.exports = deepcopy(config);