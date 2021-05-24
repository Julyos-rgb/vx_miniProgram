// 1 发送请求获取数据
// 2 点击轮播图预览大图
// 3 点击加入购物车
import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  //商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      goods_id
    } = options;
    this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    });
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj
    })
  },

  //点击轮播图放大预览
  handlePrevewImage(e) {
    const urls = this.GoodsInfo.data.message.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });


  },

  //点击加入购物车
  handleCartAdd() {
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },

})