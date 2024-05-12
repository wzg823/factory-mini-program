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
      currentShop:0
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
    this.setData({ shops,currentShop:shopIndex });  
  },  
  bindDevice(e){
    console.log(e)
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
  }
})