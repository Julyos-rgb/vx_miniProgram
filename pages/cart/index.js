import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //收货地址接收
    const address = wx.getStorageSync("address");
    //购物车接收
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    });
    this.setCart(cart);
  },
  //点击收货地址
  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  //商品的选中
  handleItemChange(e) {
    //获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数据
    let {
      cart
    } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex((v) => v.goods_id === goods_id.id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车状态同时重新计算底部工具栏的数据全选总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.data.message.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },

  //商品全选功能
  handleItemAllCheck() {
    //获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    //修改值
    allChecked = !allChecked;
    //循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品数量编辑
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({
        content: "您是否要删除"
      });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      //进行修改数量
      cart[index].num = Math.max(0, cart[index].num + operation);
      // 设置回缓存和data中
      this.setCart(cart);
    }
  },

  //点击结算
  async handlePay() {
    const {
      address,
      totalNum
    } = this.data;
    if (!address.userName) {
      await showToast({
        title: "您还没有选择收货地址"
      });
      return;
    }
    //判断用户有无选择商品
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品"
      });
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });

  }
})