// components/searchPicker/searchPicker.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 初始化日期
    initValue: {
      type: String,
      value: ''
    },
    // 父组件传递过来的数据列表
    items: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //控制picker的显示与隐藏
    flag: true,
    // 用户输入的学校关键词
    searchValue:'',
    // 滚动选择的学校
    setValues: [],
    // 滚动选择的学校索引
    selectSchoolIndex:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    searchSchool(e)
    {
      let self = this;
      self.triggerEvent('searchSchool', e.detail);
    },
    /**
    * @name: 隐藏picker
    * @author: camellia
    * @date: 20211129
    */
    hiddeDatePicker()
    {
      let self = this;
      self.setData({
        flag: !self.data.flag
      })
    },
    /**
    * @name: 展示picker
    * @author: camellia
    * @date: 20211129
    */
    showDatePicker()
    {
      let self = this;
      self.setData({
        flag: !self.data.flag
      })
      self.getItems()
    },
    /**
    * @name: 选择好学校后，点击确定
    * @author: camellia
    * @date: 20211129
    */
    confirm()
    {
      let self = this;
      // 获取用户选择的学校
      let item = self.data.items[self.data.selectSchoolIndex]?self.data.items[self.data.selectSchoolIndex]:self.data.items[0];
      // 通过发送自定义事件把用户选择的学校传递到父组件
      self.triggerEvent('confirm', item);
    },
    /**
    * @name: 用户滚动picker时，获取滚动选择的索引
    * @author: camellia
    * @date: 20211129
    */
    bindChange(e)
    {
      let self = this;
      self.setData({
        // 用户选择的学校索引
        selectSchoolIndex:e.detail.value[0]
      })
    },
    /**
     * @name: 获取初始化信息
     * @author: camellia
     * @date: 20211130
     */
    getItems(e)
    {
      let self = this;
      if (self.data.items.length && self.data.initValue) {
        let items = self.data.items
        for (let i = 0; i < items.length; i++) {
          if (self.data.initValue == items[i].id) {
            self.setData({
              setValues: [i]
            })
            return
          }
        }
      }
      self.setData({
        setValues: [0]
      })
    }
  }
})