// api/notification.js
import config from '../utils/config'
function getNotification(receiverId, role, isRead) {
  return new Promise((resolve, reject) => {
    let url = config.url_sql + '/api/notifications';
    const params = [];
    if (receiverId) {
      params.push(`receiverid=${receiverId}`)
    }
    if (role) {
      params.push(`role=${role}`);
    }
    if (isRead != null) {
      params.push(`isRead=${isRead}`)
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    wx.request({
      url: url,
      method: 'GET',
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          console.error('加载失败:', res.data.message);
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
        }
      }),
      fail: (err => {
        console.error('API 请求失败', err);
        wx.showToast({
          title: 'API 请求失败',
          icon: 'none'
        });
      })
    })
  })
}

function markNotification(notificationIds) {
  return new Promise((resolve, reject) => {
    const notificationIdsParam = notificationIds.join(',');
    wx.request({
      url: config.url_sql + `/api/notifications/read?notificationIds=${notificationIdsParam}`,
      method: 'PUT',
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          console.error('标记失败:', res.data.message);
          wx.showToast({
            title: '标记失败',
            icon: 'none'
          });
        }
      }),
      fail: (err => {
        console.error('API 请求失败', err);
        wx.showToast({
          title: 'API 请求失败',
          icon: 'none'
        });
      })
    })
  })
}

function deleteNotification(notificationIds) {
  return new Promise((resolve, reject) => {
    const notificationIdsParam = notificationIds.join(',');
    wx.request({
      url: config.url_sql + `/api/notifications?notificationIds=${notificationIdsParam}`,
      method: 'DELETE',
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          console.error('删除失败:', res.data.message);
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      }),
      fail: (err => {
        console.error('API 请求失败', err);
        wx.showToast({
          title: 'API 请求失败',
          icon: 'none'
        });
      })
    })
  })
}

function sendNotification(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + '/api/notifications',
      method: 'POST',
      data: obj,
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          console.error('通知失败:', res.data.message);
          wx.showToast({
            title: '通知失败',
            icon: 'none'
          });
        }
      }),
      fail: (err => {
        console.error('API 请求失败', err);
        wx.showToast({
          title: 'API 请求失败',
          icon: 'none'
        });
      })
    })
  })
}

export { getNotification, markNotification, deleteNotification, sendNotification };