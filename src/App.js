import React, { Component } from 'react';
import { Modal, Alert, Switch, DatePicker, Radio, Badge, Popover, Tag, Checkbox, Collapse, Card, Row, Col, Tabs, Slider, Button, InputNumber, Tooltip } from 'antd';
import Dropzone from 'react-dropzone';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import ObservableUIStore from './views/UIStore'
import DevTools from 'mobx-react-devtools'
import FileFormat from './support/format'
import Papa from 'papaparse'
import StockChart from 'react-highcharts/ReactHighstock'
import UsualChart from 'react-highcharts'
import boost from 'highcharts/modules/boost'
import Math from 'mathjs'
import deepcopy from 'deepcopy'
import LogoImage from './logo.png'
import platform from 'platform'
require('highcharts/highcharts-more')(UsualChart.Highcharts);

const SensorChart = observer(class SensorChart extends Component {
	constructor() {
		super()
		this.config = this.getDefaultConfig()
	}

	getDefaultConfig() {
		const config = {
			chart: {
				type: "line",
				zoomType: "x",
				animation: false,
				spacing: [5,5,5,5]
			},
			legend: {
				enabled: true
			},
			series: [],
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					animation: false,
					states: {
						hover: {
							animation: false,
							enabled: false
						}
					},
					dataGrouping: {
						smoothed: false
					}
				}
			},
			scrollbar: {
				enabled: false
			},
			navigator: {
				enabled: true
			},
			xAxis: {
			},
			yAxis: {
				opposite:false,
				alignTicks: false,
				endOnTick: false,
				startOnTick: false,
				tickInterval: 0.5
			},
			rangeSelector : {
				enabled: false
			},
		}
		return config
	}

	componentDidUpdate() {
		if(this.refs[this.props.id]){
			this.props.graphCell.chart = this.refs[this.props.id].getChart()
			this.refs[this.props.id].getChart().yAxis[0].setExtremes(this.props.graphCell.yRange[0], this.props.graphCell.yRange[1])
		}
		
	}

	toggleDisplayMode() {
		if(this.props.graphCell.displayMode == "scroll"){
			this.config.chart.width = 20000
			this.config.navigator.enabled = false
		}else{
			this.config.chart.width = null
			this.config.navigator.enabled = true
		}
	}	

	togglePointMode() {
		if(this.props.graphCell.pointMode == "line"){
			this.config.plotOptions.series.step = false
			this.config.plotOptions.series.dataGrouping.smoothed = false
		}else if(this.props.graphCell.pointMode == "step"){
			this.config.plotOptions.series.step = "left"
			this.config.plotOptions.series.dataGrouping.smoothed = false
		}else if(this.props.graphCell.pointMode == "spline"){
			this.config.chart.type = "spline"
			this.config.plotOptions.series.step = false
			this.config.plotOptions.series.dataGrouping.smoothed = true
		}
	}

	toggleCompactMode() {
		if(this.props.graphCell.heightMode === "compact"){
			this.config.navigator.enabled = false
			this.config.chart.height = 150
			this.config.legend.enabled = false
		}else{
			this.config.navigator.enabled = true
			this.config.chart.height = null
			this.config.legend.enabled = true
		}
	}

	render() {
		const graphCell = this.props.graphCell
		this.reactToXRangeChange = mobx.reaction(() => 	graphCell.xRange, xRange => {
			console.log("react to x range change called" + this.props.id)
			if(graphCell.chart && graphCell.chart.xAxis){
				graphCell.chart.xAxis[0].setExtremes(xRange[0], xRange[1])
				graphCell.chart.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
				graphCell.chart.showResetZoom();
			}
		})

		this.reactToYRangeChange = mobx.reaction(() => 	graphCell.yRange, yRange => {
			console.log("react to y range change called" + this.props.id)
			if(graphCell.chart && graphCell.chart.yAxis){
				graphCell.chart.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
			}
			if(graphCell.ySync){
				this.props.onSyncY(this.props.id, [graphCell.yRange[0], graphCell.yRange[1]])
			}
		})
		
		if(graphCell.isLoading){
			return <div id={this.props.id}>no data</div>
		}else{
			this.config.series = graphCell.data
			this.toggleDisplayMode()
			this.togglePointMode()
			this.toggleCompactMode()
			
			// set extreme handler
			this.config.xAxis = {
				events: {
					afterSetExtremes: (event) => {
						if(event.trigger){
							console.log("set x range")
							graphCell.xRange.replace([event.min, event.max])
							graphCell.chart.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
							if(graphCell.xSync){
								this.props.onSyncX(this.props.id, [event.min, event.max])
							}
						}
					}
				}
			}
			// this.config.yAxis.min = graphCell.yRange[0]
			// this.config.yAxis.max = graphCell.yRange[1]

			this.config.yAxis.events = {
				afterSetExtremes: (event) => {
					if(event.trigger){
						console.log("set y range")
						graphCell.chart.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
						if(graphCell.ySync){
							this.props.onSyncY(this.props.id, [graphCell.yRange[0], graphCell.yRange[1]])
						}
					}
				}
			}

			this.config.chart.events = {
				load: function() {
					if(graphCell.xRange){
						this.xAxis[0].setExtremes(graphCell.xRange[0], graphCell.xRange[1])
						this.showResetZoom()
					}

					if(graphCell.yRange){
						this.yAxis[0].setExtremes(graphCell.yRange[0], graphCell.yRange[1])
					}
				}
			}
			return (
				<div>
					<StockChart config={this.config} ref={this.props.id} domProps = {{id: this.props.id}}></StockChart>
				</div>
			)
		}
	}
})

