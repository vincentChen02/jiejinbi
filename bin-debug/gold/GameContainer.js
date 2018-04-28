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
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this) || this;
            _this.stageW = 1280;
            _this.stageH = 720;
            //触发金币间隔
            _this.goldTimer = new egret.Timer(500);
            /**金币*/
            _this.golds = [];
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            return _this;
        }
        /**初始化*/
        GameContainer.prototype.onAddToStage = function (event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        };
        /**创建游戏场景 */
        GameContainer.prototype.createGameScene = function () {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //创建背景
            this.bg = this.bg || new eui.Image('gameBg_jpg');
            this.bg.width = this.stageW;
            this.bg.height = this.stageH;
            this.addChild(this.bg);
            //创建角色
            this.player = this.player || new eui.Image('player_png');
            this.player.width = 160;
            this.player.height = 200;
            this.player.x = (this.stageW - this.player.width) / 2;
            this.player.y = this.stageH - this.player.height;
            this.addChild(this.player);
            //创建金币
            this.goldTimer.addEventListener(egret.TimerEvent.TIMER, this.createGold, this);
            this.goldTimer.start();
        };
        GameContainer.prototype.createGold = function (evt) {
            var gold = Gold.GoldPool.produce("gold");
            gold.x = Math.random() * (this.stageW - gold.width);
            gold.y = -gold.height;
            this.addChildAt(gold, this.numChildren - 1);
            this.golds.push(gold);
        };
        return GameContainer;
    }(egret.DisplayObjectContainer));
    Gold.GameContainer = GameContainer;
    __reflect(GameContainer.prototype, "Gold.GameContainer");
})(Gold || (Gold = {}));
//# sourceMappingURL=GameContainer.js.map