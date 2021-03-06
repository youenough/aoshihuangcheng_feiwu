var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * module ： 商城模块视图
 * author : zrj
*/
var game;
(function (game) {
    var ShopView = (function (_super) {
        __extends(ShopView, _super);
        function ShopView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.list = new eui.List();
            _this.shopModel = game.ShopModel.getInstance();
            _this._offset = 0; //偏移量
            return _this;
        }
        ShopView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.SHOP);
            }, this);
            this.initView();
        };
        ShopView.prototype.initView = function () {
            var _this = this;
            this.comBaseBg.winVo = this.winVo;
            this.lb_preview.textFlow = [{ text: "极品预览", style: { underline: true } }];
            this.lb_preview.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                WinManager.getInstance().openPopWin(WinName.POP_SHOP_PREVIEW);
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.SHOP);
            }, this);
            //刷新神秘商店
            this.img_refresh.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(16004, {});
            }, this);
            var data = ["神秘商店", "限购商店", "道具商店"];
            this.tabbar.dataProvider = new eui.ArrayCollection(data);
            this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, function (event) {
                if (event.itemIndex == null) {
                    App.Socket.send(16001, {});
                }
                else if (event.itemIndex == 0) {
                    App.Socket.send(16001, {});
                }
                else if (event.itemIndex == 1) {
                    App.Socket.send(16002, {});
                }
                else if (event.itemIndex == 2) {
                }
                _this.changedIndex(event.itemIndex);
            }, this);
            this.list.itemRenderer = ShopItem;
            this.scroller.viewport = this.list;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.list.layout = new eui.VerticalLayout();
            this.list.layout.gap = 5;
            this.list.dataProvider = new eui.ArrayCollection([{ "id": 1, "goods": 1, "money": 1, "number": 10 }]);
            this.tabbar.selectedIndex = 0;
            this.list.validateNow();
            this.validateNow();
        };
        ShopView.prototype.showBuyWin = function (data) {
            App.WinManager.openWin(WinName.POP_SHOP_BUY, { data: data });
            // if (!this._subview) {
            // 	this._subview = new ShopBuyWinView(data);
            // 	PopUpManager.addPopUp({ obj: this._subview });
            // } else if(this._subview){
            // 	PopUpManager.removePopUp(this._subview);
            // 	this._subview = undefined;
            // 	this._subview = new ShopBuyWinView(data);
            // 	PopUpManager.addPopUp({ obj: this._subview });
            // }else if (this._subview && this._subview.parent) {
            // 	PopUpManager.removePopUp(this._subview);
            // 	this._subview = undefined;
            // 	this._subview = new ShopBuyWinView(data);
            // 	PopUpManager.addPopUp({ obj: this._subview });
            // }
        };
        ShopView.prototype.closeBuyWin = function () {
            App.WinManager.closeWin(WinName.POP_SHOP_BUY);
            // if(this._subview){
            // 	PopUpManager.removePopUp(this._subview);
            // 	this._subview = undefined;
            // }else if (this._subview && this._subview.parent) {
            // 	PopUpManager.removePopUp(this._subview);
            // 	this._subview = undefined;
            // }
        };
        ShopView.prototype.changedIndex = function (index) {
            var _this = this;
            App.logzrj("index:  ", index);
            this.scroller.stopAnimation();
            this.scroller.bottom = 175;
            this.lb_over_tip.visible = false;
            if (this.timeHandle) {
                egret.clearInterval(this.timeHandle);
                this.lb_nexttime.text = "";
            }
            if (index == null) {
                this.updateMysteryShop();
            }
            else if (index == 0) {
                this.img_girl.visible = true;
                this.lb_desc.text = "点击刷新有\n惊喜哦!";
                this.lb_preview.visible = true;
                this.updateMysteryShop();
                this.checkGuide();
            }
            else if (index == 1) {
                this.lb_desc.text = "机不可失\n赶紧入手吧!";
                this.img_girl.visible = true;
                this.lb_preview.visible = false;
                this.updateLimitShop();
            }
            else if (index == 2) {
                this.lb_desc.text = "";
                this.img_girl.visible = false;
                this.lb_preview.visible = false;
                this.updateNormalShop();
                this.scroller.bottom = 35;
            }
            egret.callLater(function () {
                _this.list.validateNow();
                _this.scroller.viewport.scrollV = _this._offset;
                _this._offset = 0;
            }, this);
        };
        ShopView.prototype.updateView = function (data) {
            App.WinManager.closeWin(WinName.POP_SHOP_BUY);
            // if (this._subview && this._subview.parent) {
            // 	PopUpManager.removePopUp(this._subview);
            // 	this._subview = undefined;
            // }
            if (data) {
                if (this.tabbar.selectedIndex == data - 1) {
                    this._offset = this.list.scrollV;
                    this.changedIndex(data - 1);
                }
            }
            else {
                // this.list.selectedIndex = -1;
            }
        };
        ShopView.prototype.updateMysteryShop = function () {
            var _this = this;
            this.list.dataProvider = new eui.ArrayCollection(this.shopModel.mysteryShop);
            this.list.validateNow();
            this.gp_nexttime.visible = true;
            this.lb_tip.visible = false;
            this.gp_refresh.visible = true;
            this.lb_cost.text = String(App.ConfigManager.getConstConfigByType("SHOP_GOLD")["value"] + App.ConfigManager.getConstConfigByType("SHOP_GOLD1")["value"] * this.shopModel.refreshNum);
            this.timeHandle = egret.setInterval(function () {
                _this.shopModel.leftTime--;
                _this.lb_nexttime.text = "距离下批刷新时间：" + GlobalUtil.getFormatBySecond1(_this.shopModel.leftTime);
                if (_this.shopModel.leftTime < 0) {
                    if (_this.timeHandle) {
                        egret.clearInterval(_this.timeHandle);
                        _this.lb_nexttime.text = "";
                        App.Socket.send(16001, {});
                    }
                }
            }, this, 1000);
            this.lb_nexttime.text = "距离下批刷新时间：" + GlobalUtil.getFormatBySecond1(this.shopModel.leftTime);
            if (this.shopModel.mysteryShop.length == 0) {
                this.lb_over_tip.visible = true;
            }
        };
        ShopView.prototype.updateLimitShop = function () {
            var _this = this;
            var data = App.ConfigManager.getLimitShopBatchByBatch(this.shopModel.limitNum);
            var final = [];
            var array1 = []; //有购买次数
            var array2 = []; //无购买次数
            data.forEach(function (value, index, array) {
                var time = _this.shopModel.getLimitInfoById(value.id);
                if (time && time.limit == value.limit) {
                    array2.push(value);
                }
                else {
                    array1.push(value);
                }
            }, this);
            final = array1.concat(array2);
            this.list.dataProvider = new eui.ArrayCollection(final);
            this.gp_nexttime.visible = true;
            // this.lb_tip.visible = true; 不要了
            this.gp_refresh.visible = false;
            this.timeHandle = egret.setInterval(function () {
                _this.shopModel.limitLeftTime--;
                _this.lb_nexttime.text = "距离下一批物品刷新时间：" + GlobalUtil.getFormatBySecond1(_this.shopModel.limitLeftTime);
                if (_this.shopModel.limitLeftTime < 0) {
                    if (_this.timeHandle) {
                        egret.clearInterval(_this.timeHandle);
                        _this.lb_nexttime.text = "";
                        App.Socket.send(16001, {});
                    }
                }
            }, this, 1000);
            this.lb_nexttime.text = "距离下一批物品刷新时间：" + GlobalUtil.getFormatBySecond1(this.shopModel.limitLeftTime);
        };
        ShopView.prototype.updateNormalShop = function () {
            if (this.shopModel.normalShop.length == 0) {
                var data = App.ConfigManager.normalShopConfig();
                var temp = [];
                for (var key in data) {
                    temp.push(data[key]);
                }
                this.shopModel.normalShop = temp;
            }
            this.list.dataProvider = new eui.ArrayCollection(this.shopModel.normalShop);
            this.gp_nexttime.visible = false;
        };
        ShopView.prototype.checkGuide = function () {
            if (this.list.getElementAt(0)) {
                App.GuideManager.bindClickBtn(this.img_refresh, 1012, 2);
                App.GuideManager.bindClickBtn(this.list.getElementAt(0).getChildAt(0).getChildByName("img_buy"), 1012, 3);
                App.GuideManager.checkGuide(1012);
            }
        };
        ShopView.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1012, 2);
            App.GuideManager.removeClickBtn(1012, 3);
        };
        /**
         * 打开窗口
         */
        ShopView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam && openParam.type) {
                if (openParam.type == ShopType.MYSTERY) {
                    App.Socket.send(16001, {});
                }
                else if (openParam.type == ShopType.LIMIT) {
                    App.Socket.send(16002, {});
                }
                else if (openParam.type == ShopType.NORMAL) {
                }
                this.changedIndex(openParam.type - 1);
                this.tabbar.selectedIndex = openParam.type - 1;
            }
            else {
                App.Socket.send(16001, {});
            }
            App.EventSystem.addEventListener(PanelNotify.SHOP_UPDATE_LIST, this.updateView, this);
            App.EventSystem.addEventListener(PanelNotify.SHOP_BUY_WIN, this.showBuyWin, this);
            App.EventSystem.addEventListener(PanelNotify.SHOP_CLOSE_BUY_WIN, this.closeBuyWin, this);
            // App.Socket.send(16001, {});
            // this.checkGuide();
        };
        /**
         * 关闭窗口
         */
        ShopView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ShopView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            App.EventSystem.removeEventListener(PanelNotify.SHOP_UPDATE_LIST);
            App.EventSystem.removeEventListener(PanelNotify.SHOP_BUY_WIN);
            App.EventSystem.removeEventListener(PanelNotify.SHOP_CLOSE_BUY_WIN);
            this.removeGuide();
        };
        /**
         * 销毁
         */
        ShopView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ShopView;
    }(BaseView));
    game.ShopView = ShopView;
    __reflect(ShopView.prototype, "game.ShopView");
    var ShopItem = (function (_super) {
        __extends(ShopItem, _super);
        function ShopItem() {
            var _this = _super.call(this) || this;
            _this.shopModel = game.ShopModel.getInstance();
            _this.heroModel = game.HeroModel.getInstance();
            _this._max = 0;
            _this.skinName = "ShopItemSkin";
            _this.img_buy.name = "img_buy";
            _this.img_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this._type == ShopType.MYSTERY) {
                    App.Socket.send(16003, { type: _this._type, id: _this.data.id, num: 1 });
                    return;
                }
                var goodId = _this.data.good_id ? _this.data.good_id : _this.data.goods; //商品id
                var price = Number(_this.lb_price.text);
                var num = _this.data.num ? _this.data.num : 1;
                var data = { id: _this.data.id, good_id: goodId, type: _this._moneyType, max: _this._max, price: price, shopType: _this._type, num: num };
                App.EventSystem.dispatchEvent(PanelNotify.SHOP_BUY_WIN, data);
                // let view = new ShopBuyWinView({ id: this.data.id, good_id: goodId, type: this._moneyType, max: this._max, price: price, shopType: this._type });
                // PopUpManager.addPopUp({ obj: view });
            }, _this);
            return _this;
        }
        ShopItem.prototype.dataChanged = function () {
            var _this = this;
            var itemInfo = undefined;
            this.img_money.visible = true;
            this.lb_price.visible = true;
            if (this.data.type != null) {
                this._type = ShopType.MYSTERY;
                this._max = 1;
                if (this.data.type == ClientType.BASE_ITEM) {
                    itemInfo = App.ConfigManager.itemConfig()[this.data.good_id];
                    this.shopBaseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
                    this.lb_cap.visible = false;
                }
                else if (this.data.type == ClientType.EQUIP) {
                    itemInfo = App.ConfigManager.equipConfig()[this.data.good_id];
                    this.shopBaseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num, this.data);
                    // this.baseItem.equipInfo = this.data;
                    this.shopBaseItem.setCarrerIconVisible(false);
                    this.lb_cap.visible = true;
                    this.shopBaseItem.setItemNumVisible(false);
                    this.lb_cap.text = "评分：" + this.data.equip.score;
                }
                this.lb_tip.visible = false;
                this.lb_count.visible = false;
                if (this.data.discount == 100 || this.data.discount == 0) {
                    // this.gp_sale.visible = false;
                    // this.lb_price.text = this.data.price;
                    this.shopBaseItem.setDiscountIcon(null);
                }
                else {
                    var discount = this.data.discount / 10;
                    switch (discount) {
                        case 5:
                            this.shopBaseItem.setDiscountIcon("com_sign_agioFive");
                            break;
                        case 8:
                            this.shopBaseItem.setDiscountIcon("com_sign_agioEight");
                            break;
                    }
                    // this.gp_sale.visible = true;
                    // this.bmlb_sale.text = String(this.data.discount / 10);
                    // this.lb_price.text = String(Math.ceil(this.data.price * this.data.discount / 100));
                }
            }
            else if (this.data.batch != null) {
                this._type = ShopType.LIMIT;
                itemInfo = App.ConfigManager.itemConfig()[this.data.goods];
                this.shopBaseItem.updateBaseItem(1, this.data.goods, this.data.num);
                if (this.data.discount == 10 || this.data.discount == 0) {
                    // this.gp_sale.visible = false;
                    // this.lb_price.text = String(this.data.number);
                    this.shopBaseItem.setDiscountIcon(null);
                }
                else {
                    switch (this.data.discount) {
                        case 5:
                            this.shopBaseItem.setDiscountIcon("com_sign_agioFive");
                            break;
                        case 8:
                            this.shopBaseItem.setDiscountIcon("com_sign_agioEight");
                            break;
                    }
                    // this.gp_sale.visible = true;
                    // this.bmlb_sale.text = String(this.data.discount);
                    // this.lb_price.text = String(Math.ceil(this.data.number / 10 * this.data.discount));
                }
                this.lb_count.visible = true;
                this.lb_cap.visible = false;
                // this.lb_price.text = String(Math.ceil(this.data.number/this.data.discount));
                var left = this.data.limit; //剩余次数
                var count = this.shopModel.getLimitInfoById(this.data.id); //已购买次数
                if (count) {
                    left = this.data.limit - count.limit;
                }
                if (left == 0) {
                    UIActionManager.setGrey(this, true);
                    this.img_buy.touchEnabled = false;
                }
                else {
                    UIActionManager.setGrey(this, false);
                    this.img_buy.touchEnabled = true;
                }
                this.lb_count.text = "本次限购" + left + "/" + this.data.limit;
                this._max = left;
                if (this.data.vip > App.RoleManager.roleInfo.vipLv) {
                    this.lb_tip.visible = true;
                    this.lb_tip.text = "VIP" + this.data.vip + "以上可购买";
                    this.lb_price.visible = false;
                    this.img_money.visible = false;
                }
                else {
                    this.lb_tip.visible = false;
                    this.lb_price.visible = true;
                    this.img_money.visible = true;
                }
            }
            else {
                this._type = ShopType.NORMAL;
                this._max = 0;
                itemInfo = App.ConfigManager.itemConfig()[this.data.goods];
                this.shopBaseItem.updateBaseItem(1, this.data.goods, this.data.num);
                this.gp_sale.visible = false;
                this.lb_count.visible = false;
                this.lb_cap.visible = false;
                this.lb_tip.visible = false;
                this.lb_price.text = this.data.number;
            }
            this.lb_name.text = itemInfo.name;
            if (this.data.money == 1) {
                this._moneyType = 1;
                RES.getResAsync("common_jinbi_png", function (texture) {
                    _this.img_money.source = texture;
                }, this);
            }
            else if (this.data.money == 2) {
                this._moneyType = 2;
                RES.getResAsync("common_yuanbao_png", function (texture) {
                    _this.img_money.source = texture;
                }, this);
            }
            else if (this.data.money_type == 1) {
                this._moneyType = 1;
                RES.getResAsync("common_jinbi_png", function (texture) {
                    _this.img_money.source = texture;
                }, this);
            }
            else if (this.data.money_type == 2) {
                this._moneyType = 2;
                RES.getResAsync("common_yuanbao_png", function (texture) {
                    _this.img_money.source = texture;
                }, this);
            }
        };
        return ShopItem;
    }(eui.ItemRenderer));
    game.ShopItem = ShopItem;
    __reflect(ShopItem.prototype, "game.ShopItem");
})(game || (game = {}));
//# sourceMappingURL=ShopView.js.map