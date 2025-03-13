// api/course.js
import config from '../utils/config'
function getCourses(userId, role) {
  return new Promise((resolve, reject) => {
    let url = config.url_sql + '/api/courses';
    const params = [];
    if (role) {
      params.push(`${role}id=${userId}`);
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
            title: '获取课程失败',
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

function deleteCourse(courseId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql +`/api/courses/${courseId}`,
      method: 'DELETE',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: '删除失败',
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

function addCourse(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + '/api/courses',
      method: 'POST',
      data: obj,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'none'
          });
          resolve(res.data);
        } else {
          wx.showToast({
            title: '删除失败',
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

function updateCourse(obj, courseId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + `/api/courses/${courseId}`,
      method: 'PUT',
      data: obj,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '更新成功',
            icon: 'none'
          });
          resolve(res.data);
        } else {
          wx.showToast({
            title: '更新失败',
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

export { getCourses, deleteCourse, addCourse, updateCourse };