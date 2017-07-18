import * as mobx from 'mobx';

class ObservableUIStore {
	constructor() {
		mobx.extendObservable(this, {
			graphCells: new Map(),
			defaultSettings: {
				xSync: true,
				ySync: true,
				heightMode: "compact",
				width: 12,
				yRange: [-5, 5]
			},
			logging: mobx.autorun(() => {
				for (const graphCell in this.graphCells) {
					console.log(graphCell.xRange)
					console.log(graphCell.yRange)
				}
			}),
			addGraphCell: mobx.action((graphKey = null, graphCellConfig) => {
				if(!graphKey) graphKey = this.graphCells.size
				this.graphCells.set(graphKey, graphCellConfig)
			}),
			removeGraphCell: mobx.action((graphKey) => {
				this.graphCells.delete(graphKey)
			}),
			toggleGraphCell: mobx.action((graphKey) => {
				const cell = this.graphCells.get(graphKey);
				if(cell){
					cell.visible = !cell.visible;
				}else{
					console.log("graph cell is undefined")
				}
			}),
			changeWidth: mobx.action((graphKey, width) => {
				const cell = this.graphCells.get(graphKey);
				if(cell){
					cell.width = width;
				}else{
					console.log("graph cell is undefined")
				}
			}),
			handleSyncX: mobx.action((callerKey, extremes) => {
				console.log('handle sync x')
				this.graphCells.keys().forEach((graphKey, index) => {
					if(callerKey !== graphKey){
						const cell = this.graphCells.get(graphKey);
						if(cell.xSync) cell.xRange = extremes;
					}
				})
			}),
			handleSyncY: mobx.action((callerKey, extremes) => {
				console.log("handle sync y")
				this.graphCells.keys().forEach((graphKey, index) => {
					if(callerKey !== graphKey){
						const cell = this.graphCells.get(graphKey);
						if(cell.ySync){
							cell.yRange.replace(extremes);
							if(cell.chart && cell.chart.yAxis){
								cell.chart.yAxis[0].setExtremes(extremes[0], extremes[1])
							}
						}
					}
				})
			})
		})
	}
}

export default ObservableUIStore;