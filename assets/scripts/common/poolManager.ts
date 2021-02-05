const { ccclass, property } = cc._decorator;
import { singleton } from "./singleton";

@singleton
@ccclass
class poolManager {
	dictPool = {};
	dictPrefab = {};
	getNode(prefab: cc.Prefab, parent: cc.Node) {
		let name = prefab.name;
		this.dictPrefab[name] = prefab;
		let node: cc.Node = null;
		if (this.dictPool.hasOwnProperty(name)) {
			let pool: cc.NodePool = this.dictPool[name];
			if (pool.size() > 0) {
				node = pool.get();
			} else {
				node = cc.instantiate(prefab);
			}
		} else {
			let pool = new cc.NodePool();
			this.dictPool[name] = pool;
			node = cc.instantiate(prefab);
		}
		node.parent = parent;
		return node;
	}

	putNode(node: cc.Node) {
		let name = node.name;
		let pool: cc.NodePool = null;
		if (this.dictPool.hasOwnProperty(name)) {
			pool = this.dictPool[name];
		} else {
			pool = new cc.NodePool();
			this.dictPool[name] = pool;
		}
		pool.put(node);
	}

	clearPool(name: string) {
		if (this.dictPool.hasOwnProperty(name)) {
			let pool: cc.NodePool = this.dictPool[name];
			pool.clear();
		}
	}
}

export default new poolManager();
