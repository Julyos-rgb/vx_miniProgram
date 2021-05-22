//Page Object 0 引入用来发送请求 的方法 一定补全路径
import {
    request
} from "../../request/index.js";
Page({
    data: {
        //轮播图 数组
        swiperList: [],
        //导航 数组
        catesList: [],
        floorList: [],
    },
    //页面开始加载就会触发
    //options(Object)
    onLoad: function (options) {
        // // 1 发送异步请求获取轮播图数据
        // wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     success: (result) => {
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     }
        // });
        this.getSwiperList();
        this.getCateList();
        this.getFloorList();
    },

    //获取轮播图数据
    getSwiperList() {
        request({
            url: "/home/swiperdata"
        }).then(
            result => {
                this.setData({
                    swiperList: result.data.message
                })
            }
        )
    },

    //获取轮播图数据
    getCateList() {
        request({
            url: "/home/catitems"
        }).then(
            result => {
                this.setData({
                    catesList: result.data.message
                })
            }
        )
    },

    //获取楼层图数据
    getFloorList() {
        request({
            url: "/home/floordata"
        }).then(
            result => {
                this.setData({
                    floorList: result.data.message
                })
            }
        )
    },


});