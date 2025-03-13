// pages/knowledge/knowledge.js
import { getKnowledgeFiles, uploadFile, updateRelations, deleteFile } from '../../api/knowledge'
import { getCourses } from '../../api/course'
import config from '../../utils/config'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    courses: [],
    showUploadPanel: false,
    searchKeyword: '',
    showKnowledgeGraph: true,
    files: [],
    filteredFiles: [],
    showModal: false,
    selectedCourse: null,
    isKb: "false",
    file: null,
    type: null
  },
  // 初始化知识图谱
  initGraph() {
    this.graph = new graph.KnowledgeGraph('knowledgeCanvas')
    this.graph.init([
      { id: '语法分析', name: '语法分析', links: ['词法分析', '语义分析'] },
      { id: '词法分析', name: '词法分析', links: ['有限自动机'] },
      // 其他节点数据...
    ])
  },
  filterFiles() {
    const keyword = this.data.searchKeyword.toLowerCase()
    this.setData({
      filteredFiles: this.data.files.filter(file => 
        file.filename.toLowerCase().includes(keyword) ||
        file.relations?.some(r => r.includes(keyword)) ||
        file.coursename.includes(keyword)
      )
    })
  },
  showUploadPanel() {
    this.setData({ showUploadPanel: true })
  },
  hideUploadPanel() {
    this.setData({ showUploadPanel: false })
  },
  closeModal() {
    this.setData({
      selectedCourse: null,
      file: null,
      isKb: "false",
      type: null,
      showModal: false
    })
  },
  onCourseChange: function(e) {
    const index = e.detail.value;
    this.setData({
      selectedCourse: index,
    });
  },
  isKbChange(e) {
    let isKb = e.detail.value;
    this.setData({
      isKb: isKb
    })
  },
  confirmModel() {
    if (!this.data.selectedCourse) {
      wx.showToast({
        icon: 'none',
        title: '课程不能为空',
      })
      return;
    }
    wx.showLoading({ title: '上传中...' });
    const file = this.data.file;
    const course = this.data.courses[this.data.selectedCourse];
    let obj = {
      filePath: file.path,
      uploaderid: this.data.user.userid,
      courseid: course.courseid,
      type: this.data.type,
      filename: file.name,
      isKb: this.data.isKb
    };
    uploadFile(obj)
    .then(res => {
      res.size = this.formatFileSize(res.size),
      res.createdAt = res.createdAt.slice(0, 10),
      res.uploader = this.data.user.username,
      res.coursename = course.coursename
      this.setData({
        files: [...this.data.files, res],
        showUploadPanel: false
      }, () => {
        this.closeModal();
        this.filterFiles();
        wx.hideLoading();
      });
    })
    .catch(uploadErr => {
      wx.hideLoading();
      console.error(uploadErr);
    });
  },
  chooseFile(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ type: type })
    wx.chooseMessageFile({
      count: 1,
      type: type,
      success: res => {
        this.setData({
          file: res.tempFiles[0],
          showModal: true
         });
      }
    });
  },
  formatFileSize(sizeInBytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  },
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, this.filterFiles)
  },
  toggleGraphLayout() {
    this.graph.toggleLayout()
  },
  resetGraphView() {
    this.graph.resetView()
  },
  updateRelation(e) {
    const knowledgeid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '关联知识点',
      content: '',
      editable: true,
      placeholderText: '用空格分开',
      complete: (res) => {
        if (res.confirm) {
          let relations = res.content;
          if (relations)
            relations = JSON.stringify(relations.trim().split(/\s+/));
          else 
            relations = null;
          updateRelations(knowledgeid, relations)
          .then(res => {
            this.setData({
              files: this.data.files.map(file =>
                file.knowledgeid === knowledgeid ? { ...file, relations: res.relations } : file
              )
            }, () => {
              this.filterFiles();
            });
          })
        }
      }
    })
  },
  downloadFile(e) {
    const path = e.currentTarget.dataset.path;
    wx.downloadFile({
      url: config.url_sql + path,
      success: (res) => {
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('文件打开成功');
            },
            fail: function (err) {
              console.log('文件打开失败', err);
            }
          });
        } else {
          console.error('文件下载失败');
        }
      },
      fail: (err) => {
        console.error('下载文件失败', err);
      }
    });
  },
  removeFile(e) {
    const file = e.currentTarget.dataset.item;
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除',
      content: `确定删除 ${file.filename} 吗？`,
      success: (res) => {
        if (res.confirm) {
          deleteFile(file.knowledgeid, file.path)
          .then(res => {
            this.data.files.splice(index, 1);
            this.setData({
              files: this.data.files
            });
            this.filterFiles();
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user: app.globalData.user
    }, () => {
      //this.initGraph()
      getCourses(this.data.user.userid, this.data.user.role)
      .then(res => {
        this.setData({
          courses: res
        }, () => {
          getKnowledgeFiles(res.map(course => course.courseid))
          .then(res => {
            res.forEach(item => {
              item.size = this.formatFileSize(item.size),
              item.createdAt = item.createdAt.slice(0, 10),
              item.uploader = item.Teacher ? item.Teacher.username : item.Student.username,
              item.coursename = this.data.courses.find(course => course.courseid === item.courseid).coursename
            })
            this.setData({
              files: res,
              filteredFiles: res
            })
          })
        })
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})