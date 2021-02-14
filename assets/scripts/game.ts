const { ccclass, property } = cc._decorator;
import PoolManager from "./common/poolManager";
import ball from "./ball";
import Contant from "./contant";
import pubSub from "./common/pubsub";
import AudioManager from "./common/audioManager";
import Configurable from "./common/configuration";
import flyReward from "./common/flyReward";

@ccclass
export default class NewClass extends cc.Component {
	@property(cc.Node)
	boxsPageNode: cc.Node = null;

	@property(cc.Prefab)
	box: cc.Prefab = null;

	@property(cc.Prefab)
	flyReward: cc.Prefab = null;

	@property(cc.Node)
	flyRewardNode: cc.Node = null;

	@property(cc.Node)
	musicNode: cc.Node = null;

	@property(cc.Node)
	scoreNode: cc.Node = null;

	private _isMusicPlay: 0 | 1 = 1;
	private _musicTween: cc.Tween = null;
	private _loadingNode: cc.Node = null;
	private _scoreLabel: cc.Label = null;
	private _goldNode: cc.Node = null;

	private _allMoney: number = 0;

	onLoad() {
		this._loadingNode = cc.find("Canvas/loading");
		this._scoreLabel = this.scoreNode
			.getChildByName("num")
			.getComponent(cc.Label);
		this._goldNode = this.scoreNode.getChildByName("commonIconGold");

		const PhysicsManager = cc.director.getPhysicsManager();
		PhysicsManager.enabled = true;

		const CollisionManager = cc.director.getCollisionManager();
		CollisionManager.enabled = true;

		pubSub.subscribe("generatorBigerBall", this._generatorBiggerBox, this);
		pubSub.subscribe("receiveGold", this._sheckScoreMoney, this);
		this.musicNode.on(cc.Node.EventType.TOUCH_START, this._switchMusic, this);

		this.boxsPageNode.on(
			cc.Node.EventType.TOUCH_START,
			this._downLoadBox,
			this
		);

		this.initGameByConfig();
	}
	private _sheckScoreMoney() {
		this._allMoney += 1;
		cc.tween(this._goldNode)
			.to(0.1, { scale: 1.3 })
			.to(0.1, { scale: 1 })
			.start();
	}

	private _setScoreLabel(num: number) {
		this._scoreLabel.string = `${num}亿`;
	}

	startGame() {
		this._loadingNode.active = false;
	}

	initGameByConfig() {
		let ismusic = Configurable.getConfigData("isMusicPlay");
		if (ismusic && ismusic == 0) {
			this._isMusicPlay = 0;
		}
		this._initMusicInfo();

		let money = Number(Configurable.getConfigData("money"));
		this._setScoreLabel(money);
	}

	private _switchMusic() {
		this._isMusicPlay = (1 - this._isMusicPlay) as 0 | 1;
		console.log(this._isMusicPlay);
		Configurable.setConfigData("isMusicPlay", this._isMusicPlay);
		this._initMusicInfo();
	}

	private _initMusicInfo() {
		if (this._isMusicPlay == 1) {
			AudioManager.playMusic("areyouok", true);
			console.log("xixihah");
			if (this._musicTween) {
				this._musicTween.start();
			} else {
				this._musicTween = cc
					.tween(this.musicNode)
					.repeatForever(cc.tween().by(3, { angle: 360 }))
					.start();
			}
		} else {
			if (this._musicTween) {
				this._musicTween.stop();
				AudioManager.stopAll();
			}
		}
	}

	private _generatorBiggerBox(evt) {
		// console.log(evt);
		let level = evt.level;
		let pos = evt.pos;
		let node = PoolManager.getNode(this.box, this.boxsPageNode);
		let ball = node.getComponent("ball") as ball;
		ball.init(Contant.BAlls[level - 1]);
		node.setPosition(pos);
		this._setFlyReward(pos, level);
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

	private _setFlyReward(pos: cc.Vec3, score: number) {
		let node = PoolManager.getNode(this.flyReward, this.flyRewardNode);
		let cop = node.getComponent("flyReward") as flyReward;
		// node.setPosition(pos);
		cop.init(score, pos);
		// cop.start();
	}

	update() {
		this._setScoreLabel(this._allMoney);
	}
}
