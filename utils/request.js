// utils/request.js
const baseUrl = 'https://service.ideamark.cn/org/';

const request = (url, method, data, header = {}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            method: method,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                ...header,
            },
            success(res) {
                const {
                    statusCode,
                    data
                } = res;
                if (statusCode >= 200 && statusCode < 300) {
                    // 请求成功的处理
                    resolve(data);
                } else if (statusCode == 9999) {
                    // 需要重新登录
                } else if (statusCode == 110110) {
                    // 暂无权限
                } else if (statusCode >= 10000 && statusCode < 20000) {
                    // 1-2万内的状态码，属于请求错误，需要研发处理
                    reject(`网络请求错误，状态码${statusCode}`);
                } else if (statusCode >= 20000) {
                    // 大于等于2万的状态码，属于业务错误，直接吐司或弹窗
                } else {
                    // 可以根据项目需求处理HTTP错误
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
module.exports = {
    get: (url, data, header) => request(url, 'GET', data, header),
    post: (url, data, header) => request(url, 'POST', data, header),
};