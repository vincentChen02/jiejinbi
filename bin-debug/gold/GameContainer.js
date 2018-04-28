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
            /**当前分数 */
            _this.myScore = 0;
            /**当前生命值 */
            _this.myHp = 3;
            //触发金币间隔
            _this.goldTimer = new egret.Timer(500);
            /**场景总的金币*/
            _this.golds = [];
            /**场景总的炸弹*/
            _this.bombs = [];
            //游戏倒计时计时器
            _this.gameTimer = new egret.Timer(1000);
            //游戏限时时长
            _this.gameAllTime = 30;
            _this.bombCount = 0;
            _this._lastTime = egret.getTimer();
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
            //开始按钮
            this.btnStart = this.btnStart || new eui.Image('beginBtn_png');
            this.btnStart.width = 177;
            this.btnStart.height = 59;
            this.btnStart.x = (this.stageW - this.btnStart.width) / 2; //居中定位
            this.btnStart.y = (this.stageH - this.btnStart.height) / 2; //居中定位
            this.btnStart.touchEnabled = true; //开启触碰
            // this.btnStart.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            // this.btnStart.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this); //点击按钮开始游戏
            this.addChild(this.btnStart);
            //创建得分label
            this.score = this.score || new eui.Label('得分：0');
            this.score.x = this.stageW - 200;
            this.score.textColor = 0x0000;
            this.addChild(this.score);
            //创建血量label
            this.hp = this.hp || new eui.Label('生命值：3');
            this.hp.textColor = 0x0000;
            this.addChild(this.hp);
            //创建倒计时label
            this.timesDisplay = this.timesDisplay || new eui.Label('倒计时：30');
            this.timesDisplay.textColor = 0x0000;
            this.timesDisplay.x = (this.stageW - this.timesDisplay.width) / 2;
            this.addChild(this.timesDisplay);
            //游戏结束显示分数
            this.gameOverDisplay = this.gameOverDisplay || new eui.Label("您的成绩是:0 ，再来一次吧！");
            this.gameOverDisplay.y = 200;
            this.gameOverDisplay.size = 45;
            this.gameOverDisplay.textColor = 0xff0000;
        };
        /**开始游戏 */
        GameContainer.prototype.gameStart = function () {
            this.myScore = 0;
            this.myHp = 3;
            this.gameAllTime = 30;
            this.score.text = '得分：' + this.myScore;
            this.timesDisplay.text = '倒计时：' + this.gameAllTime;
            this.hp.text = "生命值：" + this.myHp;
            this.btnStart.visible = false; //隐藏开始按钮
            if (this.gameOverDisplay.parent == this)
                this.removeChild(this.gameOverDisplay);
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.bg.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onPlayerMove, this);
            //创建金币
            this.goldTimer.addEventListener(egret.TimerEvent.TIMER, this.createGold, this);
            this.goldTimer.start();
            //开始计时
            this.gameTimer.addEventListener(egret.TimerEvent.TIMER, this.onStartGameTimes, this);
            this.gameTimer.start();
        };
        /**游戏开始计时 */
        GameContainer.prototype.onStartGameTimes = function () {
            if (this.gameAllTime <= 0) {
                this.gameOver();
                return;
            }
            this.gameAllTime--;
            this.timesDisplay.text = '倒计时：' + this.gameAllTime;
        };
        /**游戏结束 */
        GameContainer.prototype.gameOver = function () {
            this.btnStart.visible = true;
            //移除一系列监听
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.bg.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onPlayerMove, this);
            this.goldTimer.removeEventListener(egret.TimerEvent.TIMER, this.createGold, this);
            this.goldTimer.stop();
            this.gameTimer.removeEventListener(egret.TimerEvent.TIMER, this.onStartGameTimes, this);
            this.gameTimer.stop();
            //清理金币
            var gold;
            while (this.golds.length > 0) {
                gold = this.golds.pop();
                this.removeChild(gold);
                Gold.GoldPool.recovery(gold);
            }
            //清理炸弹
            var bomb;
            while (this.bombs.length > 0) {
                bomb = this.bombs.pop();
                this.removeChild(bomb);
                Gold.GoldPool.recovery(bomb);
            }
            //显示成绩
            this.gameOverDisplay.text = "您的成绩是: " + this.myScore + "，再来一次吧！";
            this.gameOverDisplay.x = (this.stageW - this.gameOverDisplay.width) / 2;
            if (this.getChildIndex(this.gameOverDisplay) < 0)
                this.addChild(this.gameOverDisplay);
        };
        /**游戏画面更新 */
        GameContainer.prototype.gameViewUpdate = function () {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this._lastTime);
            this._lastTime = nowTime;
            var speedOffset = 60 / fps;
            //金币下落
            var goldCount = this.golds.length;
            var gold;
            for (var i = 0; i < goldCount; i++) {
                gold = this.golds[i];
                if (gold.y > this.stage.stageHeight) {
                    this.removeChild(gold);
                    Gold.GoldPool.recovery(gold);
                    this.golds.splice(i, 1);
                    i--;
                    goldCount--; //数组长度已经改变
                }
                gold.y += 8 * speedOffset;
            }
            //炸弹下落
            var bombCount = this.bombs.length;
            var bomb;
            for (var j = 0; j < bombCount; j++) {
                bomb = this.bombs[j];
                if (bomb.y > this.stage.stageHeight) {
                    this.removeChild(bomb);
                    Gold.GoldPool.recovery(bomb);
                    this.bombs.splice(j, 1);
                    j--;
                    bombCount--; //数组长度已经改变
                }
                bomb.y += 9 * speedOffset;
            }
            this.hitJudge();
        };
        /**碰撞判断 */
        GameContainer.prototype.hitJudge = function () {
            var goldsCount = this.golds.length;
            var gold;
            //碰撞删除的金币
            var delGolds = [];
            //金币与主角碰撞加分
            for (var i = 0; i < goldsCount; i++) {
                gold = this.golds[i];
                if (Gold.Util.collision(this.player, gold)) {
                    if (delGolds.indexOf(gold) == -1)
                        delGolds.push(gold);
                }
            }
            //碰撞删除的炸弹
            var delBombs = [];
            var bombsCount = this.bombs.length;
            var bomb;
            //金币与主角碰撞加分
            for (var j = 0; j < bombsCount; j++) {
                bomb = this.bombs[j];
                if (Gold.Util.collision(this.player, bomb)) {
                    this.myHp--;
                    this.hp.text = "生命值：" + this.myHp;
                    if (delBombs.indexOf(bomb) == -1)
                        delBombs.push(bomb);
                }
            }
            if (this.myHp <= 0) {
                this.gameOver();
            }
            else {
                //回收碰撞删除的金币
                this.myScore += delGolds.length;
                while (delGolds.length > 0) {
                    gold = delGolds.pop();
                    this.removeChild(gold);
                    this.golds.splice(this.golds.indexOf(gold), 1);
                    Gold.GoldPool.recovery(gold);
                }
                this.score.text = '得分：' + this.myScore;
                //回收碰撞删除的炸弹
                while (delBombs.length > 0) {
                    bomb = delBombs.pop();
                    this.removeChild(bomb);
                    this.bombs.splice(this.bombs.indexOf(bomb), 1);
                    Gold.GoldPool.recovery(bomb);
                }
            }
        };
        /**创建金币与炸弹 */
        GameContainer.prototype.createGold = function (evt) {
            var gold = Gold.GoldPool.produce("gold");
            gold.x = Math.random() * (this.stageW - gold.width);
            gold.y = -gold.height;
            this.addChildAt(gold, this.numChildren - 1);
            this.golds.push(gold);
            this.bombCount++;
            if (this.bombCount >= 2) {
                this.bombCount = 0;
                var bomb = Gold.GoldPool.produce("bomb");
                bomb.x = Math.random() * (this.stageW - bomb.width);
                bomb.y = -bomb.height;
                this.addChildAt(bomb, this.numChildren - 1);
                this.bombs.push(bomb);
            }
        };
        /**角色移动 */
        GameContainer.prototype.onPlayerMove = function (e) {
            var curX = e.stageX;
            curX = Math.max(0, curX);
            curX = Math.min(curX, this.stageW - this.player.width);
            this.player.x = curX;
        };
        return GameContainer;
    }(egret.DisplayObjectContainer));
    Gold.GameContainer = GameContainer;
    __reflect(GameContainer.prototype, "Gold.GameContainer");
})(Gold || (Gold = {}));
//# sourceMappingURL=GameContainer.js.map