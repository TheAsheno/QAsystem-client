// pages/course-management/course-management.js
import { getCourses, deleteCourse, addCourse, updateCourse } from '../../api/course'
import { getQuestionCounts } from '../../api/question'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    courses: [],
    showModal: false,
    categoryOptions: ['通识教育课程', '非通识教育课程'],
    departmentOptions: ['法学院', '理工学院', '文学院', '信息科学技术学院'],
    propertyOptions: [],
    selectedCategory: '',
    selectedDepartment: '',
    selectedProperty: '',
    coursename: '',
    assistant: '',
    action: '',
    courseid: null,
    index: null
  },
  addCourse() {
    this.setData({
      action: 'add',
      showModal: true
     })
  },
  closeModal() {
    this.setData({ 
      showModal: false,
      coursename: '',
      selectedCategory: '',
      selectedDepartment: '',
      selectedProperty: '',
      assistant: '',
      propertyOptions: [],
      courseid: null,
      index: null
    })
  },
  inputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },
   onCategoryChange: function(e) {
    const category = this.data.categoryOptions[e.detail.value];
    this.setData({
      selectedCategory: category,
      propertyOptions: category === '通识教育课程' ? ['选修', '必修'] : ['基础选修', '基础必修', '专业选修', '专业必修'],
      selectedDepartment: "",
      selectedProperty: ""
    });
  },
  onDepartmentChange: function(e) {
    const index = e.detail.value;
    this.setData({
      selectedDepartment: this.data.departmentOptions[index],
    });
  },
  onPropertyChange: function(e) {
    const index = e.detail.value;
    this.setData({
      selectedProperty: this.data.propertyOptions[index],
    });
  },
  confirmModel() {
    if (!this.data.coursename.trim()) {
      wx.showToast({
        icon: 'none',
        title: '课程名称不能为空',
      })
    }
    else if (!this.data.selectedCategory) {
      wx.showToast({
        icon: 'none',
        title: '课程类别不能为空',
      })
    }
    else if (!this.data.selectedDepartment) {
      wx.showToast({
        icon: 'none',
        title: '排课单位不能为空',
      })
    }
    else if (!this.data.selectedProperty) {
      wx.showToast({
        icon: 'none',
        title: '课程性质不能为空',
      })
    }
    else {
      let obj = {
        coursename: this.data.coursename,
        teacherid: this.data.user.userid,
        category: this.data.selectedCategory,
        department: this.data.selectedDepartment,
        property: this.data.selectedProperty,
        assistant: this.data.assistant || null
      }
      if (this.data.action == 'update') {
        updateCourse(obj, this.data.courseid)
        .then(res => {
          const index = this.data.index;
          const updatedCourses = [...this.data.courses];
          res.questionCount = updatedCourses[index].questionCount;
          updatedCourses[index] = res;
          this.setData({
            courses: updatedCourses
          });
          this.closeModal();
        })
      }
      else if (this.data.action == 'add') {
        addCourse(obj)
        .then(res => {
          res.questionCount = 0
          this.setData({
            courses: [...this.data.courses, res]
          })
          this.closeModal();
        })
      }
    }
  },
  updateCourse(e) {
    const index = e.currentTarget.dataset.index;
    const course = this.data.courses[index];
    this.setData({
      index: index,
      courseid: course.courseid,
      coursename: course.coursename,
      selectedCategory: course.category,
      selectedDepartment: course.department,
      selectedProperty: course.property,
      assistant: course.assistant,
      action: 'update',
      showModal: true,
      propertyOptions: course.category === '通识教育课程' ? ['选修', '必修'] : ['基础选修', '基础必修', '专业选修', '专业必修'],
    })
  },
  backupCourse(e) {

  },
  deleteCourse(e) {
    wx.showModal({
      title: '确定删除课程吗？',
      content: '将同时删除该课程的所有问题和文件',
      success: res => {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          deleteCourse(this.data.courses[index].courseid)
          .then(res => {
            this.data.courses.splice(index, 1);
            this.setData({ 
              courses: this.data.courses
            });
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user: app.globalData.user
    }, () => {
      getCourses(this.data.user.userid, 'teacher')
      .then(courses => {
        this.setData({
          courses: courses
        });
        return getQuestionCounts(courses.map(course => course.courseid));
      })
      .then(questionCounts => {
        const coursesWithCounts = this.data.courses.map(course => {
          const count = questionCounts.find(qc => qc.courseid === course.courseid);
          return {
            ...course,
            questionCount: count ? count.questionCount : 0
          };
        });
        this.setData({
          courses: coursesWithCounts
        });
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