module Gold {
	export class Util {

		/**
		 * 基于矩形碰撞检测
		 * @param obj1 碰撞体
		 *  */
		public static collision(obj1: egret.DisplayObject, obj2: egret.DisplayObject) {
			var rect1: egret.Rectangle = obj1.getBounds();
			var rect2: egret.Rectangle = obj2.getBounds();
			rect1.x = obj1.x;
			rect1.y = obj1.y;
			rect2.x = obj2.x;
			rect2.y = obj2.y;
			//返回是否碰撞
			return rect1.intersects(rect2);
		}
	}
}