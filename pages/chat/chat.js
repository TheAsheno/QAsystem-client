// pages/chat/chat.js
import { getCourses } from '../../api/course';
import getModelResponse from '../../api/chat.js';
import F6 from '@antv/f6-wx';
import force from '@antv/f6-wx/extends/layout/forceLayout';
import config from '../../utils/config'
const app = getApp();

function transformGraphData(graphData) {
  return {
    nodes: (graphData.nodes || []).map(node => ({
      id: node.knowledgeId,
      label: node.name,
      alias: node.alias || '',
      definition: node.definition || '',
      image: node.image || ''
    })),
    edges: (graphData.links || []).map(link => ({
      source: link.source,
      target: link.target,
      id: `${link.source}_${link.target}`
    }))
  };
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    messages: [],
    sendButtonImage: '/images/up-arrow-none.png',
    isLoading: false,
    requestTask: null,
    courses: [],
    filteredCourses: [],
    selectedCourseid: null,
    selectedCoursename: null,
    isQuote: false,
    showRelatedIndex: -1,
    activeTab: 'knowledgeBase',
    kb_context: null,
    width: 300,
    height: 450,
    pixelRatio: 1,
    forceMini: false,
    graph_data: null,
    selectedNode: null
  },
  handleCanvasInit(event) {
    const { ctx, canvas, renderer } = event.detail;
    this.isCanvasInit = true;
    this.ctx = ctx;
    this.renderer = renderer;
    this.canvas = canvas;
    this.updateChart();
  },
  handleTouch(e) {
    this.graph && this.graph.emitEvent(e.detail);
  },
  updateChart() {
    const { canvasWidth, canvasHeight, pixelRatio, graph_data } = this.data;
    const data = graph_data;
    this.graph = new F6.Graph({
      container: this.canvas,
      context: this.ctx,
      renderer: this.renderer,
      width: canvasWidth,
      height: canvasHeight,
      pixelRatio,
      modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
      },
      layout: {
        type: 'force',
        linkDistance: 60,
        preventOverlap: true,
        nodeStrength: -30,
        edgeStrength: 0.1,
        nodeSize: 50,
        onLayoutEnd: () => {
          console.log('force layout done');
        }
      },
      fitCenter: true,
      defaultNode: {
        size: 50,
      },
      nodeStateStyles: {
        tap: {
          stroke: '#00BFFF',
          lineWidth: 2
        }
      }
    });
    this.graph.data(data);
    this.graph.render();
    this.graph.fitView();
    this.graph.on('node:tap', (e) => {
      const tapNodes = this.graph.findAllByState('node', 'tap');
      tapNodes.forEach((cn) => {
        this.graph.setItemState(cn, 'tap', false);
      });
      const nodeItem = e.item;
      this.graph.setItemState(nodeItem, 'tap', true);
      const model = nodeItem.getModel();
      this.setData({
        selectedNode: {
          name: model.label,
          alias: model.alias,
          definition: model.definition,
          image: model.image
        }
      });
    });
  },
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  handlePreviewImage() {
    const imageUrl = config.url_sql + this.data.selectedNode.image.replace(/^.*(\/images\/.*)$/, '$1');
    if (imageUrl) {
      wx.previewImage({
        urls: [imageUrl],
        current: imageUrl
      });
    }
  },  
  stopPropagation() {
  },
  showCoursePicker(e) {
    this.setData({
      filteredCourses: this.data.courses
    })
    this.selectComponent('#coursePicker').showPicker();
  },
  searchCourse(e) {
    const searchValue = e.detail;
    let filteredCourses = this.data.courses;
    if (searchValue) {
      filteredCourses = filteredCourses.filter(course => course.coursename.includes(searchValue))
    }
    this.setData({
      filteredCourses: filteredCourses
    })
  },
  selectCourse(e) {
    const index = e.detail[0];
    const filteredCourses = this.data.filteredCourses;
    this.setData({
      selectedCourseid: filteredCourses[index].courseid,
      selectedCoursename: filteredCourses[index].coursename
    })
  },
  onInputChange(e) {
    const inputValue = e.detail.value;
    this.setData({
      inputValue: inputValue,
      sendButtonImage: inputValue ? '/images/up-arrow.png' : '/images/up-arrow-none.png'
    });
  },
  onDelete() {
    this.setData({
      messages: []
    });
  },
  onSubmit(e) {
    const index = e.currentTarget.dataset.index;
    const content = this.data.messages[index].content;
    wx.showModal({
      title: '一键发布',
      content: '将进入问题发布页面，该条消息默认为问题内容',
      complete: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/add/add?courseId=${this.data.selectedCourseid}&coursename=${this.data.selectedCoursename}&content=${content}`,
          })
        }
      }
    })
  },
  onSimilar(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      showRelatedIndex: this.data.showRelatedIndex === index ? -1 : index
    });
  },
  onCopy(e) {
    const index = e.currentTarget.dataset.index;
    const message = this.data.messages[index];
    wx.setClipboardData({
      data: message.content,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 1500
        });
      },
      fail: function () {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
  },
  onQuote(e) {
    const index = e.currentTarget.dataset.index;
    const kb_context = this.data.messages[index].kb_context;
    const graph_data = transformGraphData(this.data.messages[index].graph);
    this.setData({
      isQuote: true,
      kb_context,
      graph_data
    });
  },
  navigateToQuestion(e) {
    const knowledgeid = e.currentTarget.dataset.knowledgeid;
    wx.navigateTo({
      url: `/pages/question/detail?id=${knowledgeid}`
    });
  },
  closeContext() {
    this.setData({
      isQuote: false,
      activeTab: "knowledgeBase",
      kb_context: null,
      selectedNode: null
    })
  },
  onRefresh(e) {
    const type = e.currentTarget.dataset.type;
    const index = e.currentTarget.dataset.index;
    let messagePair = [];
    if (type === 'user') {
      const aiMessageIndex = index + 1;
      messagePair = [this.data.messages[index], this.data.messages[aiMessageIndex]];
    } else {
      const userMessageIndex = index - 1;
      messagePair = [this.data.messages[userMessageIndex], this.data.messages[index]];
    }
    const updatedMessages = this.data.messages.filter(
      (msg, i) => i !== index && i !== (type === 'user' ? index + 1 : index - 1)
    );
    this.setData({
      messages: updatedMessages,
    });
    this.onSendMessage(messagePair[0].content);
  },
  onSendMessage(message) {
    if (message && message.type === "tap")
      message = null;
    const inputMessage = message ?? this.data.inputValue?.trim();
    const history = this.data.messages.map(msg => ({ role: msg.type, content: msg.content }));
    if (!inputMessage) {
      return;
    }
    if (!this.data.selectedCourseid) {
      wx.showToast({
        title: '请选择对应课程',
        icon: 'none'
      })
      return;
    }
    this.setData({
      inputValue: '',
      isLoading: true,
      sendButtonImage: '/images/loading.png',
    });
    this.addMessage({ content: inputMessage }, 'user');
    const { promise, requestTask } = getModelResponse({ 
      question: inputMessage,
      history: history,
      course: this.data.selectedCourseid
    })
    this.setData({ requestTask });
    promise
      .then((res) => {
        this.addMessage(res, 'ai');
      })
      .catch((err) => {
        this.addMessage({content: err.error}, 'ai');
      })
      .finally(() => {
        this.setData({
          isLoading: false,
          sendButtonImage: '/images/up-arrow-none.png',
          requestTask: null,
        });
      });
  },  
  addMessage(message, type) {
    message.parse_content = app.towxml(message.content, 'markdown');;
    message.type = type;
    const newMessage = message;
    this.setData({
      messages: [...this.data.messages, newMessage],
    });
  },
  onAbort() {
    const requestTask = this.data.requestTask;
    if (requestTask) {
      requestTask.abort();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    F6.registerLayout('force', force);
    const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync();
    this.setData({
      canvasWidth: windowWidth / 1.3,
      canvasHeight: windowHeight / 2.4,
      pixelRatio,
    });
    getCourses()
    .then(res => {
      this.setData({
        courses: res,
        filteredCourses: res
      })
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