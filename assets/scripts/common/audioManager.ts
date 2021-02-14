import resourceUtil from "./resourceUilt";
import { singleton } from "./singleton";

@singleton
class audioManager {
	audios: any = {};
	arrSound: any = [];

	playMusic(name: string, loop: boolean) {
		let path = "audio/" + name;
		resourceUtil.loadRes(path, cc.AudioClip, (err, clip: cc.AudioClip) => {
			cc.audioEngine.play(clip, loop, 0.5);
		});
	}

	stopAll() {
		cc.audioEngine.stopAll();
	}
}

export default new audioManager();
