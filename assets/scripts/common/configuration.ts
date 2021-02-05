import { singleton } from "./singleton";
const { ccclass, property } = cc._decorator;

@singleton
@ccclass
class configuration {
	private _key: string = "mygame";
	jsonData: any = {};

	start() {
		let content = cc.sys.localStorage.getItem(this._key);
		if (content) {
			this.jsonData = JSON.parse(content);
		}
	}

	setConfigData(key: string, value: any) {
		this.jsonData[key] = value;
		this.save();
	}
	getConfigData(key: string) {
		if (this.jsonData && this.jsonData[key]) {
			return this.jsonData[key];
		} else {
			return "";
		}
	}

	save() {
		let str = JSON.stringify(this.jsonData);
		if (!cc.sys.isNative) {
			let ls = cc.sys.localStorage;
			ls.setItem(this._key, str);
		}
	}
}

export default new configuration();
