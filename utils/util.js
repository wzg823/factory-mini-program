const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function getStatusText(statusCode) {  
    if (typeof statusCode === 'number' && statusMap.hasOwnProperty(statusCode)) {  
      return statusMap[statusCode];  
    } else {  
      return '未知状态';  
    }  
}  

const statusMap = {  
    1: '运行',  
    2: '报警',  
    3: '调机',  
    4: '待机',  
    5: '关机'  
  };  

module.exports = {
  formatTime,
  getStatusText  
}
