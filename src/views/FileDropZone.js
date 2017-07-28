import React, { Component } from 'react';
import * as mobx from 'mobx';
import {observer} from "mobx-react"
import FileFormat from '../support/format'
import Papa from 'papaparse'
import Dropzone from 'react-dropzone';
import LogoImage from '../logo.png'
import {Card} from 'antd'

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
			<Dropzone className='filedrop' 	activeClassName='filedropActive'
				accept='.csv' onDrop={this.onDrop.bind(this)}>
				<Card style={{margin: "5px"}}>
				<h4 style={{textAlign: "center"}}>mHealth visualizer - v1.0.4</h4>
				<br />
				<p style={{textAlign: "center"}}><img style={{borderRadius: "50%", width: "70px", height: "auto"}} src={LogoImage} alt=""/></p>
				<p style={{textAlign: "center"}}>Drag files or click here to load</p>
				</Card>
			</Dropzone>
		)
	}
})

export default FileDropZone;