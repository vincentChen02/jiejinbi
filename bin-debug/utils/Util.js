var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Gold;
(function (Gold) {
    var Util = (function () {
        function Util() {
        }
        /**
         * 基于矩形碰撞检测
         * @param obj1 碰撞体
         *  */
        Util.collision = function (obj1, obj2) {
            var rect1 = obj1.getBounds();
            var rect2 = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            //返回是否碰撞
            return rect1.intersects(rect2);
        };
        return Util;
    }());
    Gold.Util = Util;
    __reflect(Util.prototype, "Gold.Util");
})(Gold || (Gold = {}));
//# sourceMappingURL=Util.js.map