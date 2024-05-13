// pages/equipment/index.js
Page({
    data: {
        animationData: {},
        windowHeight: 0,
        dropdownToggle: false,
        currentCheckItems: [{
                value: '1',
                name: '第一车间',
                checked: false
            },
            {
                value: '2',
                name: '第一车间',
                checked: false
            },
            {
                value: '3',
                name: '第一车间',
                checked: false
            },
        ],
        isAllSelected: false,
        showCheckModa:false
    },
    onLoad(options) {
        const sysInfo = wx.getSystemInfoSync();
        this.setData({
            windowHeight: sysInfo.windowHeight
        });
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
        this.setData({
            showCheckModa:false
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
    }
})