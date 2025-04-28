// api/favorite.js
import config from '../utils/config'
function getFavorites(userId, questionId) {
  return new Promise((resolve, reject) => {
    let url = config.url_sql + '/api/favorites';
    const params = [];
    if (userId) {
      params.push(`studentid=${userId}`)
    }
    if (questionId) {
      params.push(`questionid=${questionId}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: '获取收藏列表失败',
            icon: 'none'
          });
          reject(`Error: ${res.statusCode}`);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: 'API 请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

function addFavorite(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + '/api/favorites',
      method: 'POST',
      data: obj,
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data);
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          });
        } else {
          console.error('收藏失败:', res.data.message);
          wx.showToast({
            title: '收藏失败',
            icon: 'none'
          });
        }
      }),
      fail: (err => {
        console.error('请求失败', err);
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
        reject(err);
      })
    })
  })
}

function deleteFavorite(favoriteId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + `/api/favorites/${favoriteId}`,
      method: 'DELETE',
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data);
          wx.showToast({
            title: '取消收藏成功',
            icon: 'none'
          });
        } else {
          console.error('取消收藏失败:', res.data.message);
          wx.showToast({
            title: '取消收藏失败',
            icon: 'none'
          });
        }
      }),
      fail: (err => {
        console.error('请求失败', err);
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
        reject(err);
      })
    })
  })
}

export { getFavorites, addFavorite, deleteFavorite };