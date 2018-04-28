module Gold {
	export class GameContainer extends egret.DisplayObjectContainer {

		private stageW: number = 1280;
		private stageH: number = 720;

		//开始按钮
		private btnStart: eui.Image;
		//背景
		private bg: eui.Image;
		//角色
		private player: eui.Image;
		//分数显示
		private score: eui.Label;
		/**当前分数 */
		private myScore: number = 0;
		//血量显示
		private hp: eui.Label;
		/**当前生命值 */
		private myHp: number = 3;

		private _lastTime: number;
		//触发金币间隔
		private goldTimer: egret.Timer = new egret.Timer(500);
		/**场景总的金币*/
		private golds: Gold.GoldPool[] = [];
		/**场景总的炸弹*/
		private bombs: Gold.GoldPool[] = [];

		//游戏倒计时计时器
		private gameTimer: egret.Timer = new egret.Timer(1000);
		//游戏限时时长
		private gameAllTime: number = 30;
		//倒计时显示
		private timesDisplay: eui.Label;

		//游戏结束显示分数
		private gameOverDisplay: eui.Label;

		public constructor() {
			super();
			this._lastTime = egret.getTimer();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		}
		/**初始化*/
		private onAddToStage(event: egret.Event) {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.createGameScene();
		}
		/**创建游戏场景 */
		private createGameScene() {
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
			this.btnStart.x = (this.stageW - this.btnStart.width) / 2;//居中定位
			this.btnStart.y = (this.stageH - this.btnStart.height) / 2;//居中定位
			this.btnStart.touchEnabled = true;//开启触碰
			// this.btnStart.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
			// this.btnStart.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
			this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);//点击按钮开始游戏
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
		}
		/**开始游戏 */
		private gameStart() {
			this.myScore = 0;
			this.myHp = 3;
			this.gameAllTime = 30;
			this.score.text = '得分：' + this.myScore;
			this.timesDisplay.text = '倒计时：' + this.gameAllTime;
			this.hp.text = "生命值：" + this.myHp;
			this.btnStart.visible = false;//隐藏开始按钮
			if (this.gameOverDisplay.parent == this)//移除显示的上次成绩
				this.removeChild(this.gameOverDisplay);

			this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
			this.bg.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onPlayerMove, this);
			//创建金币
			this.goldTimer.addEventListener(egret.TimerEvent.TIMER, this.createGold, this);
			this.goldTimer.start();

			//开始计时
			this.gameTimer.addEventListener(egret.TimerEvent.TIMER, this.onStartGameTimes, this);
			this.gameTimer.start();
		}
		/**游戏开始计时 */
		private onStartGameTimes() {
			if (this.gameAllTime <= 0) {
				this.gameOver();
				return;
			}
			this.gameAllTime--;
			this.timesDisplay.text = '倒计时：' + this.gameAllTime;
		}
		/**游戏结束 */
		private gameOver() {
			this.btnStart.visible = true;
			//移除一系列监听
			this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
			this.bg.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onPlayerMove, this);

			this.goldTimer.removeEventListener(egret.TimerEvent.TIMER, this.createGold, this);
			this.goldTimer.stop();

			this.gameTimer.removeEventListener(egret.TimerEvent.TIMER, this.onStartGameTimes, this);
			this.gameTimer.stop();

			//清理金币
			var gold: Gold.GoldPool;
			while (this.golds.length > 0) {
				gold = this.golds.pop();
				this.removeChild(gold);
				Gold.GoldPool.recovery(gold);
			}
			//清理炸弹
			var bomb: Gold.GoldPool;
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
		}
		/**游戏画面更新 */
		private gameViewUpdate() {
			//为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
			var nowTime: number = egret.getTimer();
			var fps: number = 1000 / (nowTime - this._lastTime);
			this._lastTime = nowTime;
			var speedOffset: number = 60 / fps;

			//金币下落
			var goldCount: number = this.golds.length;
			let gold: Gold.GoldPool;
			for (let i = 0; i < goldCount; i++) {
				gold = this.golds[i];
				if (gold.y > this.stage.stageHeight) {
					this.removeChild(gold);
					GoldPool.recovery(gold);
					this.golds.splice(i, 1);
					i--;
					goldCount--;//数组长度已经改变
				}

				gold.y += 8 * speedOffset;
			}

			//炸弹下落
			var bombCount: number = this.bombs.length;
			let bomb: Gold.GoldPool;
			for (let j = 0; j < bombCount; j++) {
				bomb = this.bombs[j];
				if (bomb.y > this.stage.stageHeight) {
					this.removeChild(bomb);
					GoldPool.recovery(bomb);
					this.bombs.splice(j, 1);
					j--;
					bombCount--;//数组长度已经改变
				}

				bomb.y += 9 * speedOffset;
			}

			this.hitJudge();
		}
		/**碰撞判断 */
		private hitJudge() {
			let goldsCount = this.golds.length;
			let gold: GoldPool;
			//碰撞删除的金币
			let delGolds: GoldPool[] = [];
			//金币与主角碰撞加分
			for (let i = 0; i < goldsCount; i++) {
				gold = this.golds[i];
				if (Gold.Util.collision(this.player, gold)) {

					if (delGolds.indexOf(gold) == -1)
						delGolds.push(gold);
				}
			}

			//碰撞删除的炸弹
			let delBombs: GoldPool[] = [];
			let bombsCount = this.bombs.length;
			let bomb: GoldPool;
			//金币与主角碰撞加分
			for (let j = 0; j < bombsCount; j++) {
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
			} else {
				//回收碰撞删除的金币
				this.myScore += delGolds.length;
				while (delGolds.length > 0) {
					gold = delGolds.pop();
					this.removeChild(gold);
					this.golds.splice(this.golds.indexOf(gold), 1);
					GoldPool.recovery(gold);
				}
				this.score.text = '得分：' + this.myScore;

				//回收碰撞删除的炸弹
				while (delBombs.length > 0) {
					bomb = delBombs.pop();
					this.removeChild(bomb);
					this.bombs.splice(this.bombs.indexOf(bomb), 1);
					GoldPool.recovery(bomb);
				}
			}
		}
		private bombCount: number = 0;
		/**创建金币与炸弹 */
		private createGold(evt: egret.TimerEvent): void {
			var gold: Gold.GoldPool = Gold.GoldPool.produce("gold");
			gold.x = Math.random() * (this.stageW - gold.width);
			gold.y = -gold.height;
			this.addChildAt(gold, this.numChildren - 1);
			this.golds.push(gold);

			this.bombCount++;
			if (this.bombCount >= 2) {//生成炸弹的时间是金币的两倍
				this.bombCount = 0;
				var bomb: Gold.GoldPool = Gold.GoldPool.produce("bomb");
				bomb.x = Math.random() * (this.stageW - bomb.width);
				bomb.y = -bomb.height;
				this.addChildAt(bomb, this.numChildren - 1);
				this.bombs.push(bomb);
			}
		}
		/**角色移动 */
		private onPlayerMove(e: egret.TouchEvent): void {
			let curX: number = e.stageX;
			curX = Math.max(0, curX);
			curX = Math.min(curX, this.stageW - this.player.width);
			this.player.x = curX;
		}
	}
}