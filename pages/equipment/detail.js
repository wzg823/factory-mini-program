// pages/equipment/detail.js
const request = require('../../utils/request');
import * as echarts from '../../ec-canvas/echarts';
let chart = null;
function initChart(canvas, width, height, dpr) {
    chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // 像素比
    });
    canvas.setChart(chart);
    var option = {
        title: {
            show:false
          },
          tooltip: {
            trigger: 'none',
            formatter: function (params) {
              return '';
            }
          },
          grid: {
            left: '0',
            right: '10rpx',
            bottom: '0',
            top:'24rpx',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            splitLine: { show: false },
            min:0,
            max:24,
            interval:24,
            axisLine: { 
                lineStyle:{
                    color:'#DDDDDD'
                }, 
                show: true // 隐藏 x 轴线  
            },  
            axisTick: {  
                lineStyle:{
                    color:'#DDDDDD'
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
                textStyle:{
                    color:'#111111'
                },
                show: false // 隐藏 x 轴刻度线  
            },  
            data: ['离线', '关机', '报警', '调机', '待机', '运行']
          },
          series: [
            {
                name: 'Placeholder',
                type: 'bar',
                stack: 'Total',
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
                data:[
                    {value:0,itemStyle:{color:'#111111'}},
                    {value:12,itemStyle:{color:'#fff'}},
                    {value:18,itemStyle:{color:'#fff'}},
                    {value:21,itemStyle:{color:'#fff'}},
                    {value:22,itemStyle:{color:'#fff'}},
                    {value:8,itemStyle:{color:'#fff'}},
                ]
              },
              {
                name: 'Life Cost',
                type: 'bar',
                stack: 'Total',
                label: {
                  show: false,
                },
                data:[
                    {value:12,itemStyle:{color:'#999'}},
                    {value:13,itemStyle:{color:'#111'}},
                    {value:2,itemStyle:{color:'#E93800'}},
                    {value:1,itemStyle:{color:'#FF9100'}},
                    {value:2,itemStyle:{color:'#0A78F5'}},
                    {value:10,itemStyle:{color:'#35C984'}},
                ]
              }
          ]
    };
    chart.setOption(option);
    // chart.on('click', this.handleChartClick);  
    return chart;
  }
Page({
  data: {
    navIndex:1,
    shops: [  
        {  
          id: 1,  
          name: '车间1',  
          expanded: false,  
          devices: [  
            { deviceId: 1, deviceName: '设备1',checked:false },     
          ],  
        },  
        {  
          id: 2,  
          name: '车间2',  
          expanded: false,  
          devices: [  
            { deviceId: 11, deviceName: '设备1',checked:false },  
          ],  
        },  
      ],  
      currentShop:0,
      ec: {
        onInit: initChart
      }
  },
  onLoad(options) {
  },
  bindtapNav(e){
      this.setData({
          navIndex:e.target.dataset.index
      })
  },
  toggleDevices: function(e) {  
    const shopIndex = e.currentTarget.dataset.index;
    const shops = this.data.shops;  
    shops[shopIndex].expanded = !shops[shopIndex].expanded;  
    this.setData({ shops,currentShop:shopIndex });  
  },  
  bindDevice(e){
    let id = e.target.dataset.deviceId
    let shops = this.data.shops
    shops && shops.map(item=>{
        item.devices && item.devices.map(items=>{
            if(items.deviceId == id){
                items.checked = true
            }else{
                items.checked = false
            }
        })
    })
    console.log(shops)
    this.setData({shops})
  },
//   handleChartClick(params) {  
//     this.setData({  
//       clickedData: params 
//     });  
//   },  
})