const AnnotationChart = observer(class AnnotationChart extends Component {
	constructor() {
		super()
		this.config = this.getDefaultConfig()
	}

	toolTipFormatter() {
		return '<b>' + this.series.name + '</b><br/>' + UsualChart.Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.point.low) +
		' - ' + UsualChart.Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.point.high) + '<br/>' + 
		"Duration: " + FileFormat.getTimeDurationStr(this.point.high - this.point.low)
	}

	getDefaultConfig() {
		const config = {
			chart: {
				type: 'columnrange',
				inverted: true,
				zoomType: 'y',
				spacing: [5,5,5,5]
			},
			title: {
				text: ''
			},
			scrollbar: {
				enabled: false
			},
			yAxis: {
				type: 'datetime',
				title: null,
				crosshair: true
			},
			plotOptions: {
				columnrange: {
					grouping: false,
					pointPadding: 0,
					stickyTracking: false
				}
			},
			legend: {
				enabled: true,
				itemWidth: 150
			},
			credits: {
				enabled: false
			},
			tooltip: {
				formatter: this.toolTipFormatter,
				followPointer: true
			}
		}
		return config
	}

	componentDidUpdate() {
		if(this.refs[this.props.id]){		
			this.props.graphCell.chart = this.refs[this.props.id].getChart()
		}
	}

	toggleHeightMode() {
		if(this.props.graphCell.heightMode == "compact"){
			this.config.chart.height = 150
			this.config.legend.enabled = false
		}else{
			this.config.chart.height = null
			this.config.legend.enabled = true
		}
	}

	toggleDisplayMode() {
		if(this.props.graphCell.displayMode == "scroll"){
			this.config.chart.width = 20000
		}else{
			this.config.chart.width = null
		}
	}

	render() {
		this.reactToXRangeChange = mobx.reaction(() => 	this.props.graphCell.xRange, xRange => {
			console.log("react to x range change called")
			this.props.graphCell.chart.yAxis[0].setExtremes(xRange[0], xRange[1])
		})
		console.log(this.props.graphCell.isLoading)
		if(this.props.graphCell.isLoading){
			return <div id={this.props.id}>no data</div>
		}else{
			this.toggleDisplayMode()
			this.toggleHeightMode()
			this.config.series = this.props.graphCell.data
			// set extreme handler
			this.config.yAxis.events = {
				afterSetExtremes: (event) => {
					console.log("after set extremes")
					this.props.graphCell.xRange = [event.min, event.max]
					if(this.props.graphCell.xSync){
						this.props.onSyncX(this.props.id, [event.min, event.max])
					}
				}
			}
			return (
				<div>
					<UsualChart config={this.config} ref={this.props.id} domProps = {{id: this.props.id}}></UsualChart>
				</div>
			)
		}
	}
})

