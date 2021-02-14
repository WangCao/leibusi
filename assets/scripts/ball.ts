import poolManager from "./common/poolManager";
import pubSub from "./common/pubsub";
import { BALLTYPE } from "./contant";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ball extends cc.Component {
	@property({ type: cc.Label })
	title: cc.Label = null;

	@property({ type: cc.Sprite })
	phoneSprite: cc.Sprite = null;

	canTrigger: boolean = true;
	level: number = null;
	rigidBodyCollider: cc.PhysicsCircleCollider = null; //碰撞器
	rigidBody: cc.RigidBody = null; //刚体
	sprite: cc.Sprite = null;

	onLoad() {
		this.rigidBodyCollider = this.node.getComponent(cc.PhysicsCircleCollider);
		this.rigidBody = this.node.getComponent(cc.RigidBody);
	}

	public init(opt: BALLTYPE) {
		this.level = opt.level;
		this.title.string = opt.name;
		this.node.scale = 0.3 + 0.1 * opt.level;
		this.rigidBodyCollider.radius = this.node.width / 2;
		this.rigidBodyCollider.apply();

		let url = `texture/phone/${this.level}`;
		cc.resources.load(url, cc.SpriteFrame, (err, frame: cc.SpriteFrame) => {
			if (err) {
				cc.error(err);
				return;
			}
			this.phoneSprite.spriteFrame = frame;
		});
	}

	hideBall() {
		this.rigidBodyCollider.radius = 0;
		this.rigidBodyCollider.apply();
	}

	onBeginContact(
		contact: cc.PhysicsContact,
		selfCollider: cc.PhysicsCollider,
		otherCollider: cc.PhysicsCollider
	) {
		if (otherCollider.node.group === "default") {
			return;
		}
		if (selfCollider.node.y < otherCollider.node.y) {
			return;
		}

		const other = otherCollider.getComponent("ball") as ball;
		if (
			other != null &&
			other.canTrigger &&
			this.canTrigger &&
			other.level === this.level
		) {
			other.canTrigger = false;
			this.canTrigger = false;
			this.hideBall();
			other.hideBall();
			cc.tween(selfCollider.node)
				.to(0.1, { position: otherCollider.node.position })
				.call(() => {
					pubSub.publish("generatorBigerBall", {
						level: this.level + 1,
						pos: selfCollider.node.position,
					});
					// otherCollider.node.active = false;
					// selfCollider.node.active = false;
					// otherCollider.node.removeFromParent();
					// selfCollider.node.removeFromParent();
					// poolManager.putNode(otherCollider.node);
					// poolManager.putNode(selfCollider.node);
					otherCollider.node.destroy();
					selfCollider.node.destroy();
				})
				.start();
		}
	}

	public onCollisionEnter(other, self) {
		console.log(other);
		console.log(self);
		const world = self.world;
		console.log(world.position);
	}

	public setRigidBodyAwake(b: boolean) {
		this.rigidBody.awake = b;
	}
}
