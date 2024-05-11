// pages/login/index.js
const { get, post } = require('../../utils/request');
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
    post('auth/login',
    {
        mobile:this.phone,
        password:this.password
    }
    ).then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
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