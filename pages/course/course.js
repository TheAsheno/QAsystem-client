// pages/course/course.js
import getCourses from '../../api/course';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedCategory: '',
    selectedDepartment: '',
    selectedProperty: '',
    categoryOptions: ['通识教育课程', '非通识教育课程'],
    departmentOptions: ['法学院', '理工学院', '文学院', '信息科学技术学院'],
    propertyOptions: [],
    allCourses: null,
    filteredCourses: [],
    searchQuery: ''
  },
  onCategoryChange(e) {
    const category = this.data.categoryOptions[e.detail.value];
    this.setData({
      selectedCategory: category,
      propertyOptions: category === '通识教育课程' ? ['选修', '必修'] : ['基础选修', '基础必修', '专业选修', '专业必修'],
      selectedDepartment: "",
      selectedProperty: ""
    });
    this.filterCourses();
  },
  onDepartmentChange(e) {
    const department = this.data.departmentOptions[e.detail.value];
    this.setData({
      selectedDepartment: department
    });
    this.filterCourses();
  },
  onPropertyChange(e) {
    const property = this.data.propertyOptions[e.detail.value];
    this.setData({
      selectedProperty: property
    });
    this.filterCourses();
  },
  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value
    });
    this.filterCourses();
  },
  filterCourses() {
    const { selectedCategory, selectedDepartment, selectedProperty, searchQuery, allCourses } = this.data;
    let filteredCourses = allCourses;
    if (selectedCategory) {
      filteredCourses = filteredCourses.filter(course => course.category === selectedCategory);
    }
    if (selectedDepartment) {
      filteredCourses = filteredCourses.filter(course => course.department === selectedDepartment);
    }
    if (selectedProperty) {
      filteredCourses = filteredCourses.filter(course => course.property === selectedProperty);
    }
    if (searchQuery) {
      filteredCourses = filteredCourses.filter(course => course.name.includes(searchQuery));
    }
    this.setData({
      filteredCourses: filteredCourses
    });
  },
  onCourseClick(e) {
    const courseId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/list/list?id=${courseId}`,
    });
  },
  onAddFile(e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getCourses()
    .then(courses => {
      this.setData({
        allCourses: courses
      })
      this.filterCourses();
    })
    .catch(err => {
      console.error('Failed to get courses:', err);
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