module Gold {
	/**金币管理类 */
	export class GoldPool extends eui.Image {

		public textureName: string;//可视为金币类型名

		public constructor(texture: string, textureName: string) {
			super(texture + '_png');
			this.textureName = textureName;
		}

		private static cacheDict: Object = {};

		/**
		 * 生成金币或炸弹 
		 * @param textureName 图片资源名也是类型名
		*/
		public static produce(textureName: string): Gold.GoldPool {
			if (!this.cacheDict[textureName])
				this.cacheDict[textureName] = [];

			let goldArr: Gold.GoldPool[] = this.cacheDict[textureName];
			let gold: Gold.GoldPool = null;
			if (goldArr.length > 0)
				gold = goldArr.pop();
			else
				gold = new Gold.GoldPool(textureName, textureName);

			return gold;
		}

		/**
		 * 回收金币或炸弹 
		 * @param gold 金币实例
		*/
		public static recovery(gold: Gold.GoldPool): void {
			let textureName = gold.textureName;
			if (!this.cacheDict[textureName])
				this.cacheDict[textureName] = [];

			let goldsArr: Gold.GoldPool[] = this.cacheDict[textureName];
			if (goldsArr.indexOf(gold) == -1)
				goldsArr.push(gold);
		}
	}
}