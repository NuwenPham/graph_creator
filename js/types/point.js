define([], function() {
	var point = function point(_x, _y) {
		this.x = _x;
		this.y = _y;
	};

	point.prototype = {
		subtraction: function (_point) {
			return new point(this.x - _point.x, this.y - _point.y);
		}
	};

	return point;
});