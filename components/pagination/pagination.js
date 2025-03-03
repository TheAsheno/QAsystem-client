// components/pagination/pagination.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    filteredList: {
      type: Array,
      value: []
    },
    pageSize: {
      type: Number,
      value: 5
    },
    currentPage: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    totalPages: 1
  },
  observers: {
    'filteredList, currentPage': function () {
      this.updatePagination();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    updatePagination() {
      const { filteredList, pageSize, currentPage } = this.data;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      this.setData({
        totalPages: Math.ceil(filteredList.length / pageSize) || 1
      }, () => {
        this.triggerEvent('pageChange', filteredList.slice(start, end));
      });
    },
    prevPage() {
      if (this.data.currentPage > 1) {
        this.setData({
          currentPage: this.data.currentPage - 1
        });
      }
    },
    nextPage() {
      if (this.data.currentPage < this.data.totalPages) {
        this.setData({
          currentPage: this.data.currentPage + 1
        });
      }
    }
  }
})