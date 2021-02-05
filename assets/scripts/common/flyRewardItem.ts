const { ccclass, property } = cc._decorator;

@ccclass
export default class flyReward extends cc.Component {
	// targetPos: cc.Vec3 = new cc.Vec3();
	targetRotation: cc.Vec3 = new cc.Vec3(0, 0, 0);
	targetScale: cc.Vec3 = new cc.Vec3(1, 1, 1);
	posLast: cc.Vec3;
	_callback: Function;

	show(imgItem: cc.SpriteFrame, posLast: cc.Vec3, callback: Function) {
		this.posLast = posLast;
		this._callback = callback;
		let sprite = this.node.addComponent(cc.Sprite);
		sprite.trim = false;
		sprite.spriteFrame = imgItem;

		this.node.eulerAngles = new cc.Vec3(0, 0, Math.floor(Math.random() * 360));
		this.targetRotation = new cc.Vec3(this.node.eulerAngles);

		let randTargetPos = new cc.Vec3(
			Math.floor(Math.random() * 300) - 150,
			Math.floor(Math.random() * 300) - 150,
			0
		);
		let costTime = cc.Vec3.distance(randTargetPos, new cc.Vec3(0, 0, 0)) / 400;

		cc.tween(this.node)
			.to(costTime, { position: randTargetPos }, { easing: "cubicInOut" })
			.start();

		let randRotation = 120 + Math.floor(Math.random() * 60);
		randRotation =
			this.targetRotation.z + Math.floor(Math.random() * 2) === 1
				? randRotation
				: -randRotation;

		cc.tween(this.node)
			.to(costTime, {
				eulerAngles: this.targetRotation,
			})
			.start();

		cc.tween(this.node)
			.to((costTime * 2) / 3, { scale: 1.4 })
			.to(costTime / 3, { scale: 1 })
			.call(() => {
				this.move2Target();
			})
			.start();
	}

	move2Target() {
		let move2TargetTime =
			cc.Vec3.distance(this.node.position, this.posLast) / 1500;

		let delayTime = Math.floor(Math.random() * 10) / 10; //0~1s
		cc.tween(this.node)
			.to(0.3, { scale: 1.4 })
			.to(0.7, { scale: 1 })
			.union()
			.repeat(50)
			.start();

		this.scheduleOnce(() => {
			cc.tween(this.node)
				.to(move2TargetTime, { position: this.posLast })
				.call(() => {
					//飞行结束
					this._callback && this._callback(this.node);
				})
				.start();
		}, delayTime);
	}

	update(deltaTime: number) {}
}