const CategoryChart = observer(class CategoryChart extends Component {
	constructor() {
		super()
		this.config = {
			chart: {
				type: 'columnrange',
				inverted: true,
				zoomType: 'y'
			},
			title: {
				text: ''
			},
			scrollbar: {
				enabled: false
			},
			yAxis: {
				type: 'datetime',
				title: null,
				labels: {
					enabled: true
				}
			},
			xAxis: {
				labels: {
					enabled: true	
				}
			},
			plotOptions: {
				columnrange: {
					grouping: false,
					pointPadding: 0,
					groupPadding: 0,
					stickyTracking: false
				}
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: true,
				itemWidth: 150
			},
			responsive: {
				rules: [
					{
						condition: {
							maxHeight: 100
						},
						chartOptions: {
							legend: {
								enabled: false
							},
							xAxis: {
								labels: {
									enabled: false
								}
							}
						}
					}
				]
			}
		}
	}

	componentDidUpdate() {
		if(this.refs[this.props.id]){		
			this.props.graphCell.chart = this.refs[this.props.id].getChart()
			this.props.graphCell.chart.setSize(undefined, this.props.graphCell.height, false)
		}
	}

	render() {
		this.reactToXRangeChange = mobx.reaction(() => 	this.props.graphCell.xRange, xRange => {
			console.log("react to x range change called")
			this.props.graphCell.chart.yAxis[0].setExtremes(xRange[0], xRange[1])
		})
		console.log(this.props.graphCell.isLoading)
		if(this.props.graphCell.isLoading){
			return <div id={this.props.id}>no data</div>
		}else{
			if(this.props.graphCell.displayMode == "scroll"){
				this.config.chart.width = 20000
			}else if(this.props.graphCell.displayMode == "fit"){
				this.config.chart.width = null
			}
			this.config.series = this.props.graphCell.data.slice()
			const categories = this.config.series.pop()
			this.config.xAxis = {
				categories: categories
			}
			// set extreme handler
			this.config.yAxis = {
				events: {
					afterSetExtremes: (event) => {
						if(this.props.graphCell.xRange != null){
							if(this.props.graphCell.xRange[0] == event.min && this.props.graphCell.xRange[1] == event.max){
								return
							}
						}
						this.props.graphCell.xRange = [event.min, event.max]
						if(this.props.graphCell.syncX){
							this.props.onSyncX(this.props.id, [event.min, event.max])
						}
					}
				}
			}
			return (
				<div>
					<UsualChart config={this.config} ref={this.props.id} domProps = {{id: this.props.id}}></UsualChart>
				</div>
			)
		}
	}
})

