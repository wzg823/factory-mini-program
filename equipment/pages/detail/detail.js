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
        baseInfo: null,
        chartType: app.globalData.chartType,
        runningValue: '',
        runningString:'',
        nowStatus:null,
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
        alarmData: [{
                value: '超程报警',
                times: 20
            },
            {
                value: '超程报警',
                times: 20
            },
            {
                value: '超程报警',
                times: 20
            },
            {
                value: '超程报警',
                times: 20
            },
            {
                value: '超程报警',
                times: 20
            }
        ],
        timeList: [{
                value: "维修1次，大修1次，保养4次，点检24",
                time: '2023年'
            },
            {
                value: "保养1次，点检2次",
                time: '12月'
            },
            {
                value: "维修1次，大修1次，保养1次，点检2次",
                time: '11月'
            },
            {
                value: "姓修，工单号: EX-20231131-0101 更换齿轮箱坦克链",
                time: '31日'
            },
            {
                value: "大修，工单号: DX-20231131-0001 设备大修",
                time: ''
            },
            {
                value: "保养，保养单号: BY-20231117-0001 三级保养",
                time: '17日'
            },
            {
                value: "点检，点检单号: Du-20231117-0001 进现场整音发现齿轮箱坦克链运转有异 响，不顺畅",
                time: ''
            },
            {
                value: "点检，点检单号: Du-20231117-0001 进现场整音发现齿轮箱坦克链运转有异 响，不顺畅",
                time: '2日'
            }
        ],
        dateRatecroup: 0, //稼动率
        totalRatecroup: [], //7天稼动率数据
        dateRateproduction: 0, //产量
        totalRateproduction: [], //7天产量数据
        ratebootData: null //运行情况
    },
    onLoad(options) {
        console.log(options.id)
        this.getProductionList(options.id) //设备列表
        this.getCommon(options.id) //基础信息
        this.getRunning(options.id) //运行状态
        this.getRealtime(options.id) //实时运行统计
        this.getRatecroup(options.id) //稼动率分析
        this.getRateproduction(options.id) //产量分析
        this.getRateboot(options.id) // 运行情况对比
        this.getrunningStatus(options.id) // 24小时运行情况
    },
    getProductionList(optionId) {
        request('device/info/production-list', 'GET').then(res => {
            console.log(res)
            if (res.code == 0) {
                let shops = []
                res.data && res.data.forEach(item => {
                    let arr = []
                    item.list && item.list.forEach(items => {
                        if (items.deviceId == optionId) {
                            arr.push({
                                deviceId: `${items.id.c[0]}${items.id.c[1]}`,
                                deviceName: items.code,
                                checked: true
                            })
                        } else {
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
                this.setData({
                    shops
                })
            }
        })
    },
    getCommon(device_id) {
        request('device/info/basic', 'GET', {
            device_id
        }).then(res => {
            if (res.code == 0) {
                this.setData({
                    baseInfo: res.data
                })
            }
        })
    },
    getRealtime(device_id) {
        request('device/info/state-run', 'GET', {
            device_id
        }).then(res => {
            if (res.code == 0) {
                this.setData({
                    realtimeData: res.data
                })
            }
        })
    },
    getRatecroup(device_id) {
        request('device/info/rate-croup', 'GET', {
            device_id,
            start: moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
            end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }).then(res => {
            if (res.code == 0) {
                this.setData({
                    dateRatecroup: res.data[res.data.length - 1].crop_rate,
                    totalRatecroup: res.data
                })
            }
        })
    },
    getRateproduction(device_id) {
        request('device/info/rate-production', 'GET', {
            device_id,
            start: moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
            end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }).then(res => {
            if (res.code == 0) {
                this.setData({
                    dateRateproduction: res.data[res.data.length - 1].production,
                    totalRateproduction: res.data
                })
            }
        })
    },
    getRunning(device_id) {
        request('device/info/state-running', 'GET', {
            device_id,
            start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }).then(res => {
            console.log(res)
            let runningTime = null
            res.data && res.data.map(item => {
                // 获取当日运行总时长
                if (item.status == 'run') {
                    runningTime += moment(item.end_time).diff(moment(item.start_time))
                }
            })
            this.getTime(runningTime)
        })
    },
    getTime(value) {
        const duration = moment.duration(value);
        const hours = duration.asHours();
        const minutesFloat = hours - Math.floor(hours);
        const minutes = Math.floor(minutesFloat * 60);
        const seconds = duration.milliseconds() / 1000 % 60;
        let timeString = `${Math.floor(hours)}小时${minutes.toString().padStart(2, '0')}分${seconds.toFixed(0).toString().padStart(2, '0')}秒`;
        this.setData({
            runningValue: timeString
        })
    },
    getRateboot(device_id) {
        request('device/info/rate-boot', 'GET', {
            device_id,
            start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }).then(res => {
            if (res.code == 0) {
                this.setData({
                    ratebootData: res.data
                })
            }
        })
    },
    calculateTimeRatioInLast24Hours(date) {
        let now = new Date();
        let diff = now - date;
        let diffInSeconds = Math.floor(diff / 1000);
        let ratio = 100 - (diffInSeconds / 86400) * 100;
        return parseInt(ratio);
    },
    getrunningStatus(device_id) {
        request('device/info/state-running', 'GET', {
            device_id,
            end: moment().format('YYYY-MM-DD HH:mm:ss'),
            start: moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        }).then(res => {
            if (res.code == 0) {
                res.data && res.data.forEach(item => {
                    let diff = moment(item.end_time).diff(moment(item.start_time)) / 1000
                    let width = parseInt((diff / (24 * 60 * 60)) * 100)
                    item.width = width
                    let position = this.calculateTimeRatioInLast24Hours(moment(item.start_time))
                    item.position = position
                    switch (item.status) {
                        case 'run':
                            item.style = `width:${width == 0 ? '1':width}%;left:${position}%;background-color:#35C984`;
                            item.bg = 'background-color:#35C984'
                            item.statusDesc = '运行'
                            break;
                        case 'alarm':
                            item.style = `width:${width == 0 ? '1':width}%;left:${position}%;background-color:#E93800`;
                            item.bg = 'background-color:#E93800';
                            item.statusDesc = '报警'
                            break;
                        case 'standby':
                            item.style = `width:${width == 0 ? '1':width}%;left:${position}%;background-color:#0A78F5`;
                            item.bg = 'background-color:#0A78F5';
                            item.statusDesc = '待机'
                            break;
                        case 'manual':
                            item.style = `width:${width == 0 ? '1':width}%;left:${position}%;background-color:#FF9100`;
                            item.bg = 'background-color:#FF9100';
                            item.statusDesc = '调机'
                            break;
                        case 'off':
                            item.style = `width:${width == 0 ? '1':width}%;left:${position}%;background-color:#111111`;
                            item.bg = 'background-color:#111111';
                            item.statusDesc = '关机'
                            break;
                        case 'offline':
                            item.style = `width:${width == 0 ? '1':width}%;left:${position}%;background-color:#999999`;
                            item.bg = 'background-color:#999999';
                            item.statusDesc = '离线'
                            break;
                    }
                })
                let categorizedItems = res.data.reduce((acc, item) => {
                    if (!acc[item.status]) {
                        acc[item.status] = [];
                    }
                    acc[item.status].push(item);
                    return acc;
                }, {});
                let categoryArrays = Object.keys(categorizedItems).map(key => categorizedItems[key]);
                console.log(categorizedItems)
                console.log(res.data[res.data.length - 1])
                this.setData({
                    runningChartData: categorizedItems,
                    nowStatus:res.data[res.data.length - 1]
                })
            }
        })
    },
    getRunningTime(e) {
        console.log(e)
        let type = e.currentTarget.dataset.type
        let data = this.data.runningChartData
        let str = []
        data[type] && data[type].forEach(item=>{
            str.push(item.start_time + ' - ' + item.end_time)
        })
        this.setData({
            runningString:str
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
        ratecroupData && ratecroupData.forEach(item => {
            let date = moment(item.date).format('MM/DD')
            dateValue.push(date)
            averageCroprateData.push(item.average_crop_rate)
            averageStartupData.push(item.average_startup_rate)
            cropData.push(item.crop_rate)
        })
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
                axisLabel: {
                    interval: 0
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
    runningBar() { //运行情况对比
        let bootData = this.data.ratebootData[0]
        let arr1 = Object.values(bootData.today)
        let arr2 = Object.values(bootData.yesterday)
        let arr3 = Object.values(bootData.average)
        var runningBarOption = {
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
                top: '10rpx',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0
                },
                data: ['报警', '开机', '循环', '调机', '计划', '运行', '待机', ]
            }],
            yAxis: [{
                type: 'value',
                min: 0
            }],
            series: [{
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: '#0A78F5',
                    },
                    data: arr1
                },
                {
                    type: 'bar',
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: '#35C984',
                    },
                    data: arr3
                },
                {
                    type: 'bar',
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: '#E93800',
                    },
                    data: arr2
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
        productionData && productionData.forEach(item => {
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
                axisLabel: {
                    interval: 0
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
                // this.horizontalBar()
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
                // this.horizontalBar()
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