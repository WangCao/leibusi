export default class resourceUtil {
	public static loadRes(url: string, type: any, cb: Function) {
		cc.resources.load(url, type, function (err, res) {
			if (err) {
				cc.error(err.message || err);
				cb(err, res);
				return;
			}
			cb(err, res);
		});
	}
}
