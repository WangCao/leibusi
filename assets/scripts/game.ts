const { ccclass, property } = cc._decorator;
import PoolManager from "./common/poolManager";
import ball from "./ball";
import Contant from "./contant";
import pubSub from "./common/pubsub";
import AudioManager from "./common/audioManager";
import Configurable from "./common/configuration";

@ccclass
export default class NewClass extends cc.Component {
	@property(cc.Node)
	boxsPageNode: cc.Node = null;

	@property(cc.Prefab)
	box: cc.Prefab = null;

	@property(cc.Node)
	musicNode: cc.Node = null;

	private _isMusicPlay: 0 | 1 = 1;
	private _musicTween: cc.Tween = null;

	onLoad() {
		this.initGame();
		const PhysicsManager = cc.director.getPhysicsManager();
		PhysicsManager.enabled = true;

		const CollisionManager = cc.director.getCollisionManager();
		CollisionManager.enabled = true;

		pubSub.subscribe("generatorBigerBall", this._generatorBiggerBox, this);
		this.musicNode.on(cc.Node.EventType.TOUCH_START, this._switchMusic, this);

		this.boxsPageNode.on(
			cc.Node.EventType.TOUCH_START,
			this._downLoadBox,
			this
		);
	}

	initGame() {
		let ismusic = Configurable.getConfigData("isMusicPlay");
		if (ismusic && ismusic == 0) {
			this._isMusicPlay = 0;
		}
		this._initMusicInfo();
	}

	private _switchMusic() {
		this._isMusicPlay = (1 - this._isMusicPlay) as 0 | 1;
		console.log(this._isMusicPlay)
		Configurable.setConfigData("isMusicPlay", this._isMusicPlay);
		this._initMusicInfo();
	}

	private _initMusicInfo() {
		if (this._isMusicPlay == 1) {
			AudioManager.playMusic("areyouok", true);
			console.log("xixihah")
			if (this._musicTween) {
				this._musicTween.start();
			}else {
				this._musicTween = cc
				.tween(this.musicNode)
				.repeatForever(
					cc.tween()
						.by(3, { angle: 360 })
				)
				.start();
			}	
		} else {
			if (this._musicTween) {
				this._musicTween.stop();
				
			}
		}
	}

	private _generatorBiggerBox(evt) {
		console.log(evt);
		let level = evt.level;
		let pos = evt.pos;
		let node = PoolManager.getNode(this.box, this.boxsPageNode);
		let ball = node.getComponent("ball") as ball;
		ball.init(Contant.BAlls[level - 1]);
		// ball.setRigidBodyAwake(false);
		node.setPosition(pos);
		// node.setScale(0);
		// cc.tween(node)
		// 	.to(0.1, { scale: 1 })
		// 	.call(() => {
		// 		ball.setRigidBodyAwake(true);
		// 	})
		// 	.start();
	}
	private _downLoadBox(e: cc.Event.EventTouch) {
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