const FileDropZone = observer(class FileDropZone extends Component {

	convertSensorData (data){
		var columns = data.slice(0, 1)[0]
		console.log(columns)
		data.splice(0,1)
		columns.splice(0, 1)
		return columns.map((colName, col) => {
			const data2 = data.map((row) => {
			return [Date.parse(row[0]), parseFloat(row[col + 1])];
		});
		// only turn on the first three series by default
		const visible = col < 3 ? true : false;
			return {
				data: data2,
				type: 'line',
				name: columns[col],
				visible: visible,
				tooltip: {
				valueDecimals: 2
			}
			};
		});
	}

	convertAnnotationData = function(data){
		data.splice(0,1);
		const series = {};
		const chartSeries = [];
		const xInds = {};
		var i = 0;
		data.map((row) => {
			if(!series[row[3]]){
				series[row[3]] = []
				xInds[row[3]] = i++;
			}
			series[row[3]].push([xInds[row[3]], Date.parse(row[1]), Date.parse(row[2])])
		});

		Object.keys(series).forEach((key, index) => {
			chartSeries.push({
				name: key,
				data: series[key]
			})
		});
		console.log(chartSeries)
		return chartSeries;
	}

	convertCategoryData = function(data, shareOntology = false){
		const columns = data.slice(0, 1)[0];
		data.splice(0,1);
		var i = 0;
		
		columns.splice(0, 2);
		var series = {};
		var chartSeries = [];

		data.map((row) => {
			
			columns.map((col, ind) => {
				const serieKey = shareOntology ? row[ind + 2] : col + "_" + row[ind + 2];
				if(!series[serieKey]){
					series[serieKey] = []
				}
				series[serieKey].push([ind, Date.parse(row[0]), Date.parse(row[1])])
			})
		});

		Object.keys(series).forEach((key, index) => {
			chartSeries.push({
				name: key,
				data: series[key]
			})
		});
		chartSeries.push(columns)
		console.log(chartSeries)
		return chartSeries;
	}

	convertData(fileType, data){
		switch(fileType){
			case "sensor":
				return this.convertSensorData(data)
			case "annotation":
				return this.convertAnnotationData(data)
			case "prediction":
			case "class":
				return this.convertCategoryData(data, false)
			default:
				return this.convertSensorData(data)
		}
	}

	onDrop(acceptedFiles, rejectedFiles) {

		const uistore = this.props.uistore
		
		// creat new graph cells
		acceptedFiles.forEach((file, index) => {
			console.log(file)
			const newCell = {
				width: uistore.defaultSettings.width,
				heightMode: uistore.defaultSettings.heightMode,
				visible: true,
				source: file,
				title: FileFormat.getSensorName(file.name) + "-" + FileFormat.getSensorId(file.name),
				fileType: FileFormat.getFileType(file.name),
				isLoading: true,
				status: "processing",
				displayMode: "fit",
				pointMode: "line",
				yRange: [uistore.defaultSettings.yRange[0], uistore.defaultSettings.yRange[1]],
				xRange: [null, null],
				xSync: uistore.defaultSettings.xSync,
				ySync: uistore.defaultSettings.ySync
			}
			console.log(newCell.fileType)
			const graphKey = file.name.replace(/\./g,'-')
			console.log(graphKey)
			uistore.addGraphCell(graphKey, newCell)
			// load and plot
			Papa.parse(file, {
				skipEmptyLines: true,
				dynamicTyping: true,
				complete: (result) => {
					console.log("file loaded")
					const cell = uistore.graphCells.get(graphKey);
					cell.data = this.convertData(cell.fileType, result.data)
					cell.isLoading = false
					cell.status = "success"
				}
			})
		});
	}
	render () {
		return (
				<Dropzone className='filedrop' 			activeClassName='filedropActive'
				accept='.csv' onDrop={this.onDrop.bind(this)}>
					<Card>
					<h4 style={{textAlign: "center"}}>mHealth visualizer - v1.0.1</h4>
					<br />
					<p style={{textAlign: "center"}}><img style={{borderRadius: "50%", width: "70px", height: "auto"}} src={LogoImage} alt=""/></p>
					<p style={{textAlign: "center"}}>Drag files or click here to load</p>
					</Card>
				</Dropzone>
		)
	}
})

const GraphCellSelection = observer((props) => {
	return (
		<div>
			<h4>Selection</h4>
			<p>{props.timespan}</p>
			<p>{props.duration}</p>
		</div>
	)
});

const GraphCellControl = observer(class GraphCellControl extends Component {

	render () {
		return (
			<Row type="flex" gutter={24}>
				<Col span={12}>
					<GraphCellSelection timespan="from - to"
						duration="20 seconds" />
				</Col>
				<Col span={12}>
					<h4>Controls</h4>
					<p><Button icon="download" shape="circle"></Button></p>
				</Col>
			</Row>
		)
	}
})

