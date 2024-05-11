// pages/equipment/detail.js
Page({
  data: {
    navIndex:0,
    shops: [  
        {  
          id: 1,  
          name: '车间1',  
          expanded: false,  
          devices: [  
            { deviceId: 1, deviceName: '设备1' },  
            { deviceId: 2, deviceName: '设备2' },
            { deviceId: 3, deviceName: '设备3' },    
            { deviceId: 4, deviceName: '设备3' },    
            { deviceId: 5, deviceName: '设备3' },    
            { deviceId: 6, deviceName: '设备3' },    
            { deviceId: 7, deviceName: '设备3' },    
            { deviceId: 8, deviceName: '设备3' },    
            { deviceId: 9, deviceName: '设备3' },    
            { deviceId: 10, deviceName: '设备3' },    
          ],  
        },  
        {  
          id: 2,  
          name: '车间2',  
          expanded: false,  
          devices: [  
            { deviceId: 11, deviceName: '设备1' },  
            { deviceId: 12, deviceName: '设备2' },
            { deviceId: 13, deviceName: '设备3' },    
            { deviceId: 14, deviceName: '设备3' },    
            { deviceId: 15, deviceName: '设备3' },    
            { deviceId: 16, deviceName: '设备3' },    
            { deviceId: 17, deviceName: '设备3' },    
            { deviceId: 18, deviceName: '设备3' },    
            { deviceId: 19, deviceName: '设备3' },    
            { deviceId: 20, deviceName: '设备4' },  
          ],  
        },  
      ],  
  },
  onLoad(options) {

  },
  bindtapNav(e){
      console.log(e.target.dataset.index) 
      this.setData({
          navIndex:e.target.dataset.index
      })
  },
  toggleDevices: function(e) {  
    console.log(e)
    const shopIndex = e.currentTarget.dataset.index;
    const shops = this.data.shops;  
    shops[shopIndex].expanded = !shops[shopIndex].expanded;  
    this.setData({ shops });  
  },  
  bindDevice(e){
    console.log(e)
  }
})