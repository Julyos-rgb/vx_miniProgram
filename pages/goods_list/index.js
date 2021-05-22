//(一)  用户上滑页面 滚动条触底 开始加载下一页数据
//  找到滚动条触底事件
//  获取总页数 总页数=Math.ceil(总条数/页容量pagesize)
//  =Math.ceil(23/10)
//  获取当前页码(pagenum)
//  判断页码是否>=总页数 表示没有下一页数据

//  判断有无下一页数据，若无则弹出提示，若有则加载下一页数据
// 当前的代码++
// 重新发送请求
//(二) 下拉刷新页面
// 1 触发下拉刷新事件
// 2重置 数据 数组
// 3 重置页码设为1
// 4 重新发送请求
// 5 数据请求回来 需要手动关闭等待效果
import {
  request
} from "../../request/index.js";
Page({

  data: {

    tabs: [{
        id: 0,
        value: "综合",
        isActive: true,
      },
      {
        id: 1,
        value: "销量",
        isActive: false,
      },
      {
        id: 2,
        value: "价格",
        isActive: false,
      },
    ],
    goodsList: []
  },

  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },

  //获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    });
    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  //标题点击事件 从子组件中传递过来
  handleTabsItemChange(e) {
    // 1.获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2.修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },

  //页面上滑  滚动条触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '没有下一页数据'
      });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 3 发送请求
    this.getGoodsList();
  }
})