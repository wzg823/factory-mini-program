// pages/home/home.js
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
        tooltip: {
            trigger: 'none'
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['50%', '70%'],
              labelLine: {
                show: false
              },
              data: [
                {   
                    value: 89, 
                    itemStyle:{
                        color:'#3A97F4'
                    } 
                },
                { value: 11, itemStyle:{
                    color:'#999'
                }  }
              ]
            }
          ]
    };
    chart.setOption(option);
    return chart;
  }
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    top: 0,
    height: 0,
    currentTabIndex:0,
    ec: {
        onInit: initChart
      }
  },
  onLoad(options) {
    this.setNavbarHeight();
  },
  setNavbarHeight: function () {
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    this.setData({
      top:menuButtonInfo.top,
      height:menuButtonInfo.height
    });
  },
  onTabClick: function(e) {
    const index = e.currentTarget.dataset.index; // 获取点击的tab索引
    this.setData({
      currentTabIndex: index // 更新当前选中的tab索引
    });
  }


})