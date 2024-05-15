// pages/equipment/detail.js
const app = getApp();  
const request = require('../../../utils/request');
import * as echarts from '../../../ec-canvas/echarts';
import moment from 'moment';
let chart = null;

function initChart(canvas, width, height, dpr) { //运行状态
    chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(chart);
    chart.setOption(option);
    return chart;
}
let chart2 = null;

function initChart2(canvas, width, height, dpr) { //稼动率
    chart2 = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(chart2);
    chart2.setOption(option);
    return chart2;
}
let chart3 = null;

function initChart3(canvas, width, height, dpr) { //运行情况对比
    chart3 = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(chart3);
    chart3.setOption(option);
    return chart3;
}
let chart4 = null;

function initChart4(canvas, width, height, dpr) { //产量分析
    chart4 = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(chart4);
    chart4.setOption(option);
    return chart4;
}
var option = {}
Page({
    data: {
        navIndex: 0,
        shops: [],
        currentShop: 0,
        btnToggle: 0,
        baseInfo:null,
        chartType:app.globalData.chartType,
        runningValue:'',
        ec1: {
            onInit: initChart
        },
        ec2: {
            onInit: initChart2
        },
        ec3: {
            onInit: initChart3
        },
        ec4: {
            onInit: initChart4
        },
        alarmData:[
            {
                value:'超程报警',
                times:20
            },
            {
                value:'超程报警',
                times:20
            },
            {
                value:'超程报警',
                times:20
            },
            {
                value:'超程报警',
                times:20
            },
            {
                value:'超程报警',
                times:20
            }
        ],
        timeList:[
            {
                value:"姓修，工单号: EX-20231131-0101更换齿轮箱坦克链",
                time:'31日'
            },
            {
                value:"姓修，工单号: EX-20231131-0101更换齿轮箱坦克链",
                time:'31日'
            },
            {
                value:"姓修，工单号: EX-20231131-0101更换齿轮箱坦克链",
                time:'31日'
            },
            {
                value:"姓修，工单号: EX-20231131-0101更换齿轮箱坦克链",
                time:'31日'
            },
            {
                value:"姓修，工单号: EX-20231131-0101更换齿轮箱坦克链",
                time:'31日'
            }
        ],
        dateRatecroup:0, //稼动率
        totalRatecroup:[],//7天稼动率数据
        dateRateproduction:0, //产量
        totalRateproduction:[], //7天产量数据
    },
    onLoad(options) {
        console.log(options.id)
        this.getProductionList(options.id) //设备列表
        this.getCommon(options.id) //基础信息
        this.getRunning(options.id) //运行状态
        this.getRealtime(options.id) //实时运行统计
        this.getRatecroup(options.id) //稼动率分析
        this.getRateproduction(options) //产量分析
    },
    getProductionList(optionId){
        request('device/info/production-list','GET').then(res=>{
            console.log(res)
            if(res.code == 0){
                let shops = []
                res.data && res.data.forEach(item=>{
                    let arr = []
                    item.list && item.list.forEach(items=>{
                        if(items.deviceId == optionId){
                            arr.push({
                                deviceId: `${items.id.c[0]}${items.id.c[1]}`,
                                deviceName: items.code,
                                checked: true
                            })
                        }else{
                            arr.push({
                                deviceId: `${items.id.c[0]}${items.id.c[1]}`,
                                deviceName: items.code,
                                checked: false
                            })
                        }
                        
                    })
                    shops.push({
                        id: item.id,
                        name: item.value,
                        expanded: false,
                        devices: arr
                    })
                })
                this.setData({shops})
            }
        })
    },
    getCommon(device_id){
        request('device/info/basic','GET',{device_id}).then(res=>{
            if(res.code == 0){
                this.setData({
                    baseInfo:res.data
                })
            }
        })
    },
    getRealtime(device_id){
        request('device/info/state-run','GET',{device_id}).then(res=>{
            if(res.code == 0){
                this.setData({
                    realtimeData:res.data
                })
            }
        })
    },
    getRatecroup(device_id){
        request('device/info/rate-croup','GET',{
            device_id,
            start: moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
            end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }).then(res=>{
            if(res.code == 0){
                this.setData({
                    dateRatecroup:res.data[res.data.length - 1].crop_rate,
                    totalRatecroup:res.data
                })
            }
        })
    },
    getRateproduction(device_id){
        request('device/info/rate-production','GET',{
            device_id,
            start: moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
            end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }).then(res=>{
            if(res.code == 0){
                this.setData({
                    dateRateproduction:res.data[res.data.length - 1].production,
                    totalRateproduction:res.data
                })
            }
        })
    },
    getRunning(device_id){
        request('device/info/state-running','GET',{
            device_id,
            start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }).then(res=>{
            console.log(res)
            let runningTime = null
            res.data && res.data.map(item=>{
                // 获取当日运行总时长
                if(item.status == 'run'){
                    runningTime += moment(item.end_time).diff(moment(item.start_time))
                }
            })
            console.log('////////////////////////')
            console.log(runningTime)
            this.getTime(runningTime)
        })
    },
    getTime(value){
        const duration = moment.duration(value);  
        const hours = duration.asHours();
        const minutesFloat = hours - Math.floor(hours);
        const minutes = Math.floor(minutesFloat * 60);
        const seconds = duration.milliseconds() / 1000 % 60;
        let timeString  = `${Math.floor(hours)}小时${minutes.toString().padStart(2, '0')}分${seconds.toFixed(0).toString().padStart(2, '0')}秒`; 
        console.log(timeString)
        this.setData({
            runningValue:timeString
        })
    },
    horizontalBar() { // 实时运行状态
        var horziontalBarOption = {
            title: {
                show: false
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    return '';
                }
            },
            grid: {
                left: '0',
                right: '10rpx',
                bottom: '0',
                top: '24rpx',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                min: 0,
                max: 24,
                interval: 24,
                axisLine: {
                    lineStyle: {
                        color: '#DDDDDD'
                    },
                    show: true // 隐藏 x 轴线  
                },
                axisTick: {
                    lineStyle: {
                        color: '#DDDDDD'
                    },
                    show: true // 隐藏 x 轴刻度线  
                },
            },
            yAxis: {
                type: 'category',
                axisLine: {
                    show: false // 隐藏 x 轴线  
                },
                axisTick: {
                    textStyle: {
                        color: '#111111'
                    },
                    show: false // 隐藏 x 轴刻度线  
                },
                data: ['离线', '关机', '报警', '调机', '待机', '运行']
            },
            series: [{
                    name: 'Placeholder',
                    type: 'bar',
                    stack: 'Total',
                    barWidth: 10,
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    },
                    emphasis: {
                        itemStyle: {
                            borderColor: 'transparent',
                            color: 'transparent'
                        }
                    },
                    data: [{
                            value: 0,
                            itemStyle: {
                                color: '#111111'
                            }
                        },
                        {
                            value: 12,
                            itemStyle: {
                                color: '#fff'
                            }
                        },
                        {
                            value: 18,
                            itemStyle: {
                                color: '#fff'
                            }
                        },
                        {
                            value: 21,
                            itemStyle: {
                                color: '#fff'
                            }
                        },
                        {
                            value: 22,
                            itemStyle: {
                                color: '#fff'
                            }
                        },
                        {
                            value: 8,
                            itemStyle: {
                                color: '#fff'
                            }
                        },
                    ]
                },
                {
                    name: 'Life Cost',
                    type: 'bar',
                    stack: 'Total',
                    barWidth: 10,
                    label: {
                        show: false,
                    },
                    data: [{
                            value: 12,
                            itemStyle: {
                                color: '#999'
                            }
                        },
                        {
                            value: 13,
                            itemStyle: {
                                color: '#111'
                            }
                        },
                        {
                            value: 2,
                            itemStyle: {
                                color: '#E93800'
                            }
                        },
                        {
                            value: 1,
                            itemStyle: {
                                color: '#FF9100'
                            }
                        },
                        {
                            value: 2,
                            itemStyle: {
                                color: '#0A78F5'
                            }
                        },
                        {
                            value: 10,
                            itemStyle: {
                                color: '#35C984'
                            }
                        },
                    ]
                }
            ]
        };
        chart.setOption(horziontalBarOption)
    },
    stackedLine() { //稼动率
        let ratecroupData = this.data.totalRatecroup
        let dateValue = []
        let averageCroprateData = []
        let averageStartupData = []
        let cropData = []
        ratecroupData && ratecroupData.forEach(item=>{
            let date = moment(item.date).format('MM/DD')
            dateValue.push(date)
            averageCroprateData.push(item.average_crop_rate)
            averageStartupData.push(item.average_startup_rate)
            cropData.push(item.crop_rate)
        })
        console.log(averageCroprateData)
        console.log(averageStartupData)
        console.log(cropData)
        var stackedLineOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    return '';
                }
            },
            grid: {
                left: '0',
                right: '15rpx',
                bottom: '0',
                top: '10rpx',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    show: false // 隐藏 x 轴刻度线  
                },
                axisLabel:{
                    interval:0
                },
                data: dateValue
            },
            yAxis: {
                type: 'value',
                min: 0,
            },
            series: [{
                    name: '稼动率',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#0A78F5',
                            lineStyle: {
                                color: '#0A78F5',
                            }
                        }
                    },
                    
                    data: cropData
                },
                {
                    name: '设备平均稼动率',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#E93800',
                            lineStyle: {
                                color: '#E93800',
                            }
                        }
                    },
                    data: averageCroprateData
                },
                {
                    name: '开机率',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#35C984',
                            lineStyle: {
                                color: '#35C984',
                            }
                        }
                    },
                    data: averageStartupData
                }
            ]
        };
        chart2.setOption(stackedLineOption)
    },
    runningBar(){ //运行情况对比
        var runningBarOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
                left: '0',
                right: '10rpx',
                bottom: '0',
                top: '10rpx',
                containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                axisTick: { show: false },
                data: ['开机', '运行', '报警', '循环', '待机','计划','调机']
              }
            ],
            yAxis: [
              {
                type: 'value',
                min:0
              }
            ],
            series: [
              {
                type: 'bar',
                barGap: 0,
                emphasis: {
                  focus: 'series'
                },
                itemStyle: {
                    color: '#0A78F5',
                },
                data: [320, 332, 301, 334, 390]
              },
              {
                type: 'bar',
                emphasis: {
                  focus: 'series'
                },
                itemStyle: {
                    color: '#35C984',
                },
                data: [220, 182, 191, 234, 290]
              },
              {
                type: 'bar',
                emphasis: {
                  focus: 'series'
                },
                itemStyle: {
                    color: '#E93800',
                },
                data: [150, 232, 201, 154, 190]
              }
            ]
          };
        chart3.setOption(runningBarOption)
    },
    productionLine() { //产量分析
        let productionData = this.data.totalRateproduction
        let dateValue = []
        let proData = []
        let averageData = []
        productionData && productionData.forEach(item=>{
            let date = moment(item.date).format('MM/DD')
            dateValue.push(date)
            proData.push(item.production)
            averageData.push(item.average)
        })
        console.log(productionData)
        console.log(averageData)
        var productionOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    return '';
                }
            },
            grid: {
                left: '0',
                right: '15rpx',
                bottom: '0',
                top: '10rpx',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    show: false // 隐藏 x 轴刻度线  
                },
                axisLabel:{
                    interval:0
                },
                data: dateValue
            },
            yAxis: {
                type: 'value',
                min: 0,
            },
            series: [{
                    name: '产量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#0A78F5',
                            lineStyle: {
                                color: '#0A78F5',
                            }
                        }
                    },
                    data: proData
                },
                {
                    name: '设备平均产量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#E93800',
                            lineStyle: {
                                color: '#E93800',
                            }
                        }
                    },
                    data: averageData
                },
            ]
        };
        chart4.setOption(productionOption)
    },
    bindtapNav(e) {
        console.log(e.target.dataset.index)
        if (e.target.dataset.index == 1) {
            setTimeout(() => {
                this.horizontalBar()
            }, 500)
        }
        this.setData({
            navIndex: e.target.dataset.index,
            btnToggle: 0,
        })
    },
    toggleDevices: function (e) {
        const shopIndex = e.currentTarget.dataset.index;
        const shops = this.data.shops;
        shops[shopIndex].expanded = !shops[shopIndex].expanded;
        this.setData({
            shops,
            currentShop: shopIndex
        });
    },
    bindDevice(e) {
        let id = e.target.dataset.deviceId
        let shops = this.data.shops
        shops && shops.map(item => {
            item.devices && item.devices.map(items => {
                if (items.deviceId == id) {
                    items.checked = true
                } else {
                    items.checked = false
                }
            })
        })
        console.log(shops)
        this.setData({
            shops
        })
    },
    handleChartClick(params) {
        console.log(params)
        this.setData({
            clickedData: params
        });
    },
    getRunningType(e) {
        console.log(e.target.dataset.type)

    },
    bindAnalysisToggle() {
        this.setData({
            btnToggle: 0
        }, () => {
            setTimeout(() => {
                this.horizontalBar()
            }, 500)
        })
    },
    bindRealtimeToggle() {
        this.setData({
            btnToggle: 1
        }, () => {
            setTimeout(() => {
                this.stackedLine()
                this.runningBar()
                this.productionLine()
            }, 500)
        })
    }
})