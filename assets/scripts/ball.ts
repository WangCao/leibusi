import { BALLTYPE } from "./contant";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ball extends cc.Component {
	@property({ type: cc.Label })
	title: cc.Label = null;

	level: number = null;

	public init(opt: BALLTYPE) {
		this.level = opt.level;
		this.title.string = opt.name;
		this.node.scale = 0.3 + 0.1 * opt.level;
		console.log(this.node.scale);
		let pc = this.node.getComponent(cc.PhysicsCircleCollider);
		pc.radius = this.node.width / 2;
		pc.apply();
	}
}
