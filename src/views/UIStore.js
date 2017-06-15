import * as mobx from 'mobx';

class ObservableUIStore {
	constructor() {
		mobx.extendObservable(this, {
			graphCells: new Map(),
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
			})
		})
	}
}

export default ObservableUIStore;