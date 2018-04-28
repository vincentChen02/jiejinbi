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
var Gold;
(function (Gold) {
    /**金币管理类 */
    var GoldPool = (function (_super) {
        __extends(GoldPool, _super);
        function GoldPool(texture, textureName) {
            var _this = _super.call(this, texture + '_png') || this;
            _this.textureName = textureName;
            return _this;
        }
        /**
         * 生成金币或炸弹
         * @param textureName 图片资源名也是类型名
        */
        GoldPool.produce = function (textureName) {
            if (!this.cacheDict[textureName])
                this.cacheDict[textureName] = [];
            var goldArr = this.cacheDict[textureName];
            var gold = null;
            if (goldArr.length > 0)
                gold = goldArr.pop();
            else
                gold = new Gold.GoldPool(textureName, textureName);
            return gold;
        };
        /**
         * 回收金币或炸弹
         * @param gold 金币实例
        */
        GoldPool.recovery = function (gold) {
            var textureName = gold.textureName;
            if (!this.cacheDict[textureName])
                this.cacheDict[textureName] = [];
            var goldsArr = this.cacheDict[textureName];
            if (goldsArr.indexOf(gold) == -1)
                goldsArr.push(gold);
        };
        GoldPool.cacheDict = {};
        return GoldPool;
    }(eui.Image));
    Gold.GoldPool = GoldPool;
    __reflect(GoldPool.prototype, "Gold.GoldPool");
})(Gold || (Gold = {}));
//# sourceMappingURL=GoldPool.js.map