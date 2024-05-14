// pages/equipment/index.js
const request = require('../../utils/request');
const { getStatusText } = require('../../utils/util.js');
Page({
    data: {
        animationData: {},
        windowHeight: 0,
        dropdownToggle: false,
        isAllSelected: false,
        showCheckModa:false,
        currentCheckItems:[
            {

            }
        ],
        selectedItems:[],
        positionTit:'全部车间',
        status:[
            {
                value:'运行',
                id:'1',
                checked:false
            },
            {
                value:'报警',
                id:'2',
                checked:false
            },
            {
                value:'调机',
                id:'3',
                checked:false
            },
            {
                value:'待机',
                id:'4',
                checked:false
            },
            {
                value:'关机',
                id:'5',
                checked:false
            }
        ],
        deviceItems:[
            {
                id:'123',
                type:'other',
                code:'SB-202401-001',
                brand:'123',
                model:'123',
                position:'123',
                crop_rate:82.9796,
                production:33,
                run_times:1190,//s
                status:1 //1运行 2报警 3调机 4 待机 5关机
            }
        ],
        page:1,
        ismore:true,
        currentStatus:[]
    },
    onLoad(options) {
        const sysInfo = wx.getSystemInfoSync();
        this.setData({
            windowHeight: sysInfo.windowHeight
        });
        this.getPosition()
        this.getDeviceList()
    },
    onReachBottom() {
        console.log(213)
        let page = this.data.page
        if(this.data.ismore){
            page ++ 
            this.setData({
                page
            },()=>{
                this.getDeviceList()
            })
        }
    },
    getDeviceList(){
        request('device/info/card-list','GET',{
            page:this.data.page,
            page_size:10,
            position:null,
            genre:null,
            status:null
        }).then(res=>{
            console.log(res)
            if(res.code == 0){
                let list = this.data.deviceItems
                res.data.data &&  res.data.data.map(item=>{
                    list.push({
                        id: `${item.id.c[0]}${item.id.c[1]}`,
                        type: item.type,
                        code: item.code,
                        brand: item.brand.value,
                        model: item.model.value,
                        position: item.position.value,
                        os_type: item.os_type.value,
                        crop_rate:  item.crop_rate,
                        production: item.production,
                        run_times: this.secondsToHours(item.run_times),
                        status: getStatusText(item.status), //1运行 2报警 3调机 4 待机 5关机
                    })
                })
                this.setData({
                    deviceItems:list,
                    isBottom:res.data.has_more
                })
            }
        })
    },
    getPosition(){
        request('org/device/list','GET',{
            type:'position',
            page:1,
            page_size:999
        }).then(res=>{
            console.log(res.data)
            if(res.code == 0){
                let list = []
                res.data.data &&  res.data.data.map(item=>{
                    list.push({
                        value:item.id+'',
                        name:item.value,
                        checked:false
                    })
                })
                this.setData({
                    currentCheckItems:list
                })
            }
        })
    },
    createPullDownAnimation: function () {
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease',
        });
        animation.translateY(0).step();
        this.setData({
            animationData: animation.export()
        });
    },
    createResetAnimation: function () {
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-in',
        });
        animation.translateY(-1000).step();
        this.setData({
            animationData: animation.export()
        });
    },
    onPullDown: function () {
        this.setData({
            dropdownToggle: true
        }, () => {
            this.createPullDownAnimation();
        })
    },
    resetViewPosition: function () {
        this.setData({
            dropdownToggle: false
        }, () => {
            this.createResetAnimation()
        })
    },
    selectAll () {
        // 获取当前复选框的选中状态，并反转它们  
        let allSelected = this.data.currentCheckItems.every(item => item.checked);
        console.log(allSelected)
        this.setData({
            currentCheckItems: this.data.currentCheckItems.map(item => ({
                ...item,
                checked: !allSelected // 如果都选中了，则全部不选；否则全部选中  
            })),
            isAllSelected: !allSelected // 更新全选状态（可选）  
        });
    },
    checkboxChange: function (e) {
        let checkedValues = e.detail.value;
        this.setData({
            currentCheckItems: this.data.currentCheckItems.map(item => ({
                ...item,
                checked: checkedValues.includes(item.value)
            }))
        });  
        let isAllSelected = this.data.currentCheckItems.every(item => item.checked);
        this.setData({
            isAllSelected: isAllSelected
        });
    },
    confirmSelect(){
        let data = []
        this.data.currentCheckItems.map(item=>{
            if(item.checked){
                data.push(item)
            }
        })
        let text = ''
        if(data.length > 0){
            text = data[0].name + '...'
        }else{
            text = '全部车间'
        }
        this.setData({
            showCheckModa:false,
            selectedItems:data,
            positionTit:text
        })
    },
    bindDeviceStatus(e){
        console.log(e.target.dataset.id)
        let id = e.target.dataset.id
        let arr = this.data.currentStatus
        const index = arr.indexOf(id)
        if(index!==-1){
            arr.splice(index,1)
        }else{
            arr.push(id)
        }
        let status = this.data.status
        status.map(item=>{
            if(item.id == id){
                item.checked = !item.checked
            }
        })
        this.setData({
            currentStatus:arr,
            status
        })
    },
    showCheckModal(){
        this.setData({
            showCheckModa:true
        })
    },
    navigateToDetail(){
        wx.navigateTo({
          url: '/pages/equipment/detail',
        })
    },
    secondsToHours(seconds) {  
        var hours = Math.floor(seconds / 3600);   
        var remainingSeconds = seconds % 3600;  
        var minutes = Math.floor(remainingSeconds / 60);  
        var secs = remainingSeconds % 60;  
        return hours + '小时' + (minutes > 0 ? ' ' + minutes + '分钟' : '') + (secs > 0 ? ' ' + secs + '秒' : '');  
    }  
})