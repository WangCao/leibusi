import flyRewardItem from "./flyRewardItem";
import pubSub from "./pubsub";

const MAX_REWARD_COUNT = 10;

const { ccclass, property } = cc._decorator;

@ccclass
export default class flyReward extends cc.Component {
	@property(cc.SpriteFrame)
	imgGold: cc.SpriteFrame = null;

	@property(cc.Node)
	ndRewardParent: cc.Node = null;

	@property(cc.Node)
	BoomNode: cc.Node = null;

	finishIdx: number = 0;
	_callback: Function;

	start() {
		this.BoomNode.getComponent(cc.Animation).play();
		this.createReward();
	}

	getTargetPos() {
		let v3 = cc.v3();
		let score = cc.find("Canvas/score") as cc.Node;
		if (!score) {
			return;
		}
		score.getPosition(v3);
		console.log(v3);
		return v3;
	}

	createReward() {
		let imgReward = this.imgGold;

		let targetPos = this.getTargetPos();
		for (let i = 0; i < MAX_REWARD_COUNT; i++) {
			let rewardNode = new cc.Node("flyRewardItem");
			let flyItem = rewardNode.addComponent(flyRewardItem);
			rewardNode.parent = this.ndRewardParent;
			flyItem.show(imgReward, targetPos, (node: cc.Node) => {
				this.onFlyOver(node);
			});
		}
	}

	onFlyOver(node: cc.Node) {
		pubSub.publish("receiveGold");

		// cc.gameSpace.audioManager.playSound('sell', false);
		node.active = false;
		this.finishIdx++;
		if (this.finishIdx === MAX_REWARD_COUNT) {
			if (this._callback) {
				this._callback();
			}

			this.node.destroy();
		}
	}
}