const GraphCell = observer(class GraphCell extends Component {

	changeWidth (width) {
		this.props.graphCell.width = width;
	}

	getChart (graphKey, graphCell) {
		switch(graphCell.fileType){
			case "sensor":
				console.log("sensor chart")
				return <SensorChart id={graphKey} graphCell={graphCell} onSyncX={this.props.onSyncX} onSyncY={this.props.onSyncY}></SensorChart>
			case "annotation":
				console.log("annotation chart")
				return <AnnotationChart id={graphKey} graphCell={graphCell} onSyncX={this.props.onSyncX}></AnnotationChart>
			case "prediction":
			case "class":
				console.log(graphCell.fileType + " chart")
				return <CategoryChart id={graphKey} graphCell={graphCell} onSyncX={this.props.onSyncX}></CategoryChart>
			default:
				return <SensorChart id={graphKey} graphCell={graphCell} onSyncX={this.props.onSyncX} onSyncY={this.props.onSyncY}></SensorChart>
		}
	}

	componentDidUpdate() {
		if(this.props.graphCell.chart && this.props.graphCell.displayMode == "fit"){
			this.props.graphCell.chart.reflow();
		}
	}

	render () {
		
		const chart = <p>A chart</p>;
		const display = this.props.graphCell.visible ? "block" : "none";
		return (
			<Col span={this.props.graphCell.width} style={{display: display}}>
				<h4 style={{backgroundColor: "white", textAlign:"center"}}>{this.props.graphCell.title}</h4>
					<Row type='flex' justify='space-between'>
						<Col span={24}>
							{this.getChart(this.props.graphKey, this.props.graphCell)}
						</Col>
					</Row>
					{/*<GraphCellControl graphCell={graphCell} graphKey={graphKey} />*/}
			</Col>
		)
	}
})

const GraphCellsContainer = observer((props) => {
	console.log("graph cell container called")
	return (
		<Row type='flex' className='chart-container' style={{ backgroundColor:"#e9e9e9"}}>
			{props.uistore.graphCells.keys().map((graphKey, index) => {
				return (
					<GraphCell key={graphKey} graphCell={props.uistore.graphCells.get(graphKey)} graphKey={graphKey} onSyncX={props.uistore.handleSyncX.bind(this)} onSyncY={props.uistore.handleSyncY.bind(this)} />
				)
			})}
		</Row>
	)
})

const PopoverMenu = observer(class PopoverMenu extends Component {

	showPointMode(enablePointMode) {
		var pointMode;
		if(enablePointMode){
			pointMode = <div><h4>Point mode</h4>
				<Radio.Group onChange={this.props.onPointModeChange} defaultValue="line">
					<Radio.Button value="line">Line</Radio.Button>
					<Radio.Button value="step">Step</Radio.Button>
					<Radio.Button value="spline">Spline</Radio.Button>
			</Radio.Group>
			</div>
		}else{
			<span></span>
		}
		return pointMode
	}

	render () {
		return (
			<div style={{width: this.props.menuWidth}}>
				<h4>Window width</h4>
				<Slider min={8} max={24} defaultValue={this.props.defaultWindowWidthSliderValue} onAfterChange={this.props.afterWindowWidthSliderChange} step={4} dots={true} />
				
				<h4>Display mode</h4>

					{/*<Radio.Group onChange={this.props.onDisplayModeChange} defaultValue="fit">
						<Radio.Button value="fit">Fit mode</Radio.Button>
						<Radio.Button value="scroll">Scroll mode</Radio.Button>
					</Radio.Group>*/}
					<div style={{height:"5px"}}></div>
					<Radio.Group onChange={this.props.onHeightModeChange} defaultValue={this.props.defaultHeightMode}>
						<Radio.Button value="standard">Standard mode</Radio.Button>
						<Radio.Button value="compact">Compact mode</Radio.Button>
					</Radio.Group>
	
				
				{this.showPointMode(this.props.enablePointMode)}
				<h4 style={{marginTop: "5px"}}><span>Sync X axis</span> <Switch defaultChecked={this.props.defaultXsyncStatus} size="small" onChange={this.props.onSyncXChange} /></h4>
				<h4 style={{marginTop: "5px"}}><span>Sync Y axis</span> <Switch defaultChecked={this.props.defaultYsyncStatus} size="small" disabled={this.props.ySyncDisabled}/></h4>
				<h4>Y range</h4>
				<InputNumber min={-10} max={10} step={0.1} defaultValue={this.props.defaultYRange[0]} formatter={value => `${value}(g)`} parser={value => value.replace('(g)', '')} onChange={this.props.onMinYChange}></InputNumber><span> - </span>
				<InputNumber min={-10} max={10} step={0.1} defaultValue={this.props.defaultYRange[1]} formatter={value => `${value}(g)`} parser={value => value.replace('(g)', '')} onChange={this.props.onMaxYChange}></InputNumber>		
			</div>	
		)
	}
})

