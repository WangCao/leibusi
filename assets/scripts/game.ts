const { ccclass, property } = cc._decorator;
import PoolManager from "./common/poolManager";
import ball from "./ball";
import Contant from "./contant";

@ccclass
export default class NewClass extends cc.Component {
	@property(cc.Node)
	boxsPageNode: cc.Node = null;

	@property(cc.Prefab)
	box: cc.Prefab = null;

	private _nodepool: cc.NodePool = null;

	onLoad() {
		const PhysicsManager = cc.director.getPhysicsManager();
		PhysicsManager.enabled = true;

		const CollisionManager = cc.director.getCollisionManager();
		CollisionManager.enabled = true;

		this.boxsPageNode.on(
			cc.Node.EventType.TOUCH_START,
			this._downLoadBox,
			this
		);
	}
	private _downLoadBox(e: cc.Event.EventTouch) {
		console.log(e.getLocation().x);
		this._generatorBox(e.getLocation().x);
	}

	private _generatorBox(x: number) {
		let num = Math.floor(Math.random() * 4);

		let node = PoolManager.getNode(this.box, this.boxsPageNode);
		let cop = node.getComponent("ball") as ball;
		cop.init(Contant.BAlls[num]);
		node.setPosition(x - cc.winSize.width / 2, 460);
	}
}
