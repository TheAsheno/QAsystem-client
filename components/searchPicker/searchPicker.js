// components/searchPicker/searchPicker.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    initValue: {
      type: String,
      value: ''
    },
    items: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHide: true,
    searchValue: '',
    indexValue: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hiddePicker() {
      this.setData({
        isHide: true
      })
    },
    showPicker() {
      this.setData({
        isHide: false,
        searchValue: ''
      })
      this.getItems()
    },
    confirm() {
      this.triggerEvent('confirm', this.data.indexValue);
      this.hiddePicker();
    },
    changeItem(e) {
      this.setData({
        indexValue: e.detail.value
      })
    },
    searchItem(e) {
      const searchValue = e.detail;
      this.setData({
        searchValue: searchValue
      })
      this.triggerEvent('searchItems', searchValue);
    },
    getItems(e) {
      if (this.data.items.length && this.data.initValue) {
        const items = this.data.items;
        for (let i = 0; i < items.length; i++) {
          if (this.data.initValue == items[i].courseid) {
            this.setData({
              indexValue: [i]
            })
          }
        }
      }
      else
        this.setData({
          indexValue: [0]
        })
    }
  }
})