const LoadedDataLabel = observer(class LoadedDataLabel extends Component {
	constructor() {
		super()
	}

	changeWidth (width) {
		this.cell.width = width;
	}

	changeDisplayMode (event) {
		this.cell.displayMode = event.target.value;
	}

	changeHeightMode (event) {
		this.cell.heightMode = event.target.value;
	}

	changePointMode (event) {
		this.cell.pointMode = event.target.value;
	}
	
	changeSyncXStatus (checked) {
		this.cell.xSync = checked
	}

	changeMinY (value) {
		let temp = this.cell.yRange.slice()
		this.cell.yRange = [value, temp[1]]
	}

	changeMaxY (value) {
		let temp = this.cell.yRange.slice()
		this.cell.yRange = [temp[0], value]
	}

	render () {
		this.cell = this.props.uistore.graphCells.get(this.props.graphKey)

		var ySyncDisabled = false;
		var enablePointMode = true;

		switch(this.cell.fileType){
			case "sensor":
				ySyncDisabled = false;
				enablePointMode = true;
				break;
			case "annotation":
			case "prediction":
			case "class":
				ySyncDisabled = true;
				enablePointMode = false;
				break;
		}

		return <Popover placement="leftTop" 
						content={
							<PopoverMenu afterWindowWidthSliderChange={this.changeWidth.bind(this)} defaultWindowWidthSliderValue={this.cell.width} defaultXsyncStatus={this.cell.xSync} defaultYsyncStatus={this.cell.ySync} defaultHeightMode={this.cell.heightMode}onDisplayModeChange={this.changeDisplayMode.bind(this)} 
							onHeightModeChange={this.changeHeightMode.bind(this)}
							ySyncDisabled={ySyncDisabled} enablePointMode={enablePointMode} onPointModeChange={this.changePointMode.bind(this)} menuWidth={250} onSyncXChange={this.changeSyncXStatus.bind(this)} defaultYRange={this.cell.yRange} onMinYChange={this.changeMinY.bind(this)} onMaxYChange={this.changeMaxY.bind(this)}/>
				}>
			<Tag key={this.props.graphKey} closable={true} color="blue" onClose={() => {this.props.uistore.removeGraphCell(this.props.graphKey)}}>
			<Badge status={this.cell.status} />
			<Checkbox defaultChecked={this.cell.visible} onChange={() => {this.props.uistore.toggleGraphCell(this.props.graphKey)}}>{this.cell.title}</Checkbox>
			</Tag>
		</Popover>
	}
}) 

const LoadedDataTab = observer(class LoadedDataTab extends Component{
	render () {
	if(!this.props.uistore) return <p>No data is loaded</p>
	console.log("called loaded tab")
	return (
		<div>
			{this.props.uistore.graphCells.keys().map((graphKey, index) => {
				return (
					<LoadedDataLabel uistore={this.props.uistore} graphKey={graphKey}></LoadedDataLabel>
				)
			})}
		</div>
	)
	}
})

