// pages/login/index.js
const request = require('../../utils/request');
Page({
  data: {
    phone:'',
    password: '',
    passwordType: false,
    isPasswordVisible: false,
    isChecked:false,
  },
  onLoad(options) {

  },
  login(){
      if(this.data.isChecked){
        request('auth/login','POST',{
            mobile:this.data.phone,
            password:this.data.password
        }).then(res=>{
            console.log(res)
            if(res.code == 0){
                let token = res.data.token;  
            }
        }).catch(err=>{
            console.log(err)
        })
      }else{
        wx.showToast({
            title: '请同意并勾选条款',
            icon: 'none',
            duration: 2000
        })
      }
   
  },
  handlePhone(e){
    this.setData({  
        phone: e.detail.value,  
      });  
  },
  handlePaw(e) {  
    this.setData({  
      password: e.detail.value,  
    });  
  },  
  togglePasswordVisibility() {  
    this.setData({  
      passwordType: !this.data.passwordType,
    });  
  },  
  toggleCheck() {  
    this.setData({  
      isChecked: !this.data.isChecked  
    });  
  }  
})