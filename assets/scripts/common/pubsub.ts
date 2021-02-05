import { singleton } from "./singleton";

@singleton
class pubSub {
	static eventMap = {};

	public static subscribe(evt: string, fn: Function, target?: any) {
		if (typeof fn !== "function") {
			throw "相应函数必须为function";
		}

		this.eventMap[evt] = this.eventMap[evt] || [];
		!~this.eventMap[evt].indexOf(fn) &&
			this.eventMap[evt].push({ func: fn, target });
	}

	public static publish(evt, data?: any) {
		console.log(evt, data);
		this.eventMap[evt] &&
			this.eventMap[evt].forEach((event) =>
				event.func.call(event.target, data)
			);
	}

	public static remove(evt) {
		if (!this.eventMap[evt]) return;
		delete this.eventMap[evt];
	}
}

export default pubSub;
