const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
	onLoad() {
		const PhysicsManager = cc.director.getPhysicsManager();
		PhysicsManager.enabled = true;

		const CollisionManager = cc.director.getCollisionManager();
		CollisionManager.enabled = true;
	}
}
