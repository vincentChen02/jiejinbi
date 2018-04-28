module Gold {
	export class GameContainer extends egret.DisplayObjectContainer {

		private stageW: number = 1280;
		private stageH: number = 720;

		//背景
		private bg: eui.Image;
		//角色
		private player: eui.Image;

		//触发金币间隔
		private goldTimer: egret.Timer = new egret.Timer(500);
		/**场景总的金币*/
		private golds: Gold.GoldPool[] = [];

		public constructor() {
			super();
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
            // this.btnStart = fighter.createBitmapByName("btnStart");//开始按钮
            // this.btnStart.x = (this.stageW - this.btnStart.width) / 2;//居中定位
            // this.btnStart.y = (this.stageH - this.btnStart.height) / 2;//居中定位
            // this.btnStart.touchEnabled = true;//开启触碰
            // this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gameStart,this);//点击按钮开始游戏
            // this.addChild(this.btnStart);
		}
		/**开始游戏 */
		private gameStart() {

			this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);

			//创建金币
			this.goldTimer.addEventListener(egret.TimerEvent.TIMER, this.createGold, this);
			this.goldTimer.start();
		}
		/**游戏画面更新 */
		private gameViewUpdate() {

		}
		/**创建金币 */
		private createGold(evt: egret.TimerEvent): void {
			var gold: Gold.GoldPool = Gold.GoldPool.produce("gold");
			gold.x = Math.random() * (this.stageW - gold.width);
			gold.y = -gold.height;
			this.addChildAt(gold, this.numChildren - 1);
			this.golds.push(gold);
		}
	}
}