// utils/request.js
const JSONbig = require('../miniprogram_npm/json-bigint/index');
const baseUrl = 'http://service.ideamark.cn/';

const request = (url, method, data, header = {}) => {
    let token = wx.getStorageSync('token')
    let pms_id = wx.getStorageSync('pms_id')
    if(token){
        data['token'] = token
    }
    if(pms_id){
        data['pms_id'] = pms_id
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            method: method,
            data: {
                'pms':'customer',
                ...data
            },
            dataType:'text',
            headers: {
                'Content-Type': 'application/json',
                ...header,
            },
            success(res) {
                const {
                    statusCode,
                    data
                } = res;
                console.log(res)
                if (statusCode >= 200 && statusCode < 300) {
                    let resData = JSONbig.parse(data)
                    console.log(resData)
                    resolve(resData);
                    if (data.code == 9999) {
                        // 需要重新登录
                    } else if (data.code == 110110) {
                        // 暂无权限
                        wx.showToast({
                            title: '暂无权限',
                            icon: 'none',
                            duration: 2000
                        })
                    } else if (data.code > 10000 && data.code < 20000) {
                        // 1-2万内的状态码，属于请求错误，需要研发处理
                        wx.showToast({
                            title: '网络请求错误',
                            icon: 'none',
                            duration: 2000
                        })
                        reject(`网络请求错误，状态码${data.code}`);
                    } else if (data.code >= 20000) {
                        wx.showToast({
                            title: data.message,
                            icon: 'none',
                            duration: 2000
                        })
                        // 大于等于2万的状态码，属于业务错误，直接吐司或弹窗
                    }
                } else {
                    // 可以根据项目需求处理HTTP错误
                    wx.showToast({
                        title: '网络请求错误',
                        icon: 'none',
                        duration: 2000
                    })
                    reject(`网络请求错误，状态码${statusCode}`);
                }
            },
            fail(err) {
                // 请求失败的处理
                reject(err);
            }
        });
    });
};
module.exports = request;