const SettingTab = observer(class SettingTab extends Component{

	changeWidth(newWidth) {
		this.props.uistore.defaultSettings.width = newWidth
	}

	changeXsync(checked) {
		this.props.uistore.defaultSettings.xSync = checked
	}

	changeYsync(checked) {
		this.props.uistore.defaultSettings.ySync = checked
	}

	changeHeightMode(value) {
		this.props.uistore.defaultSettings.heightMode = value
	}

	changeMinYRange(value) {
		console.log("common y range change")
		this.props.uistore.defaultSettings.yRange[0] = value
	}

	changeMaxYRange(value) {
		console.log("common y range change")
		this.props.uistore.defaultSettings.yRange[1] = value
	}

	render () {
		return <div>
			<Row>
				<h3>Default display settings</h3>
				
				<Col lg={8}>
					<b>Window width</b>
					<Slider min={8} max={24} defaultValue={this.props.uistore.defaultSettings.width} onAfterChange={this.changeWidth.bind(this)} step={4} dots={true} />
				</Col>
			</Row>
			<Row>
				<Checkbox defaultChecked={this.props.uistore.defaultSettings.xSync} onChange={this.changeXsync.bind(this)}>Sync x axis</Checkbox>
				<Checkbox defaultChecked={this.props.uistore.defaultSettings.ySync} onChange={this.changeYsync.bind(this)}>Sync y axis</Checkbox>
				<b>Common Y range: </b>
				<InputNumber min={-10} max={10} step={0.1} defaultValue={this.props.uistore.defaultSettings.yRange[0]}formatter={value => `${value}(g)`} parser={value => value.replace('(g)', '')} onChange={this.changeMinYRange.bind(this)}></InputNumber><span> - </span>
				<InputNumber min={-10} max={10} step={0.1} defaultValue={this.props.uistore.defaultSettings.yRange[1]}formatter={value => `${value}(g)`} parser={value => value.replace('(g)', '')} onChange={this.changeMaxYRange.bind(this)}></InputNumber><span>        </span>
				<b>Display mode: </b>
				<Radio.Group onChange={this.changeHeightMode.bind(this)} defaultValue={this.props.uistore.defaultSettings.heightMode}>
					<Radio.Button value="standard">Standard mode</Radio.Button>
					<Radio.Button value="compact">Compact mode</Radio.Button>
				</Radio.Group>
			</Row>
		</div>
	}
})

class App extends Component {
	constructor() {
		super();
		this.observableUIStore = new ObservableUIStore();
	}

	addGraphCell () {
		const config = {title: "from ui store", width: 8, visible: true}
		this.observableUIStore.addGraphCell(null, config);
	}

	removeGraphCell () {
		this.observableUIStore.removeGraphCell(null);
	}

	showWarning() {
		if(platform.name !== "Chrome"){
			return <Alert message={<p>Please switch to <b>Chrome</b> in order to use this App, other browsers are not compatible.</p>} banner />
		}else{
			return
		}
	}

	onClickFileFormat () {
		Modal.info({
		title: 'Accepted file formats description',
		content: (
		<iframe src="https://qutang.gitbooks.io/mhealth-specification/content/" frameborder="0" style={{width: 650, height: 400, border:"none"}}></iframe>
		),
		width: 800,
		okText:"I got it",
		onOk() {},
  });

	}

	onClickReportBug () {
		window.open("https://github.com/qutang/mhealth-data-visualizer/issues/new")
	}

	onResize (contentRect) {
		this.observableUIStore.headerHeight = contentRect.bounds.height
	}

	render () {
		return (
			<div>
				{this.showWarning()}
					<Row gutter={8} style={{position: "fixed", width:"100%", zIndex:1000, backgroundColor: "white", padding: 10, borderBottom: "2px #e9e9e9 solid"}}>
					<Col lg={5} md={24}>
						<FileDropZone uistore={this.observableUIStore} />
					</Col>
					<Col lg={19} md={24}>
						<Tabs size="small">
							<Tabs.TabPane tab="Loaded data" key="1">
								<LoadedDataTab uistore={this.observableUIStore}></LoadedDataTab>
							</Tabs.TabPane>
							<Tabs.TabPane tab="Settings" key="2">
								<SettingTab uistore={this.observableUIStore}></SettingTab>
							</Tabs.TabPane>
							<Tabs.TabPane tab="Help" key="3">

								<p><Button icon='file' onClick={this.onClickFileFormat}>Accepted file format</Button></p>
								<div style={{height:"5px"}}></div>
								<p><Button icon='github' onClick={this.onClickReportBug}>Report bugs or request features</Button></p>
							</Tabs.TabPane>
						</Tabs>
					</Col>
					
					</Row>
					
				<Row>
					<Col lg={12} md={24} style={{height: 110}}></Col>
					<Col lg={12} md={24} style={{height: 180}}></Col>
				</Row>
				<GraphCellsContainer uistore={this.observableUIStore}  />
				{/*<DevTools />*/}
				<p style={{position:'fixed', bottom:0, right:0, marginBottom: "10px", marginRight:"15px"}}>Developed by  <a href="https://qutang.github.io" style={{fontFamily: '"Sacramento", cursive', fontSize: 25}}>Qu Tang</a> in 2017</p>
			</div>
		)
	}
}

export default App