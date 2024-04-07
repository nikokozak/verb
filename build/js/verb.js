// Header for verb for JavaScript
// Borrowed from browserify, this header supports AMD (define) and common js (require) style modules

function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}

var verb_Verb = function() { };
verb_Verb.main = function() {
	console.log("verb 2.1.0");
};
var verb_core_ArrayExtensions = function() { };
verb_core_ArrayExtensions.alloc = function(a,n) {
	if(n < 0) return;
	while(a.length < n) a.push(null);
};
verb_core_ArrayExtensions.reversed = function(a) {
	var ac = a.slice();
	ac.reverse();
	return ac;
};
verb_core_ArrayExtensions.last = function(a) {
	return a[a.length - 1];
};
verb_core_ArrayExtensions.first = function(a) {
	return a[0];
};
verb_core_ArrayExtensions.spliceAndInsert = function(a,start,end,ele) {
	a.splice(start,end);
	a.splice(start,0,ele);
};
verb_core_ArrayExtensions.left = function(arr) {
	if(arr.length == 0) return [];
	var len = Math.ceil(arr.length / 2);
	return arr.slice(0,len);
};
verb_core_ArrayExtensions.right = function(arr) {
	if(arr.length == 0) return [];
	var len = Math.ceil(arr.length / 2);
	return arr.slice(len);
};
verb_core_ArrayExtensions.rightWithPivot = function(arr) {
	if(arr.length == 0) return [];
	var len = Math.ceil(arr.length / 2);
	return arr.slice(len - 1);
};
verb_core_ArrayExtensions.unique = function(arr,comp) {
	if(arr.length == 0) return [];
	var uniques = [arr.pop()];
	while(arr.length > 0) {
		var ele = arr.pop();
		var isUnique = true;
		var _g = 0;
		while(_g < uniques.length) {
			var unique = uniques[_g];
			++_g;
			if(comp(ele,unique)) {
				isUnique = false;
				break;
			}
		}
		if(isUnique) uniques.push(ele);
	}
	return uniques;
};
var verb_core_Binomial = function() { };
verb_core_Binomial.get = function(n,k) {
	if(k == 0.0) return 1.0;
	if(n == 0 || k > n) return 0.0;
	if(k > n - k) k = n - k;
	if(verb_core_Binomial.memo_exists(n,k)) return verb_core_Binomial.get_memo(n,k);
	var r = 1;
	var n_o = n;
	var _g1 = 1;
	var _g = k + 1;
	while(_g1 < _g) {
		var d = _g1++;
		if(verb_core_Binomial.memo_exists(n_o,d)) {
			n--;
			r = verb_core_Binomial.get_memo(n_o,d);
			continue;
		}
		r *= n--;
		r /= d;
		verb_core_Binomial.memoize(n_o,d,r);
	}
	return r;
};
verb_core_Binomial.get_no_memo = function(n,k) {
	if(k == 0) return 1;
	if(n == 0 || k > n) return 0;
	if(k > n - k) k = n - k;
	var r = 1;
	var n_o = n;
	var _g1 = 1;
	var _g = k + 1;
	while(_g1 < _g) {
		var d = _g1++;
		r *= n--;
		r /= d;
	}
	return r;
};
verb_core_Binomial.memo_exists = function(n,k) {
	return verb_core_Binomial.memo.h.hasOwnProperty(n) && verb_core_Binomial.memo.h[n].h.hasOwnProperty(k);
};
verb_core_Binomial.get_memo = function(n,k) {
	return verb_core_Binomial.memo.h[n].h[k];
};
verb_core_Binomial.memoize = function(n,k,val) {
	if(!verb_core_Binomial.memo.h.hasOwnProperty(n)) verb_core_Binomial.memo.set(n,new haxe_ds_IntMap());
	verb_core_Binomial.memo.h[n].h[k] = val;
};
var verb_core_BoundingBox = function(pts) {
	this.max = null;
	this.min = null;
	this.dim = 3;
	this.initialized = false;
	if(pts != null) this.addRange(pts);
};
// verb_core_BoundingBox.__name__ = ["verb","core","BoundingBox"];
verb_core_BoundingBox.intervalsOverlap = function(a1,a2,b1,b2,tol) {
	if(tol == null) tol = -1;
	var tol1;
	if(tol < -0.5) tol1 = verb_core_Constants.TOLERANCE; else tol1 = tol;
	var x1 = Math.min(a1,a2) - tol1;
	var x2 = Math.max(a1,a2) + tol1;
	var y1 = Math.min(b1,b2) - tol1;
	var y2 = Math.max(b1,b2) + tol1;
	return x1 >= y1 && x1 <= y2 || x2 >= y1 && x2 <= y2 || y1 >= x1 && y1 <= x2 || y2 >= x1 && y2 <= x2;
};
verb_core_BoundingBox.prototype = {
	fromPoint: function(pt) {
		return new verb_core_BoundingBox([pt]);
	}
	,add: function(point) {
		if(!this.initialized) {
			this.dim = point.length;
			this.min = point.slice(0);
			this.max = point.slice(0);
			this.initialized = true;
			return this;
		}
		var _g1 = 0;
		var _g = this.dim;
		while(_g1 < _g) {
			var i = _g1++;
			if(point[i] > this.max[i]) this.max[i] = point[i];
			if(point[i] < this.min[i]) this.min[i] = point[i];
		}
		return this;
	}
	,addRange: function(points) {
		var l = points.length;
		var _g = 0;
		while(_g < l) {
			var i = _g++;
			this.add(points[i]);
		}
		return this;
	}
	,contains: function(point,tol) {
		if(tol == null) tol = -1;
		if(!this.initialized) return false;
		return this.intersects(new verb_core_BoundingBox([point]),tol);
	}
	,intersects: function(bb,tol) {
		if(tol == null) tol = -1;
		if(!this.initialized || !bb.initialized) return false;
		var a1 = this.min;
		var a2 = this.max;
		var b1 = bb.min;
		var b2 = bb.max;
		var _g1 = 0;
		var _g = this.dim;
		while(_g1 < _g) {
			var i = _g1++;
			if(!verb_core_BoundingBox.intervalsOverlap(a1[i],a2[i],b1[i],b2[i],tol)) return false;
		}
		return true;
	}
	,clear: function() {
		this.initialized = false;
		return this;
	}
	,getLongestAxis: function() {
		var max = 0.0;
		var id = 0;
		var _g1 = 0;
		var _g = this.dim;
		while(_g1 < _g) {
			var i = _g1++;
			var l = this.getAxisLength(i);
			if(l > max) {
				max = l;
				id = i;
			}
		}
		return id;
	}
	,getAxisLength: function(i) {
		if(i < 0 || i > this.dim - 1) return 0.0;
		return Math.abs(this.min[i] - this.max[i]);
	}
	,intersect: function(bb,tol) {
		if(!this.initialized) return null;
		var a1 = this.min;
		var a2 = this.max;
		var b1 = bb.min;
		var b2 = bb.max;
		if(!this.intersects(bb,tol)) return null;
		var maxbb = [];
		var minbb = [];
		var _g1 = 0;
		var _g = this.dim;
		while(_g1 < _g) {
			var i = _g1++;
			maxbb.push(Math.min(a2[i],b2[i]));
			minbb.push(Math.max(a1[i],b1[i]));
		}
		return new verb_core_BoundingBox([minbb,maxbb]);
	}
	,__class__: verb_core_BoundingBox
};
var verb_core_Constants = function() { };
// verb_core_Constants.__name__ = ["verb","core","Constants"];
var verb_core_SerializableBase = function() { };
// verb_core_SerializableBase.__name__ = ["verb","core","SerializableBase"];
verb_core_SerializableBase.prototype = {
	serialize: function() {
		var serializer = new haxe_Serializer();
		serializer.serialize(this);
		return serializer.toString();
	}
	,__class__: verb_core_SerializableBase
};
var verb_core_Plane = function(origin,normal) {
	this.origin = origin;
	this.normal = normal;
};
// verb_core_Plane.__name__ = ["verb","core","Plane"];
verb_core_Plane.__super__ = verb_core_SerializableBase;
verb_core_Plane.prototype = $extend(verb_core_SerializableBase.prototype,{
	__class__: verb_core_Plane
});
var verb_core_Ray = function(origin,dir) {
	this.origin = origin;
	this.dir = dir;
};
// verb_core_Ray.__name__ = ["verb","core","Ray"];
verb_core_Ray.__super__ = verb_core_SerializableBase;
verb_core_Ray.prototype = $extend(verb_core_SerializableBase.prototype,{
	__class__: verb_core_Ray
});
var verb_core_NurbsCurveData = function(degree,knots,controlPoints) {
	this.degree = degree;
	this.controlPoints = controlPoints;
	this.knots = knots;
};
// verb_core_NurbsCurveData.__name__ = ["verb","core","NurbsCurveData"];
verb_core_NurbsCurveData.__super__ = verb_core_SerializableBase;
verb_core_NurbsCurveData.prototype = $extend(verb_core_SerializableBase.prototype,{
	__class__: verb_core_NurbsCurveData
});
var verb_core_NurbsSurfaceData = function(degreeU,degreeV,knotsU,knotsV,controlPoints) {
	this.degreeU = degreeU;
	this.degreeV = degreeV;
	this.knotsU = knotsU;
	this.knotsV = knotsV;
	this.controlPoints = controlPoints;
};
// verb_core_NurbsSurfaceData.__name__ = ["verb","core","NurbsSurfaceData"];
verb_core_NurbsSurfaceData.__super__ = verb_core_SerializableBase;
verb_core_NurbsSurfaceData.prototype = $extend(verb_core_SerializableBase.prototype,{
	__class__: verb_core_NurbsSurfaceData
});
var verb_core_MeshData = function(faces,points,normals,uvs) {
	this.faces = faces;
	this.points = points;
	this.normals = normals;
	this.uvs = uvs;
};
// verb_core_MeshData.__name__ = ["verb","core","MeshData"];
verb_core_MeshData.empty = function() {
	return new verb_core_MeshData([],[],[],[]);
};
verb_core_MeshData.__super__ = verb_core_SerializableBase;
verb_core_MeshData.prototype = $extend(verb_core_SerializableBase.prototype,{
	__class__: verb_core_MeshData
});
var verb_core_PolylineData = function(points,params) {
	this.points = points;
	this.params = params;
};
// verb_core_PolylineData.__name__ = ["verb","core","PolylineData"];
verb_core_PolylineData.__super__ = verb_core_SerializableBase;
verb_core_PolylineData.prototype = $extend(verb_core_SerializableBase.prototype,{
	__class__: verb_core_PolylineData
});
var verb_core_VolumeData = function(degreeU,degreeV,degreeW,knotsU,knotsV,knotsW,controlPoints) {
	this.degreeU = degreeU;
	this.degreeV = degreeV;
	this.degreeW = degreeW;
	this.knotsU = knotsU;
	this.knotsV = knotsV;
	this.knotsW = knotsW;
	this.controlPoints = controlPoints;
};
// verb_core_VolumeData.__name__ = ["verb","core","VolumeData"];
verb_core_VolumeData.__super__ = verb_core_SerializableBase;
verb_core_VolumeData.prototype = $extend(verb_core_SerializableBase.prototype,{
	__class__: verb_core_VolumeData
});
var verb_core_Pair = function(item1,item2) {
	this.item0 = item1;
	this.item1 = item2;
};

verb_core_Pair.__name__ = ["verb","core","Pair"];
verb_core_Pair.prototype = {
	__class__: verb_core_Pair
};
var verb_core_Interval = function(min,max) {
	this.min = min;
	this.max = max;
};

verb_core_Interval.__name__ = ["verb","core","Interval"];
verb_core_Interval.prototype = {
	__class__: verb_core_Interval
};
var verb_core_CurveCurveIntersection = function(point0,point1,u0,u1) {
	this.point0 = point0;
	this.point1 = point1;
	this.u0 = u0;
	this.u1 = u1;
};

verb_core_CurveCurveIntersection.__name__ = ["verb","core","CurveCurveIntersection"];
verb_core_CurveCurveIntersection.prototype = {
	__class__: verb_core_CurveCurveIntersection
};
var verb_core_CurveSurfaceIntersection = function(u,uv,curvePoint,surfacePoint) {
	this.u = u;
	this.uv = uv;
	this.curvePoint = curvePoint;
	this.surfacePoint = surfacePoint;
};

verb_core_CurveSurfaceIntersection.__name__ = ["verb","core","CurveSurfaceIntersection"];
verb_core_CurveSurfaceIntersection.prototype = {
	__class__: verb_core_CurveSurfaceIntersection
};
var verb_core_MeshIntersectionPoint = function(uv0,uv1,point,faceIndex0,faceIndex1) {
	this.visited = false;
	this.adj = null;
	this.opp = null;
	this.uv0 = uv0;
	this.uv1 = uv1;
	this.point = point;
	this.faceIndex0;
	this.faceIndex1;
};

verb_core_MeshIntersectionPoint.__name__ = ["verb","core","MeshIntersectionPoint"];
verb_core_MeshIntersectionPoint.prototype = {
	__class__: verb_core_MeshIntersectionPoint
};
var verb_core_PolylineMeshIntersection = function(point,u,uv,polylineIndex,faceIndex) {
	this.point = point;
	this.u = u;
	this.uv = uv;
	this.polylineIndex = polylineIndex;
	this.faceIndex = faceIndex;
};

verb_core_PolylineMeshIntersection.__name__ = ["verb","core","PolylineMeshIntersection"];
verb_core_PolylineMeshIntersection.prototype = {
	__class__: verb_core_PolylineMeshIntersection
};
var verb_core_SurfaceSurfaceIntersectionPoint = function(uv0,uv1,point,dist) {
	this.uv0 = uv0;
	this.uv1 = uv1;
	this.point = point;
	this.dist = dist;
};

verb_core_SurfaceSurfaceIntersectionPoint.__name__ = ["verb","core","SurfaceSurfaceIntersectionPoint"];
verb_core_SurfaceSurfaceIntersectionPoint.prototype = {
	__class__: verb_core_SurfaceSurfaceIntersectionPoint
};
var verb_core_TriSegmentIntersection = function(point,s,t,r) {
	this.point = point;
	this.s = s;
	this.t = t;
	this.p = r;
};

verb_core_TriSegmentIntersection.__name__ = ["verb","core","TriSegmentIntersection"];
verb_core_TriSegmentIntersection.prototype = {
	__class__: verb_core_TriSegmentIntersection
};
var verb_core_CurveTriPoint = function(u,point,uv) {
	this.u = u;
	this.point = point;
	this.uv = uv;
};

verb_core_CurveTriPoint.__name__ = ["verb","core","CurveTriPoint"];
verb_core_CurveTriPoint.prototype = {
	__class__: verb_core_CurveTriPoint
};
var verb_core_SurfacePoint = function(point,normal,uv,id,degen) {
	if(degen == null) degen = false;
	if(id == null) id = -1;
	this.uv = uv;
	this.point = point;
	this.normal = normal;
	this.id = id;
	this.degen = degen;
};

verb_core_SurfacePoint.__name__ = ["verb","core","SurfacePoint"];
verb_core_SurfacePoint.fromUv = function(u,v) {
	return new verb_core_SurfacePoint(null,null,[u,v]);
};
verb_core_SurfacePoint.prototype = {
	__class__: verb_core_SurfacePoint
};
var verb_core_CurvePoint = function(u,pt) {
	this.u = u;
	this.pt = pt;
};

verb_core_CurvePoint.__name__ = ["verb","core","CurvePoint"];
verb_core_CurvePoint.prototype = {
	__class__: verb_core_CurvePoint
};
var verb_core_KdTree = function(points,distanceFunction) {
	this.dim = 3;
	this.points = points;
	this.distanceFunction = distanceFunction;
	this.dim = points[0].point.length;
	this.root = this.buildTree(points,0,null);
};

verb_core_KdTree.__name__ = ["verb","core","KdTree"];
verb_core_KdTree.prototype = {
	buildTree: function(points,depth,parent) {
		var dim = depth % this.dim;
		var median;
		var node;
		if(points.length == 0) return null;
		if(points.length == 1) return new verb_core_KdNode(points[0],dim,parent);
		points.sort(function(a,b) {
			var diff = a.point[dim] - b.point[dim];
			if(diff == 0.0) return 0; else if(diff > 0) return 1; else return -1;
		});
		median = Math.floor(points.length / 2);
		node = new verb_core_KdNode(points[median],dim,parent);
		node.left = this.buildTree(points.slice(0,median),depth + 1,node);
		node.right = this.buildTree(points.slice(median + 1),depth + 1,node);
		return node;
	}
	,nearest: function(point,maxNodes,maxDistance) {
		var _g = this;
		var bestNodes = new verb_core_BinaryHeap(function(e) {
			return -e.item1;
		});
		var nearestSearch;
		var nearestSearch1 = null;
		nearestSearch1 = function(node) {
			var bestChild;
			var dimension = node.dimension;
			var ownDistance = _g.distanceFunction(point,node.kdPoint.point);
			var linearPoint;
			var _g1 = [];
			var _g3 = 0;
			var _g2 = _g.dim;
			while(_g3 < _g2) {
				var i1 = _g3++;
				_g1.push(0.0);
			}
			linearPoint = _g1;
			var linearDistance;
			var otherChild;
			var i;
			var saveNode = function(node1,distance) {
				bestNodes.push(new verb_core_Pair(node1,distance));
				if(bestNodes.size() > maxNodes) bestNodes.pop();
			};
			var _g31 = 0;
			var _g21 = _g.dim;
			while(_g31 < _g21) {
				var i2 = _g31++;
				if(i2 == node.dimension) linearPoint[i2] = point[i2]; else linearPoint[i2] = node.kdPoint.point[i2];
			}
			linearDistance = _g.distanceFunction(linearPoint,node.kdPoint.point);
			if(node.right == null && node.left == null) {
				if(bestNodes.size() < maxNodes || ownDistance < bestNodes.peek().item1) saveNode(node,ownDistance);
				return;
			}
			if(node.right == null) bestChild = node.left; else if(node.left == null) bestChild = node.right; else if(point[dimension] < node.kdPoint.point[dimension]) bestChild = node.left; else bestChild = node.right;
			nearestSearch1(bestChild);
			if(bestNodes.size() < maxNodes || ownDistance < bestNodes.peek().item1) saveNode(node,ownDistance);
			if(bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek().item1) {
				if(bestChild == node.left) otherChild = node.right; else otherChild = node.left;
				if(otherChild != null) nearestSearch1(otherChild);
			}
		};
		nearestSearch = nearestSearch1;
		var _g4 = 0;
		while(_g4 < maxNodes) {
			var i3 = _g4++;
			bestNodes.push(new verb_core_Pair(null,maxDistance));
		}
		nearestSearch(this.root);
		var result = [];
		var _g5 = 0;
		while(_g5 < maxNodes) {
			var i4 = _g5++;
			if(bestNodes.content[i4].item0 != null) result.push(new verb_core_Pair(bestNodes.content[i4].item0.kdPoint,bestNodes.content[i4].item1));
		}
		return result;
	}
	,__class__: verb_core_KdTree
};
var verb_core_BinaryHeap = function(scoreFunction) {
	this.content = [];
	this.scoreFunction = scoreFunction;
};

verb_core_BinaryHeap.__name__ = ["verb","core","BinaryHeap"];
verb_core_BinaryHeap.prototype = {
	push: function(element) {
		this.content.push(element);
		this.bubbleUp(this.content.length - 1);
	}
	,pop: function() {
		var result = this.content[0];
		var end = this.content.pop();
		if(this.content.length > 0) {
			this.content[0] = end;
			this.sinkDown(0);
		}
		return result;
	}
	,peek: function() {
		return this.content[0];
	}
	,remove: function(node) {
		var len = this.content.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(this.content[i] == node) {
				var end = this.content.pop();
				if(i != len - 1) {
					this.content[i] = end;
					if(this.scoreFunction(end) < this.scoreFunction(node)) this.bubbleUp(i); else this.sinkDown(i);
				}
				return;
			}
		}
		throw new Error("Node not found.");
	}
	,size: function() {
		return this.content.length;
	}
	,bubbleUp: function(n) {
		var element = this.content[n];
		while(n > 0) {
			var parentN = Math.floor((n + 1.0) / 2) - 1;
			var parent = this.content[parentN];
			if(this.scoreFunction(element) < this.scoreFunction(parent)) {
				this.content[parentN] = element;
				this.content[n] = parent;
				n = parentN;
			} else break;
		}
	}
	,sinkDown: function(n) {
		var length = this.content.length;
		var element = this.content[n];
		var elemScore = this.scoreFunction(element);
		while(true) {
			var child2N = (n + 1) * 2;
			var child1N = child2N - 1;
			var swap = -1;
			var child1Score = 0.0;
			if(child1N < length) {
				var child1 = this.content[child1N];
				child1Score = this.scoreFunction(child1);
				if(child1Score < elemScore) swap = child1N;
			}
			if(child2N < length) {
				var child2 = this.content[child2N];
				var child2Score = this.scoreFunction(child2);
				if(child2Score < (swap == -1?elemScore:child1Score)) swap = child2N;
			}
			if(swap != -1) {
				this.content[n] = this.content[swap];
				this.content[swap] = element;
				n = swap;
			} else break;
		}
	}
	,__class__: verb_core_BinaryHeap
};
var verb_core_KdPoint = function(point,obj) {
	this.point = point;
	this.obj = obj;
};

verb_core_KdPoint.__name__ = ["verb","core","KdPoint"];
verb_core_KdPoint.prototype = {
	__class__: verb_core_KdPoint
};
var verb_core_KdNode = function(kdPoint,dimension,parent) {
	this.kdPoint = kdPoint;
	this.left = null;
	this.right = null;
	this.parent = parent;
	this.dimension = dimension;
};

verb_core_KdNode.__name__ = ["verb","core","KdNode"];
verb_core_KdNode.prototype = {
	__class__: verb_core_KdNode
};
var verb_eval_IBoundingBoxTree = function() { };

verb_eval_IBoundingBoxTree.__name__ = ["verb","eval","IBoundingBoxTree"];
verb_eval_IBoundingBoxTree.prototype = {
	__class__: verb_eval_IBoundingBoxTree
};
var verb_core_LazyCurveBoundingBoxTree = function(curve,knotTol) {
	this._boundingBox = null;
	this._curve = curve;
	if(knotTol == null) knotTol = verb_core_Vec.domain(this._curve.knots) / 64;
	this._knotTol = knotTol;
};

verb_core_LazyCurveBoundingBoxTree.__name__ = ["verb","core","LazyCurveBoundingBoxTree"];
verb_core_LazyCurveBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
verb_core_LazyCurveBoundingBoxTree.prototype = {
	split: function() {
		var min = verb_core_ArrayExtensions.first(this._curve.knots);
		var max = verb_core_ArrayExtensions.last(this._curve.knots);
		var dom = max - min;
		var crvs = verb_eval_Divide.curveSplit(this._curve,(max + min) / 2.0 + dom * 0.1 * Math.random());
		return new verb_core_Pair(new verb_core_LazyCurveBoundingBoxTree(crvs[0],this._knotTol),new verb_core_LazyCurveBoundingBoxTree(crvs[1],this._knotTol));
	}
	,boundingBox: function() {
		if(this._boundingBox == null) this._boundingBox = new verb_core_BoundingBox(verb_eval_Eval.dehomogenize1d(this._curve.controlPoints));
		return this._boundingBox;
	}
	,'yield': function() {
		return this._curve;
	}
	,indivisible: function(tolerance) {
		return verb_core_Vec.domain(this._curve.knots) < this._knotTol;
	}
	,empty: function() {
		return false;
	}
	,__class__: verb_core_LazyCurveBoundingBoxTree
};
var verb_core_LazyMeshBoundingBoxTree = function(mesh,faceIndices) {
	this._boundingBox = null;
	this._mesh = mesh;
	if(faceIndices == null) {
		var _g = [];
		var _g2 = 0;
		var _g1 = mesh.faces.length;
		while(_g2 < _g1) {
			var i = _g2++;
			_g.push(i);
		}
		faceIndices = _g;
	}
	this._faceIndices = faceIndices;
};

verb_core_LazyMeshBoundingBoxTree.__name__ = ["verb","core","LazyMeshBoundingBoxTree"];
verb_core_LazyMeshBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
verb_core_LazyMeshBoundingBoxTree.prototype = {
	split: function() {
		var $as = verb_core_Mesh.sortTrianglesOnLongestAxis(this.boundingBox(),this._mesh,this._faceIndices);
		var l = verb_core_ArrayExtensions.left($as);
		var r = verb_core_ArrayExtensions.right($as);
		return new verb_core_Pair(new verb_core_LazyMeshBoundingBoxTree(this._mesh,l),new verb_core_LazyMeshBoundingBoxTree(this._mesh,r));
	}
	,boundingBox: function() {
		if(this._boundingBox == null) this._boundingBox = verb_core_Mesh.makeMeshAabb(this._mesh,this._faceIndices);
		return this._boundingBox;
	}
	,'yield': function() {
		return this._faceIndices[0];
	}
	,indivisible: function(tolerance) {
		return this._faceIndices.length == 1;
	}
	,empty: function() {
		return this._faceIndices.length == 0;
	}
	,__class__: verb_core_LazyMeshBoundingBoxTree
};
var verb_core_LazyPolylineBoundingBoxTree = function(polyline,interval) {
	this._boundingBox = null;
	this._polyline = polyline;
	if(interval == null) interval = new verb_core_Interval(0,polyline.points.length != 0?polyline.points.length - 1:0);
	this._interval = interval;
};

verb_core_LazyPolylineBoundingBoxTree.__name__ = ["verb","core","LazyPolylineBoundingBoxTree"];
verb_core_LazyPolylineBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
verb_core_LazyPolylineBoundingBoxTree.prototype = {
	split: function() {
		var min = this._interval.min;
		var max = this._interval.max;
		var pivot = min + Math.ceil((max - min) / 2);
		var l = new verb_core_Interval(min,pivot);
		var r = new verb_core_Interval(pivot,max);
		return new verb_core_Pair(new verb_core_LazyPolylineBoundingBoxTree(this._polyline,l),new verb_core_LazyPolylineBoundingBoxTree(this._polyline,r));
	}
	,boundingBox: function() {
		if(this._boundingBox == null) this._boundingBox = new verb_core_BoundingBox(this._polyline.points);
		return this._boundingBox;
	}
	,'yield': function() {
		return this._interval.min;
	}
	,indivisible: function(tolerance) {
		return this._interval.max - this._interval.min == 1;
	}
	,empty: function() {
		return this._interval.max - this._interval.min == 0;
	}
	,__class__: verb_core_LazyPolylineBoundingBoxTree
};
var verb_core_LazySurfaceBoundingBoxTree = function(surface,splitV,knotTolU,knotTolV) {
	if(splitV == null) splitV = false;
	this._boundingBox = null;
	this._surface = surface;
	this._splitV = splitV;
	if(knotTolU == null) knotTolU = verb_core_Vec.domain(surface.knotsU) / 16;
	if(knotTolV == null) knotTolV = verb_core_Vec.domain(surface.knotsV) / 16;
	this._knotTolU = knotTolU;
	this._knotTolV = knotTolV;
};

verb_core_LazySurfaceBoundingBoxTree.__name__ = ["verb","core","LazySurfaceBoundingBoxTree"];
verb_core_LazySurfaceBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
verb_core_LazySurfaceBoundingBoxTree.prototype = {
	split: function() {
		var min;
		var max;
		if(this._splitV) {
			min = verb_core_ArrayExtensions.first(this._surface.knotsV);
			max = verb_core_ArrayExtensions.last(this._surface.knotsV);
		} else {
			min = verb_core_ArrayExtensions.first(this._surface.knotsU);
			max = verb_core_ArrayExtensions.last(this._surface.knotsU);
		}
		var dom = max - min;
		var pivot = (min + max) / 2.0;
		var srfs = verb_eval_Divide.surfaceSplit(this._surface,pivot,this._splitV);
		return new verb_core_Pair(new verb_core_LazySurfaceBoundingBoxTree(srfs[0],!this._splitV,this._knotTolU,this._knotTolV),new verb_core_LazySurfaceBoundingBoxTree(srfs[1],!this._splitV,this._knotTolU,this._knotTolV));
	}
	,boundingBox: function() {
		if(this._boundingBox == null) {
			this._boundingBox = new verb_core_BoundingBox();
			var _g = 0;
			var _g1 = this._surface.controlPoints;
			while(_g < _g1.length) {
				var row = _g1[_g];
				++_g;
				this._boundingBox.addRange(verb_eval_Eval.dehomogenize1d(row));
			}
		}
		return this._boundingBox;
	}
	,'yield': function() {
		return this._surface;
	}
	,indivisible: function(tolerance) {
		return verb_core_Vec.domain(this._surface.knotsV) < this._knotTolV && verb_core_Vec.domain(this._surface.knotsU) < this._knotTolU;
	}
	,empty: function() {
		return false;
	}
	,__class__: verb_core_LazySurfaceBoundingBoxTree
};
var verb_core_Mat = function() { };

verb_core_Mat.__name__ = ["verb","core","Mat"];
verb_core_Mat.mul = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = b.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(verb_core_Vec.mul(a,b[i]));
	}
	return _g;
};
verb_core_Mat.mult = function(x,y) {
	var p;
	var q;
	var r;
	var ret;
	var foo;
	var bar;
	var woo;
	var i0;
	var k0;
	var p0;
	var r0;
	p = x.length;
	q = y.length;
	r = y[0].length;
	ret = [];
	var i = p - 1;
	var j = 0;
	var k = 0;
	while(i >= 0) {
		foo = [];
		bar = x[i];
		k = r - 1;
		while(k >= 0) {
			woo = bar[q - 1] * y[q - 1][k];
			j = q - 2;
			while(j >= 1) {
				i0 = j - 1;
				woo += bar[j] * y[j][k] + bar[i0] * y[i0][k];
				j -= 2;
			}
			if(j == 0) woo += bar[0] * y[0][k];
			foo[k] = woo;
			k--;
		}
		ret[i] = foo;
		i--;
	}
	return ret;
};
verb_core_Mat.add = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(verb_core_Vec.add(a[i],b[i]));
	}
	return _g;
};
verb_core_Mat.div = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(verb_core_Vec.div(a[i],b));
	}
	return _g;
};
verb_core_Mat.sub = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(verb_core_Vec.sub(a[i],b[i]));
	}
	return _g;
};
verb_core_Mat.dot = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(verb_core_Vec.dot(a[i],b));
	}
	return _g;
};
verb_core_Mat.identity = function(n) {
	var zeros = verb_core_Vec.zeros2d(n,n);
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		zeros[i][i] = 1.0;
	}
	return zeros;
};
verb_core_Mat.transpose = function(a) {
	if(a.length == 0) return [];
	var _g = [];
	var _g2 = 0;
	var _g1 = a[0].length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push((function($this) {
			var $r;
			var _g3 = [];
			{
				var _g5 = 0;
				var _g4 = a.length;
				while(_g5 < _g4) {
					var j = _g5++;
					_g3.push(a[j][i]);
				}
			}
			$r = _g3;
			return $r;
		}(this)));
	}
	return _g;
};
verb_core_Mat.solve = function(A,b) {
	return verb_core_Mat.LUsolve(verb_core_Mat.LU(A),b);
};
verb_core_Mat.LUsolve = function(LUP,b) {
	var i;
	var j;
	var LU = LUP.LU;
	var n = LU.length;
	var x = b.slice();
	var P = LUP.P;
	var Pi;
	var LUi;
	var LUii;
	var tmp;
	i = n - 1;
	while(i != -1) {
		x[i] = b[i];
		--i;
	}
	i = 0;
	while(i < n) {
		Pi = P[i];
		if(P[i] != i) {
			tmp = x[i];
			x[i] = x[Pi];
			x[Pi] = tmp;
		}
		LUi = LU[i];
		j = 0;
		while(j < i) {
			x[i] -= x[j] * LUi[j];
			++j;
		}
		++i;
	}
	i = n - 1;
	while(i >= 0) {
		LUi = LU[i];
		j = i + 1;
		while(j < n) {
			x[i] -= x[j] * LUi[j];
			++j;
		}
		x[i] /= LUi[i];
		--i;
	}
	return x;
};
verb_core_Mat.LU = function(A) {
	var abs = Math.abs;
	var i;
	var j;
	var k;
	var absAjk;
	var Akk;
	var Ak;
	var Pk;
	var Ai;
	var max;
	var _g = [];
	var _g2 = 0;
	var _g1 = A.length;
	while(_g2 < _g1) {
		var i1 = _g2++;
		_g.push(A[i1].slice());
	}
	A = _g;
	var n = A.length;
	var n1 = n - 1;
	var P = [];
	k = 0;
	while(k < n) {
		Pk = k;
		Ak = A[k];
		max = Math.abs(Ak[k]);
		j = k + 1;
		while(j < n) {
			absAjk = Math.abs(A[j][k]);
			if(max < absAjk) {
				max = absAjk;
				Pk = j;
			}
			++j;
		}
		P[k] = Pk;
		if(Pk != k) {
			A[k] = A[Pk];
			A[Pk] = Ak;
			Ak = A[k];
		}
		Akk = Ak[k];
		i = k + 1;
		while(i < n) {
			A[i][k] /= Akk;
			++i;
		}
		i = k + 1;
		while(i < n) {
			Ai = A[i];
			j = k + 1;
			while(j < n1) {
				Ai[j] -= Ai[k] * Ak[j];
				++j;
				Ai[j] -= Ai[k] * Ak[j];
				++j;
			}
			if(j == n1) Ai[j] -= Ai[k] * Ak[j];
			++i;
		}
		++k;
	}
	return new verb_core__$Mat_LUDecomp(A,P);
};
var verb_core__$Mat_LUDecomp = function(lu,p) {
	this.LU = lu;
	this.P = p;
};

verb_core__$Mat_LUDecomp.__name__ = ["verb","core","_Mat","LUDecomp"];
verb_core__$Mat_LUDecomp.prototype = {
	__class__: verb_core__$Mat_LUDecomp
};
var verb_core_Mesh = function() { };

verb_core_Mesh.__name__ = ["verb","core","Mesh"];
verb_core_Mesh.getTriangleNorm = function(points,tri) {
	var v0 = points[tri[0]];
	var v1 = points[tri[1]];
	var v2 = points[tri[2]];
	var u = verb_core_Vec.sub(v1,v0);
	var v = verb_core_Vec.sub(v2,v0);
	var n = verb_core_Vec.cross(u,v);
	return verb_core_Vec.mul(1 / verb_core_Vec.norm(n),n);
};
verb_core_Mesh.makeMeshAabb = function(mesh,faceIndices) {
	var bb = new verb_core_BoundingBox();
	var _g = 0;
	while(_g < faceIndices.length) {
		var x = faceIndices[_g];
		++_g;
		bb.add(mesh.points[mesh.faces[x][0]]);
		bb.add(mesh.points[mesh.faces[x][1]]);
		bb.add(mesh.points[mesh.faces[x][2]]);
	}
	return bb;
};
verb_core_Mesh.sortTrianglesOnLongestAxis = function(bb,mesh,faceIndices) {
	var longAxis = bb.getLongestAxis();
	var minCoordFaceMap = [];
	var _g = 0;
	while(_g < faceIndices.length) {
		var faceIndex = faceIndices[_g];
		++_g;
		var tri_min = verb_core_Mesh.getMinCoordOnAxis(mesh.points,mesh.faces[faceIndex],longAxis);
		minCoordFaceMap.push(new verb_core_Pair(tri_min,faceIndex));
	}
	minCoordFaceMap.sort(function(a,b) {
		var a0 = a.item0;
		var b0 = b.item0;
		if(a0 == b0) return 0; else if(a0 > b0) return 1; else return -1;
	});
	var sortedFaceIndices = [];
	var _g1 = 0;
	var _g2 = minCoordFaceMap.length;
	while(_g1 < _g2) {
		var i = _g1++;
		sortedFaceIndices.push(minCoordFaceMap[i].item1);
	}
	return sortedFaceIndices;
};
verb_core_Mesh.getMinCoordOnAxis = function(points,tri,axis) {
	var min = Infinity;
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		var coord = points[tri[i]][axis];
		if(coord < min) min = coord;
	}
	return min;
};
verb_core_Mesh.getTriangleCentroid = function(points,tri) {
	var centroid = [0.0,0.0,0.0];
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		var _g1 = 0;
		while(_g1 < 3) {
			var j = _g1++;
			centroid[j] += points[tri[i]][j];
		}
	}
	var _g2 = 0;
	while(_g2 < 3) {
		var i1 = _g2++;
		centroid[i1] /= 3;
	}
	return centroid;
};
verb_core_Mesh.triangleUVFromPoint = function(mesh,faceIndex,f) {
	var tri = mesh.faces[faceIndex];
	var p1 = mesh.points[tri[0]];
	var p2 = mesh.points[tri[1]];
	var p3 = mesh.points[tri[2]];
	var uv1 = mesh.uvs[tri[0]];
	var uv2 = mesh.uvs[tri[1]];
	var uv3 = mesh.uvs[tri[2]];
	var f1 = verb_core_Vec.sub(p1,f);
	var f2 = verb_core_Vec.sub(p2,f);
	var f3 = verb_core_Vec.sub(p3,f);
	var a = verb_core_Vec.norm(verb_core_Vec.cross(verb_core_Vec.sub(p1,p2),verb_core_Vec.sub(p1,p3)));
	var a1 = verb_core_Vec.norm(verb_core_Vec.cross(f2,f3)) / a;
	var a2 = verb_core_Vec.norm(verb_core_Vec.cross(f3,f1)) / a;
	var a3 = verb_core_Vec.norm(verb_core_Vec.cross(f1,f2)) / a;
	return verb_core_Vec.add(verb_core_Vec.mul(a1,uv1),verb_core_Vec.add(verb_core_Vec.mul(a2,uv2),verb_core_Vec.mul(a3,uv3)));
};
var verb_core_MeshBoundingBoxTree = function(mesh,faceIndices) {
	this._empty = false;
	this._face = -1;
	if(faceIndices == null) {
		var _g = [];
		var _g2 = 0;
		var _g1 = mesh.faces.length;
		while(_g2 < _g1) {
			var i = _g2++;
			_g.push(i);
		}
		faceIndices = _g;
	}
	this._boundingBox = verb_core_Mesh.makeMeshAabb(mesh,faceIndices);
	if(faceIndices.length < 1) {
		this._empty = true;
		return;
	} else if(faceIndices.length < 2) {
		this._face = faceIndices[0];
		return;
	}
	var $as = verb_core_Mesh.sortTrianglesOnLongestAxis(this._boundingBox,mesh,faceIndices);
	var l = verb_core_ArrayExtensions.left($as);
	var r = verb_core_ArrayExtensions.right($as);
	this._children = new verb_core_Pair(new verb_core_MeshBoundingBoxTree(mesh,l),new verb_core_MeshBoundingBoxTree(mesh,r));
};

verb_core_MeshBoundingBoxTree.__name__ = ["verb","core","MeshBoundingBoxTree"];
verb_core_MeshBoundingBoxTree.__interfaces__ = [verb_eval_IBoundingBoxTree];
verb_core_MeshBoundingBoxTree.prototype = {
	split: function() {
		return this._children;
	}
	,boundingBox: function() {
		return this._boundingBox;
	}
	,'yield': function() {
		return this._face;
	}
	,indivisible: function(tolerance) {
		return this._children == null;
	}
	,empty: function() {
		return this._empty;
	}
	,__class__: verb_core_MeshBoundingBoxTree
};
var verb_core_Minimizer = function() { };

verb_core_Minimizer.__name__ = ["verb","core","Minimizer"];
verb_core_Minimizer.uncmin = function(f,x0,tol,gradient,maxit) {
	if(tol == null) tol = 1e-8;
	if(gradient == null) gradient = function(x) {
		return verb_core_Minimizer.numericalGradient(f,x);
	};
	if(maxit == null) maxit = 1000;
	x0 = x0.slice(0);
	var n = x0.length;
	var f0 = f(x0);
	var f1 = f0;
	var df0;
	if(isNaN(f0)) throw new Error("uncmin: f(x0) is a NaN!");
	tol = Math.max(tol,verb_core_Constants.EPSILON);
	var step;
	var g0;
	var g1;
	var H1 = verb_core_Mat.identity(n);
	var it = 0;
	var i;
	var s = [];
	var x1;
	var y;
	var Hy;
	var Hs;
	var ys;
	var i0;
	var t;
	var nstep;
	var t1;
	var t2;
	var msg = "";
	g0 = gradient(x0);
	while(it < maxit) {
		if(!verb_core_Vec.all(verb_core_Vec.finite(g0))) {
			msg = "Gradient has Infinity or NaN";
			break;
		}
		step = verb_core_Vec.neg(verb_core_Mat.dot(H1,g0));
		if(!verb_core_Vec.all(verb_core_Vec.finite(step))) {
			msg = "Search direction has Infinity or NaN";
			break;
		}
		nstep = verb_core_Vec.norm(step);
		if(nstep < tol) {
			msg = "Newton step smaller than tol";
			break;
		}
		t = 1.0;
		df0 = verb_core_Vec.dot(g0,step);
		x1 = x0;
		while(it < maxit) {
			if(t * nstep < tol) break;
			s = verb_core_Vec.mul(t,step);
			x1 = verb_core_Vec.add(x0,s);
			f1 = f(x1);
			if(f1 - f0 >= 0.1 * t * df0 || isNaN(f1)) {
				t *= 0.5;
				++it;
				continue;
			}
			break;
		}
		if(t * nstep < tol) {
			msg = "Line search step size smaller than tol";
			break;
		}
		if(it == maxit) {
			msg = "maxit reached during line search";
			break;
		}
		g1 = gradient(x1);
		y = verb_core_Vec.sub(g1,g0);
		ys = verb_core_Vec.dot(y,s);
		Hy = verb_core_Mat.dot(H1,y);
		H1 = verb_core_Mat.sub(verb_core_Mat.add(H1,verb_core_Mat.mul((ys + verb_core_Vec.dot(y,Hy)) / (ys * ys),verb_core_Minimizer.tensor(s,s))),verb_core_Mat.div(verb_core_Mat.add(verb_core_Minimizer.tensor(Hy,s),verb_core_Minimizer.tensor(s,Hy)),ys));
		x0 = x1;
		f0 = f1;
		g0 = g1;
		++it;
	}
	return new verb_core_MinimizationResult(x0,f0,g0,H1,it,msg);
};
verb_core_Minimizer.numericalGradient = function(f,x) {
	var n = x.length;
	var f0 = f(x);
	if(f0 == NaN) throw new Error("gradient: f(x) is a NaN!");
	var i;
	var x0 = x.slice(0);
	var f1;
	var f2;
	var J = [];
	var errest;
	var roundoff;
	var eps = 1e-3;
	var t0;
	var t1;
	var t2;
	var it = 0;
	var d1;
	var d2;
	var N;
	var _g = 0;
	while(_g < n) {
		var i1 = _g++;
		var h = Math.max(1e-6 * f0,1e-8);
		while(true) {
			++it;
			if(it > 20) throw new Error("Numerical gradient fails");
			x0[i1] = x[i1] + h;
			f1 = f(x0);
			x0[i1] = x[i1] - h;
			f2 = f(x0);
			x0[i1] = x[i1];
			if(isNaN(f1) || isNaN(f2)) {
				h /= 16;
				continue;
			}
			J[i1] = (f1 - f2) / (2 * h);
			t0 = x[i1] - h;
			t1 = x[i1];
			t2 = x[i1] + h;
			d1 = (f1 - f0) / h;
			d2 = (f0 - f2) / h;
			N = verb_core_Vec.max([Math.abs(J[i1]),Math.abs(f0),Math.abs(f1),Math.abs(f2),Math.abs(t0),Math.abs(t1),Math.abs(t2),1e-8]);
			errest = Math.min(verb_core_Vec.max([Math.abs(d1 - J[i1]),Math.abs(d2 - J[i1]),Math.abs(d1 - d2)]) / N,h / N);
			if(errest > eps) h /= 16; else break;
		}
	}
	return J;
};
verb_core_Minimizer.tensor = function(x,y) {
	var m = x.length;
	var n = y.length;
	var A = [];
	var Ai;
	var xi;
	var i = m - 1;
	while(i >= 0) {
		Ai = [];
		xi = x[i];
		var j = n - 1;
		while(j >= 3) {
			Ai[j] = xi * y[j];
			--j;
			Ai[j] = xi * y[j];
			--j;
			Ai[j] = xi * y[j];
			--j;
			Ai[j] = xi * y[j];
			--j;
		}
		while(j >= 0) {
			Ai[j] = xi * y[j];
			--j;
		}
		A[i] = Ai;
		i--;
	}
	return A;
};
var verb_core_MinimizationResult = function(solution,value,gradient,invHessian,iterations,message) {
	this.solution = solution;
	this.value = value;
	this.gradient = gradient;
	this.invHessian = invHessian;
	this.iterations = iterations;
	this.message = message;
};

verb_core_MinimizationResult.__name__ = ["verb","core","MinimizationResult"];
verb_core_MinimizationResult.prototype = {
	__class__: verb_core_MinimizationResult
};
var verb_core_ISerializable = function() { };

verb_core_ISerializable.__name__ = ["verb","core","ISerializable"];
verb_core_ISerializable.prototype = {
	__class__: verb_core_ISerializable
};
var verb_core_Deserializer = function() { };

verb_core_Deserializer.__name__ = ["verb","core","Deserializer"];
verb_core_Deserializer.deserialize = function(s) {
	var unserializer = new haxe_Unserializer(s);
	var r = unserializer.unserialize();
	return r;
};
var verb_core_Trig = function() { };

verb_core_Trig.__name__ = ["verb","core","Trig"];
verb_core_Trig.isPointInPlane = function(pt,p,tol) {
	return Math.abs(verb_core_Vec.dot(verb_core_Vec.sub(pt,p.origin),p.normal)) < tol;
};
verb_core_Trig.distToSegment = function(a,b,c) {
	var res = verb_core_Trig.segmentClosestPoint(b,a,c,0.0,1.0);
	return verb_core_Vec.dist(b,res.pt);
};
verb_core_Trig.rayClosestPoint = function(pt,o,r) {
	var o2pt = verb_core_Vec.sub(pt,o);
	var do2ptr = verb_core_Vec.dot(o2pt,r);
	var proj = verb_core_Vec.add(o,verb_core_Vec.mul(do2ptr,r));
	return proj;
};
verb_core_Trig.distToRay = function(pt,o,r) {
	var d = verb_core_Trig.rayClosestPoint(pt,o,r);
	var dif = verb_core_Vec.sub(d,pt);
	return verb_core_Vec.norm(dif);
};
verb_core_Trig.threePointsAreFlat = function(p1,p2,p3,tol) {
	var p2mp1 = verb_core_Vec.sub(p2,p1);
	var p3mp1 = verb_core_Vec.sub(p3,p1);
	var norm = verb_core_Vec.cross(p2mp1,p3mp1);
	var area = verb_core_Vec.dot(norm,norm);
	return area < tol;
};
verb_core_Trig.segmentClosestPoint = function(pt,segpt0,segpt1,u0,u1) {
	var dif = verb_core_Vec.sub(segpt1,segpt0);
	var l = verb_core_Vec.norm(dif);
	if(l < verb_core_Constants.EPSILON) return { u : u0, pt : segpt0};
	var o = segpt0;
	var r = verb_core_Vec.mul(1 / l,dif);
	var o2pt = verb_core_Vec.sub(pt,o);
	var do2ptr = verb_core_Vec.dot(o2pt,r);
	if(do2ptr < 0) return { u : u0, pt : segpt0}; else if(do2ptr > l) return { u : u1, pt : segpt1};
	return { u : u0 + (u1 - u0) * do2ptr / l, pt : verb_core_Vec.add(o,verb_core_Vec.mul(do2ptr,r))};
};
var verb_core_Vec = function() { };

verb_core_Vec.__name__ = ["verb","core","Vec"];
verb_core_Vec.angleBetween = function(a,b) {
	return Math.acos(verb_core_Vec.dot(a,b) / (verb_core_Vec.norm(a) * verb_core_Vec.norm(b)));
};
verb_core_Vec.positiveAngleBetween = function(a,b,n) {
	var nab = verb_core_Vec.cross(a,b);
	var al = verb_core_Vec.norm(a);
	var bl = verb_core_Vec.norm(b);
	var abl = al * bl;
	var adb = verb_core_Vec.dot(a,b);
	var sina = verb_core_Vec.norm(nab) / abl;
	var cosa = adb / abl;
	var w = Math.atan2(sina,cosa);
	var s = verb_core_Vec.dot(n,nab);
	if(Math.abs(s) < verb_core_Constants.EPSILON) return w;
	if(s > 0) return w; else return -w;
};
verb_core_Vec.signedAngleBetween = function(a,b,n) {
	var nab = verb_core_Vec.cross(a,b);
	var al = verb_core_Vec.norm(a);
	var bl = verb_core_Vec.norm(b);
	var abl = al * bl;
	var adb = verb_core_Vec.dot(a,b);
	var sina = verb_core_Vec.norm(nab) / abl;
	var cosa = adb / abl;
	var w = Math.atan2(sina,cosa);
	var s = verb_core_Vec.dot(n,nab);
	if(s > 0.0) return w; else return 2 * Math.PI - w;
};
verb_core_Vec.angleBetweenNormalized2d = function(a,b) {
	var perpDot = a[0] * b[1] - a[1] * b[0];
	return Math.atan2(perpDot,verb_core_Vec.dot(a,b));
};
verb_core_Vec.domain = function(a) {
	return verb_core_ArrayExtensions.last(a) - verb_core_ArrayExtensions.first(a);
};
verb_core_Vec.range = function(max) {
	var l = [];
	var f = 0.0;
	var _g = 0;
	while(_g < max) {
		var i = _g++;
		l.push(f);
		f += 1.0;
	}
	return l;
};
verb_core_Vec.span = function(min,max,step) {
	if(step == null) return [];
	if(step < verb_core_Constants.EPSILON) return [];
	if(min > max && step > 0.0) return [];
	if(max > min && step < 0.0) return [];
	var l = [];
	var cur = min;
	while(cur <= max) {
		l.push(cur);
		cur += step;
	}
	return l;
};
verb_core_Vec.neg = function(arr) {
	return arr.map(function(x) {
		return -x;
	});
};
verb_core_Vec.min = function(arr) {
	return Lambda.fold(arr,function(x,a) {
		return Math.min(x,a);
	},Infinity);
};
verb_core_Vec.max = function(arr) {
	return Lambda.fold(arr,function(x,a) {
		return Math.max(x,a);
	},-Infinity);
};
verb_core_Vec.all = function(arr) {
	return Lambda.fold(arr,function(x,a) {
		return a && x;
	},true);
};
verb_core_Vec.finite = function(arr) {
	return arr.map(function(x) {
		return isFinite(x);
	});
};
verb_core_Vec.onRay = function(origin,dir,u) {
	return verb_core_Vec.add(origin,verb_core_Vec.mul(u,dir));
};
verb_core_Vec.lerp = function(i,u,v) {
	return verb_core_Vec.add(verb_core_Vec.mul(i,u),verb_core_Vec.mul(1.0 - i,v));
};
verb_core_Vec.normalized = function(arr) {
	return verb_core_Vec.div(arr,verb_core_Vec.norm(arr));
};
verb_core_Vec.cross = function(u,v) {
	return [u[1] * v[2] - u[2] * v[1],u[2] * v[0] - u[0] * v[2],u[0] * v[1] - u[1] * v[0]];
};
verb_core_Vec.dist = function(a,b) {
	return verb_core_Vec.norm(verb_core_Vec.sub(a,b));
};
verb_core_Vec.distSquared = function(a,b) {
	return verb_core_Vec.normSquared(verb_core_Vec.sub(a,b));
};
verb_core_Vec.sum = function(a) {
	return Lambda.fold(a,function(x,a1) {
		return a1 + x;
	},0);
};
verb_core_Vec.addAll = function(a) {
	var i = $iterator(a)();
	if(!i.hasNext()) return null;
	var f = i.next().length;
	return Lambda.fold(a,function(x,a1) {
		return verb_core_Vec.add(a1,x);
	},verb_core_Vec.rep(f,0.0));
};
verb_core_Vec.addAllMutate = function(a) {
	var f = a[0];
	var _g1 = 1;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		verb_core_Vec.addMutate(f,a[i]);
	}
};
verb_core_Vec.addMulMutate = function(a,s,b) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = a[i] + s * b[i];
	}
};
verb_core_Vec.subMulMutate = function(a,s,b) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = a[i] - s * b[i];
	}
};
verb_core_Vec.addMutate = function(a,b) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = a[i] + b[i];
	}
};
verb_core_Vec.subMutate = function(a,b) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = a[i] - b[i];
	}
};
verb_core_Vec.mulMutate = function(a,b) {
	var _g1 = 0;
	var _g = b.length;
	while(_g1 < _g) {
		var i = _g1++;
		b[i] = b[i] * a;
	}
};
verb_core_Vec.norm = function(a) {
	var norm2 = verb_core_Vec.normSquared(a);
	if(norm2 != 0.0) return Math.sqrt(norm2); else return norm2;
};
verb_core_Vec.normSquared = function(a) {
	return Lambda.fold(a,function(x,a1) {
		return a1 + x * x;
	},0);
};
verb_core_Vec.rep = function(num,ele) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < num) {
		var i = _g1++;
		_g.push(ele);
	}
	return _g;
};
verb_core_Vec.zeros1d = function(rows) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < rows) {
		var i = _g1++;
		_g.push(0.0);
	}
	return _g;
};
verb_core_Vec.zeros2d = function(rows,cols) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < rows) {
		var i = _g1++;
		_g.push(verb_core_Vec.zeros1d(cols));
	}
	return _g;
};
verb_core_Vec.zeros3d = function(rows,cols,depth) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < rows) {
		var i = _g1++;
		_g.push(verb_core_Vec.zeros2d(cols,depth));
	}
	return _g;
};
verb_core_Vec.dot = function(a,b) {
	var sum = 0;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		sum += a[i] * b[i];
	}
	return sum;
};
verb_core_Vec.add = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(a[i] + b[i]);
	}
	return _g;
};
verb_core_Vec.mul = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = b.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(a * b[i]);
	}
	return _g;
};
verb_core_Vec.div = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(a[i] / b);
	}
	return _g;
};
verb_core_Vec.sub = function(a,b) {
	var _g = [];
	var _g2 = 0;
	var _g1 = a.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(a[i] - b[i]);
	}
	return _g;
};
verb_core_Vec.isZero = function(vec) {
	var _g1 = 0;
	var _g = vec.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(Math.abs(vec[i]) > verb_core_Constants.TOLERANCE) return false;
	}
	return true;
};
verb_core_Vec.sortedSetUnion = function(a,b) {
	var merged = [];
	var ai = 0;
	var bi = 0;
	while(ai < a.length || bi < b.length) {
		if(ai >= a.length) {
			merged.push(b[bi]);
			bi++;
			continue;
		} else if(bi >= b.length) {
			merged.push(a[ai]);
			ai++;
			continue;
		}
		var diff = a[ai] - b[bi];
		if(Math.abs(diff) < verb_core_Constants.EPSILON) {
			merged.push(a[ai]);
			ai++;
			bi++;
			continue;
		}
		if(diff > 0.0) {
			merged.push(b[bi]);
			bi++;
			continue;
		}
		merged.push(a[ai]);
		ai++;
	}
	return merged;
};
verb_core_Vec.sortedSetSub = function(a,b) {
	var result = [];
	var ai = 0;
	var bi = 0;
	while(ai < a.length) {
		if(bi >= b.length) {
			result.push(a[ai]);
			ai++;
			continue;
		}
		if(Math.abs(a[ai] - b[bi]) < verb_core_Constants.EPSILON) {
			ai++;
			bi++;
			continue;
		}
		result.push(a[ai]);
		ai++;
	}
	return result;
};
var verb_eval_Analyze = function() { };

verb_eval_Analyze.__name__ = ["verb","eval","Analyze"];
verb_eval_Analyze.knotMultiplicities = function(knots) {
	var mults = [new verb_eval_KnotMultiplicity(knots[0],0)];
	var curr = mults[0];
	var _g = 0;
	while(_g < knots.length) {
		var knot = knots[_g];
		++_g;
		if(Math.abs(knot - curr.knot) > verb_core_Constants.EPSILON) {
			curr = new verb_eval_KnotMultiplicity(knot,0);
			mults.push(curr);
		}
		curr.inc();
	}
	return mults;
};
verb_eval_Analyze.isRationalSurfaceClosed = function(surface,uDir) {
	if(uDir == null) uDir = true;
	var cpts;
	if(uDir) cpts = surface.controlPoints; else cpts = verb_core_Mat.transpose(surface.controlPoints);
	var _g1 = 0;
	var _g = cpts[0].length;
	while(_g1 < _g) {
		var i = _g1++;
		var test = verb_core_Vec.dist(verb_core_ArrayExtensions.first(cpts)[i],verb_core_ArrayExtensions.last(cpts)[i]) < verb_core_Constants.EPSILON;
		if(!test) return false;
	}
	return true;
};
verb_eval_Analyze.rationalSurfaceClosestPoint = function(surface,p) {
	var uv = verb_eval_Analyze.rationalSurfaceClosestParam(surface,p);
	return verb_eval_Eval.rationalSurfacePoint(surface,uv[0],uv[1]);
};
verb_eval_Analyze.rationalSurfaceClosestParam = function(surface,p) {
	var maxits = 5;
	var i = 0;
	var e;
	var eps1 = 0.0001;
	var eps2 = 0.0005;
	var dif;
	var minu = surface.knotsU[0];
	var maxu = verb_core_ArrayExtensions.last(surface.knotsU);
	var minv = surface.knotsV[0];
	var maxv = verb_core_ArrayExtensions.last(surface.knotsV);
	var closedu = verb_eval_Analyze.isRationalSurfaceClosed(surface);
	var closedv = verb_eval_Analyze.isRationalSurfaceClosed(surface,false);
	var cuv;
	var tess = verb_eval_Tess.rationalSurfaceAdaptive(surface,new verb_eval_AdaptiveRefinementOptions());
	var dmin = Infinity;
	var _g1 = 0;
	var _g = tess.points.length;
	while(_g1 < _g) {
		var i1 = _g1++;
		var x = tess.points[i1];
		var d1 = verb_core_Vec.normSquared(verb_core_Vec.sub(p,x));
		if(d1 < dmin) {
			dmin = d1;
			cuv = tess.uvs[i1];
		}
	}
	var f = function(uv) {
		return verb_eval_Eval.rationalSurfaceDerivatives(surface,uv[0],uv[1],2);
	};
	var n = function(uv1,e1,r) {
		var Su = e1[1][0];
		var Sv = e1[0][1];
		var Suu = e1[2][0];
		var Svv = e1[0][2];
		var Suv = e1[1][1];
		var Svu = e1[1][1];
		var f1 = verb_core_Vec.dot(Su,r);
		var g = verb_core_Vec.dot(Sv,r);
		var k = [-f1,-g];
		var J00 = verb_core_Vec.dot(Su,Su) + verb_core_Vec.dot(Suu,r);
		var J01 = verb_core_Vec.dot(Su,Sv) + verb_core_Vec.dot(Suv,r);
		var J10 = verb_core_Vec.dot(Su,Sv) + verb_core_Vec.dot(Svu,r);
		var J11 = verb_core_Vec.dot(Sv,Sv) + verb_core_Vec.dot(Svv,r);
		var J = [[J00,J01],[J10,J11]];
		var d = verb_core_Mat.solve(J,k);
		return verb_core_Vec.add(d,uv1);
	};
	while(i < maxits) {
		e = f(cuv);
		dif = verb_core_Vec.sub(e[0][0],p);
		var c1v = verb_core_Vec.norm(dif);
		var c2an = verb_core_Vec.dot(e[1][0],dif);
		var c2ad = verb_core_Vec.norm(e[1][0]) * c1v;
		var c2bn = verb_core_Vec.dot(e[0][1],dif);
		var c2bd = verb_core_Vec.norm(e[0][1]) * c1v;
		var c2av = c2an / c2ad;
		var c2bv = c2bn / c2bd;
		var c1 = c1v < eps1;
		var c2a = c2av < eps2;
		var c2b = c2bv < eps2;
		if(c1 && c2a && c2b) return cuv;
		var ct = n(cuv,e,dif);
		if(ct[0] < minu) if(closedu) ct = [maxu - (ct[0] - minu),ct[1]]; else ct = [minu + verb_core_Constants.EPSILON,ct[1]]; else if(ct[0] > maxu) if(closedu) ct = [minu + (ct[0] - maxu),ct[1]]; else ct = [maxu - verb_core_Constants.EPSILON,ct[1]];
		if(ct[1] < minv) if(closedv) ct = [ct[0],maxv - (ct[1] - minv)]; else ct = [ct[0],minv + verb_core_Constants.EPSILON]; else if(ct[1] > maxv) if(closedv) ct = [ct[0],minv + (ct[0] - maxv)]; else ct = [ct[0],maxv - verb_core_Constants.EPSILON];
		var c3v0 = verb_core_Vec.norm(verb_core_Vec.mul(ct[0] - cuv[0],e[1][0]));
		var c3v1 = verb_core_Vec.norm(verb_core_Vec.mul(ct[1] - cuv[1],e[0][1]));
		if(c3v0 + c3v1 < eps1) return cuv;
		cuv = ct;
		i++;
	}
	return cuv;
};
verb_eval_Analyze.rationalCurveClosestPoint = function(curve,p) {
	return verb_eval_Eval.rationalCurvePoint(curve,verb_eval_Analyze.rationalCurveClosestParam(curve,p));
};
verb_eval_Analyze.rationalCurveClosestParam = function(curve,p) {
	var min = Infinity;
	var u = 0.0;
	var pts = verb_eval_Tess.rationalCurveRegularSample(curve,curve.controlPoints.length * curve.degree,true);
	var _g1 = 0;
	var _g = pts.length - 1;
	while(_g1 < _g) {
		var i1 = _g1++;
		var u0 = pts[i1][0];
		var u11 = pts[i1 + 1][0];
		var p0 = pts[i1].slice(1);
		var p1 = pts[i1 + 1].slice(1);
		var proj = verb_core_Trig.segmentClosestPoint(p,p0,p1,u0,u11);
		var d1 = verb_core_Vec.norm(verb_core_Vec.sub(p,proj.pt));
		if(d1 < min) {
			min = d1;
			u = proj.u;
		}
	}
	var maxits = 5;
	var i = 0;
	var e;
	var eps1 = 0.0001;
	var eps2 = 0.0005;
	var dif;
	var minu = curve.knots[0];
	var maxu = verb_core_ArrayExtensions.last(curve.knots);
	var closed = verb_core_Vec.normSquared(verb_core_Vec.sub(curve.controlPoints[0],verb_core_ArrayExtensions.last(curve.controlPoints))) < verb_core_Constants.EPSILON;
	var cu = u;
	var f = function(u1) {
		return verb_eval_Eval.rationalCurveDerivatives(curve,u1,2);
	};
	var n = function(u2,e1,d) {
		var f1 = verb_core_Vec.dot(e1[1],d);
		var s0 = verb_core_Vec.dot(e1[2],d);
		var s1 = verb_core_Vec.dot(e1[1],e1[1]);
		var df = s0 + s1;
		return u2 - f1 / df;
	};
	while(i < maxits) {
		e = f(cu);
		dif = verb_core_Vec.sub(e[0],p);
		var c1v = verb_core_Vec.norm(dif);
		var c2n = verb_core_Vec.dot(e[1],dif);
		var c2d = verb_core_Vec.norm(e[1]) * c1v;
		var c2v = c2n / c2d;
		var c1 = c1v < eps1;
		var c2 = Math.abs(c2v) < eps2;
		if(c1 && c2) return cu;
		var ct = n(cu,e,dif);
		if(ct < minu) if(closed) ct = maxu - (ct - minu); else ct = minu; else if(ct > maxu) if(closed) ct = minu + (ct - maxu); else ct = maxu;
		var c3v = verb_core_Vec.norm(verb_core_Vec.mul(ct - cu,e[1]));
		if(c3v < eps1) return cu;
		cu = ct;
		i++;
	}
	return cu;
};
verb_eval_Analyze.rationalCurveParamAtArcLength = function(curve,len,tol,beziers,bezierLengths) {
	if(tol == null) tol = 1e-3;
	if(len < verb_core_Constants.EPSILON) return curve.knots[0];
	var crvs;
	if(beziers != null) crvs = beziers; else crvs = verb_eval_Modify.decomposeCurveIntoBeziers(curve);
	var i = 0;
	var cc = crvs[i];
	var cl = -verb_core_Constants.EPSILON;
	var bezier_lengths;
	if(bezierLengths != null) bezier_lengths = bezierLengths; else bezier_lengths = [];
	while(cl < len && i < crvs.length) {
		if(i < bezier_lengths.length) bezier_lengths[i] = bezier_lengths[i]; else bezier_lengths[i] = verb_eval_Analyze.rationalBezierCurveArcLength(curve);
		cl += bezier_lengths[i];
		if(len < cl + verb_core_Constants.EPSILON) return verb_eval_Analyze.rationalBezierCurveParamAtArcLength(curve,len,tol,bezier_lengths[i]);
		i++;
	}
	return -1;
};
verb_eval_Analyze.rationalBezierCurveParamAtArcLength = function(curve,len,tol,totalLength) {
	if(len < 0) return curve.knots[0];
	var totalLen;
	if(totalLength != null) totalLen = totalLength; else totalLen = verb_eval_Analyze.rationalBezierCurveArcLength(curve);
	if(len > totalLen) return verb_core_ArrayExtensions.last(curve.knots);
	var start_p = curve.knots[0];
	var start_l = 0.0;
	var end_p = verb_core_ArrayExtensions.last(curve.knots);
	var end_l = totalLen;
	var mid_p = 0.0;
	var mid_l = 0.0;
	var tol1;
	if(tol != null) tol1 = tol; else tol1 = verb_core_Constants.TOLERANCE * 2;
	while(end_l - start_l > tol1) {
		mid_p = (start_p + end_p) / 2;
		mid_l = verb_eval_Analyze.rationalBezierCurveArcLength(curve,mid_p);
		if(mid_l > len) {
			end_p = mid_p;
			end_l = mid_l;
		} else {
			start_p = mid_p;
			start_l = mid_l;
		}
	}
	return (start_p + end_p) / 2;
};
verb_eval_Analyze.rationalCurveArcLength = function(curve,u,gaussDegIncrease) {
	if(gaussDegIncrease == null) gaussDegIncrease = 16;
	if(u == null) u = verb_core_ArrayExtensions.last(curve.knots); else u = u;
	var crvs = verb_eval_Modify.decomposeCurveIntoBeziers(curve);
	var i = 0;
	var cc = crvs[0];
	var sum = 0.0;
	while(i < crvs.length && cc.knots[0] + verb_core_Constants.EPSILON < u) {
		var param = Math.min(verb_core_ArrayExtensions.last(cc.knots),u);
		sum += verb_eval_Analyze.rationalBezierCurveArcLength(cc,param,gaussDegIncrease);
		cc = crvs[++i];
	}
	return sum;
};
verb_eval_Analyze.rationalBezierCurveArcLength = function(curve,u,gaussDegIncrease) {
	if(gaussDegIncrease == null) gaussDegIncrease = 16;
	var u1;
	if(u == null) u1 = verb_core_ArrayExtensions.last(curve.knots); else u1 = u;
	var z = (u1 - curve.knots[0]) / 2;
	var sum = 0.0;
	var gaussDeg = curve.degree + gaussDegIncrease;
	var cu;
	var tan;
	var _g = 0;
	while(_g < gaussDeg) {
		var i = _g++;
		cu = z * verb_eval_Analyze.Tvalues[gaussDeg][i] + z + curve.knots[0];
		tan = verb_eval_Eval.rationalCurveDerivatives(curve,cu,1);
		sum += verb_eval_Analyze.Cvalues[gaussDeg][i] * verb_core_Vec.norm(tan[1]);
	}
	return z * sum;
};
var verb_eval_KnotMultiplicity = function(knot,mult) {
	this.knot = knot;
	this.mult = mult;
};

verb_eval_KnotMultiplicity.__name__ = ["verb","eval","KnotMultiplicity"];
verb_eval_KnotMultiplicity.prototype = {
	inc: function() {
		this.mult++;
	}
	,__class__: verb_eval_KnotMultiplicity
};
var verb_eval_Check = function() { };

verb_eval_Check.__name__ = ["verb","eval","Check"];
verb_eval_Check.isValidKnotVector = function(vec,degree) {
	if(vec.length == 0) return false;
	if(vec.length < (degree + 1) * 2) return false;
	var rep = verb_core_ArrayExtensions.first(vec);
	var _g1 = 0;
	var _g = degree + 1;
	while(_g1 < _g) {
		var i = _g1++;
		if(Math.abs(vec[i] - rep) > verb_core_Constants.EPSILON) return false;
	}
	rep = verb_core_ArrayExtensions.last(vec);
	var _g11 = vec.length - degree - 1;
	var _g2 = vec.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		if(Math.abs(vec[i1] - rep) > verb_core_Constants.EPSILON) return false;
	}
	return verb_eval_Check.isNonDecreasing(vec);
};
verb_eval_Check.isNonDecreasing = function(vec) {
	var rep = verb_core_ArrayExtensions.first(vec);
	var _g1 = 0;
	var _g = vec.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(vec[i] < rep - verb_core_Constants.EPSILON) return false;
		rep = vec[i];
	}
	return true;
};
verb_eval_Check.isValidNurbsCurveData = function(data) {
	if(data.controlPoints == null) throw new Error("Control points array cannot be null!");
	if(data.degree == null) throw new Error("Degree cannot be null!");
	if(data.degree < 1) throw new Error("Degree must be greater than 1!");
	if(data.knots == null) throw new Error("Knots cannot be null!");
	if(data.knots.length != data.controlPoints.length + data.degree + 1) throw new Error("controlPoints.length + degree + 1 must equal knots.length!");
	if(!verb_eval_Check.isValidKnotVector(data.knots,data.degree)) throw new Error("Invalid knot vector format!  Should begin with degree + 1 repeats and end with degree + 1 repeats!");
	return data;
};
verb_eval_Check.isValidNurbsSurfaceData = function(data) {
	if(data.controlPoints == null) throw new Error("Control points array cannot be null!");
	if(data.degreeU == null) throw new Error("DegreeU cannot be null!");
	if(data.degreeV == null) throw new Error("DegreeV cannot be null!");
	if(data.degreeU < 1) throw new Error("DegreeU must be greater than 1!");
	if(data.degreeV < 1) throw new Error("DegreeV must be greater than 1!");
	if(data.knotsU == null) throw new Error("KnotsU cannot be null!");
	if(data.knotsV == null) throw new Error("KnotsV cannot be null!");
	if(data.knotsU.length != data.controlPoints.length + data.degreeU + 1) throw new Error("controlPointsU.length + degreeU + 1 must equal knotsU.length!");
	if(data.knotsV.length != data.controlPoints[0].length + data.degreeV + 1) throw new Error("controlPointsV.length + degreeV + 1 must equal knotsV.length!");
	if(!verb_eval_Check.isValidKnotVector(data.knotsU,data.degreeU) || !verb_eval_Check.isValidKnotVector(data.knotsV,data.degreeV)) throw new Error("Invalid knot vector format!  Should begin with degree + 1 repeats and end with degree + 1 repeats!");
	return data;
};
var verb_eval_Divide = function() { };

verb_eval_Divide.__name__ = ["verb","eval","Divide"];
verb_eval_Divide.surfaceSplit = function(surface,u,useV) {
	if(useV == null) useV = false;
	var knots;
	var degree;
	var controlPoints;
	if(!useV) {
		controlPoints = verb_core_Mat.transpose(surface.controlPoints);
		knots = surface.knotsU;
		degree = surface.degreeU;
	} else {
		controlPoints = surface.controlPoints;
		knots = surface.knotsV;
		degree = surface.degreeV;
	}
	var knots_to_insert;
	var _g = [];
	var _g2 = 0;
	var _g1 = degree + 1;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(u);
	}
	knots_to_insert = _g;
	var newpts0 = [];
	var newpts1 = [];
	var s = verb_eval_Eval.knotSpan(degree,u,knots);
	var res = null;
	var _g11 = 0;
	while(_g11 < controlPoints.length) {
		var cps = controlPoints[_g11];
		++_g11;
		res = verb_eval_Modify.curveKnotRefine(new verb_core_NurbsCurveData(degree,knots,cps),knots_to_insert);
		newpts0.push(res.controlPoints.slice(0,s + 1));
		newpts1.push(res.controlPoints.slice(s + 1));
	}
	var knots0 = res.knots.slice(0,s + degree + 2);
	var knots1 = res.knots.slice(s + 1);
	if(!useV) {
		newpts0 = verb_core_Mat.transpose(newpts0);
		newpts1 = verb_core_Mat.transpose(newpts1);
		return [new verb_core_NurbsSurfaceData(degree,surface.degreeV,knots0,surface.knotsV.slice(),newpts0),new verb_core_NurbsSurfaceData(degree,surface.degreeV,knots1,surface.knotsV.slice(),newpts1)];
	}
	return [new verb_core_NurbsSurfaceData(surface.degreeU,degree,surface.knotsU.slice(),knots0,newpts0),new verb_core_NurbsSurfaceData(surface.degreeU,degree,surface.knotsU.slice(),knots1,newpts1)];
};
verb_eval_Divide.curveSplit = function(curve,u) {
	var degree = curve.degree;
	var controlPoints = curve.controlPoints;
	var knots = curve.knots;
	var knots_to_insert;
	var _g = [];
	var _g2 = 0;
	var _g1 = degree + 1;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(u);
	}
	knots_to_insert = _g;
	var res = verb_eval_Modify.curveKnotRefine(curve,knots_to_insert);
	var s = verb_eval_Eval.knotSpan(degree,u,knots);
	var knots0 = res.knots.slice(0,s + degree + 2);
	var knots1 = res.knots.slice(s + 1);
	var cpts0 = res.controlPoints.slice(0,s + 1);
	var cpts1 = res.controlPoints.slice(s + 1);
	return [new verb_core_NurbsCurveData(degree,knots0,cpts0),new verb_core_NurbsCurveData(degree,knots1,cpts1)];
};
verb_eval_Divide.rationalCurveByEqualArcLength = function(curve,num) {
	var tlen = verb_eval_Analyze.rationalCurveArcLength(curve);
	var inc = tlen / num;
	return verb_eval_Divide.rationalCurveByArcLength(curve,inc);
};
verb_eval_Divide.rationalCurveByArcLength = function(curve,l) {
	var crvs = verb_eval_Modify.decomposeCurveIntoBeziers(curve);
	var crvlens = crvs.map(function(x) {
		return verb_eval_Analyze.rationalBezierCurveArcLength(x);
	});
	var totlen = verb_core_Vec.sum(crvlens);
	var pts = [new verb_eval_CurveLengthSample(curve.knots[0],0.0)];
	if(l > totlen) return pts;
	var inc = l;
	var i = 0;
	var lc = inc;
	var runsum = 0.0;
	var runsum1 = 0.0;
	var u;
	while(i < crvs.length) {
		runsum += crvlens[i];
		while(lc < runsum + verb_core_Constants.EPSILON) {
			u = verb_eval_Analyze.rationalBezierCurveParamAtArcLength(crvs[i],lc - runsum1,verb_core_Constants.TOLERANCE,crvlens[i]);
			pts.push(new verb_eval_CurveLengthSample(u,lc));
			lc += inc;
		}
		runsum1 += crvlens[i];
		i++;
	}
	return pts;
};
var verb_eval_CurveLengthSample = function(u,len) {
	this.u = u;
	this.len = len;
};

verb_eval_CurveLengthSample.__name__ = ["verb","eval","CurveLengthSample"];
verb_eval_CurveLengthSample.prototype = {
	__class__: verb_eval_CurveLengthSample
};
var verb_eval_Eval = function() { };

verb_eval_Eval.__name__ = ["verb","eval","Eval"];
verb_eval_Eval.rationalCurveTangent = function(curve,u) {
	var derivs = verb_eval_Eval.rationalCurveDerivatives(curve,u,1);
	return derivs[1];
};
verb_eval_Eval.rationalSurfaceNormal = function(surface,u,v) {
	var derivs = verb_eval_Eval.rationalSurfaceDerivatives(surface,u,v,1);
	return verb_core_Vec.cross(derivs[1][0],derivs[0][1]);
};
verb_eval_Eval.rationalSurfaceDerivatives = function(surface,u,v,numDerivs) {
	if(numDerivs == null) numDerivs = 1;
	var ders = verb_eval_Eval.surfaceDerivatives(surface,u,v,numDerivs);
	var Aders = verb_eval_Eval.rational2d(ders);
	var wders = verb_eval_Eval.weight2d(ders);
	var SKL = [];
	var dim = Aders[0][0].length;
	var _g1 = 0;
	var _g = numDerivs + 1;
	while(_g1 < _g) {
		var k = _g1++;
		SKL.push([]);
		var _g3 = 0;
		var _g2 = numDerivs - k + 1;
		while(_g3 < _g2) {
			var l = _g3++;
			var v1 = Aders[k][l];
			var _g5 = 1;
			var _g4 = l + 1;
			while(_g5 < _g4) {
				var j = _g5++;
				verb_core_Vec.subMulMutate(v1,verb_core_Binomial.get(l,j) * wders[0][j],SKL[k][l - j]);
			}
			var _g51 = 1;
			var _g41 = k + 1;
			while(_g51 < _g41) {
				var i = _g51++;
				verb_core_Vec.subMulMutate(v1,verb_core_Binomial.get(k,i) * wders[i][0],SKL[k - i][l]);
				var v2 = verb_core_Vec.zeros1d(dim);
				var _g7 = 1;
				var _g6 = l + 1;
				while(_g7 < _g6) {
					var j1 = _g7++;
					verb_core_Vec.addMulMutate(v2,verb_core_Binomial.get(l,j1) * wders[i][j1],SKL[k - i][l - j1]);
				}
				verb_core_Vec.subMulMutate(v1,verb_core_Binomial.get(k,i),v2);
			}
			verb_core_Vec.mulMutate(1 / wders[0][0],v1);
			SKL[k].push(v1);
		}
	}
	return SKL;
};
verb_eval_Eval.rationalSurfacePoint = function(surface,u,v) {
	return verb_eval_Eval.dehomogenize(verb_eval_Eval.surfacePoint(surface,u,v));
};
verb_eval_Eval.rationalCurveDerivatives = function(curve,u,numDerivs) {
	if(numDerivs == null) numDerivs = 1;
	var ders = verb_eval_Eval.curveDerivatives(curve,u,numDerivs);
	var Aders = verb_eval_Eval.rational1d(ders);
	var wders = verb_eval_Eval.weight1d(ders);
	var k = 0;
	var i = 0;
	var CK = [];
	var _g1 = 0;
	var _g = numDerivs + 1;
	while(_g1 < _g) {
		var k1 = _g1++;
		var v = Aders[k1];
		var _g3 = 1;
		var _g2 = k1 + 1;
		while(_g3 < _g2) {
			var i1 = _g3++;
			verb_core_Vec.subMulMutate(v,verb_core_Binomial.get(k1,i1) * wders[i1],CK[k1 - i1]);
		}
		verb_core_Vec.mulMutate(1 / wders[0],v);
		CK.push(v);
	}
	return CK;
};
verb_eval_Eval.rationalCurvePoint = function(curve,u) {
	return verb_eval_Eval.dehomogenize(verb_eval_Eval.curvePoint(curve,u));
};
verb_eval_Eval.surfaceDerivatives = function(surface,u,v,numDerivs) {
	var n = surface.knotsU.length - surface.degreeU - 2;
	var m = surface.knotsV.length - surface.degreeV - 2;
	return verb_eval_Eval.surfaceDerivativesGivenNM(n,m,surface,u,v,numDerivs);
};
verb_eval_Eval.surfaceDerivativesGivenNM = function(n,m,surface,u,v,numDerivs) {
	var degreeU = surface.degreeU;
	var degreeV = surface.degreeV;
	var controlPoints = surface.controlPoints;
	var knotsU = surface.knotsU;
	var knotsV = surface.knotsV;
	if(!verb_eval_Eval.areValidRelations(degreeU,controlPoints.length,knotsU.length) || !verb_eval_Eval.areValidRelations(degreeV,controlPoints[0].length,knotsV.length)) throw new Error("Invalid relations between control points, knot vector, and n");
	var dim = controlPoints[0][0].length;
	var du;
	if(numDerivs < degreeU) du = numDerivs; else du = degreeU;
	var dv;
	if(numDerivs < degreeV) dv = numDerivs; else dv = degreeV;
	var SKL = verb_core_Vec.zeros3d(numDerivs + 1,numDerivs + 1,dim);
	var knotSpan_index_u = verb_eval_Eval.knotSpanGivenN(n,degreeU,u,knotsU);
	var knotSpan_index_v = verb_eval_Eval.knotSpanGivenN(m,degreeV,v,knotsV);
	var uders = verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotSpan_index_u,u,degreeU,n,knotsU);
	var vders = verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotSpan_index_v,v,degreeV,m,knotsV);
	var temp = verb_core_Vec.zeros2d(degreeV + 1,dim);
	var dd = 0;
	var _g1 = 0;
	var _g = du + 1;
	while(_g1 < _g) {
		var k = _g1++;
		var _g3 = 0;
		var _g2 = degreeV + 1;
		while(_g3 < _g2) {
			var s = _g3++;
			temp[s] = verb_core_Vec.zeros1d(dim);
			var _g5 = 0;
			var _g4 = degreeU + 1;
			while(_g5 < _g4) {
				var r = _g5++;
				verb_core_Vec.addMulMutate(temp[s],uders[k][r],controlPoints[knotSpan_index_u - degreeU + r][knotSpan_index_v - degreeV + s]);
			}
		}
		var nk = numDerivs - k;
		if(nk < dv) dd = nk; else dd = dv;
		var _g31 = 0;
		var _g21 = dd + 1;
		while(_g31 < _g21) {
			var l = _g31++;
			SKL[k][l] = verb_core_Vec.zeros1d(dim);
			var _g51 = 0;
			var _g41 = degreeV + 1;
			while(_g51 < _g41) {
				var s1 = _g51++;
				verb_core_Vec.addMulMutate(SKL[k][l],vders[l][s1],temp[s1]);
			}
		}
	}
	return SKL;
};
verb_eval_Eval.surfacePoint = function(surface,u,v) {
	var n = surface.knotsU.length - surface.degreeU - 2;
	var m = surface.knotsV.length - surface.degreeV - 2;
	return verb_eval_Eval.surfacePointGivenNM(n,m,surface,u,v);
};
verb_eval_Eval.surfacePointGivenNM = function(n,m,surface,u,v) {
	var degreeU = surface.degreeU;
	var degreeV = surface.degreeV;
	var controlPoints = surface.controlPoints;
	var knotsU = surface.knotsU;
	var knotsV = surface.knotsV;
	if(!verb_eval_Eval.areValidRelations(degreeU,controlPoints.length,knotsU.length) || !verb_eval_Eval.areValidRelations(degreeV,controlPoints[0].length,knotsV.length)) throw new Error("Invalid relations between control points, knot vector, and n");
	var dim = controlPoints[0][0].length;
	var knotSpan_index_u = verb_eval_Eval.knotSpanGivenN(n,degreeU,u,knotsU);
	var knotSpan_index_v = verb_eval_Eval.knotSpanGivenN(m,degreeV,v,knotsV);
	var u_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_u,u,degreeU,knotsU);
	var v_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_v,v,degreeV,knotsV);
	var uind = knotSpan_index_u - degreeU;
	var vind = knotSpan_index_v;
	var position = verb_core_Vec.zeros1d(dim);
	var temp = verb_core_Vec.zeros1d(dim);
	var _g1 = 0;
	var _g = degreeV + 1;
	while(_g1 < _g) {
		var l = _g1++;
		temp = verb_core_Vec.zeros1d(dim);
		vind = knotSpan_index_v - degreeV + l;
		var _g3 = 0;
		var _g2 = degreeU + 1;
		while(_g3 < _g2) {
			var k = _g3++;
			verb_core_Vec.addMulMutate(temp,u_basis_vals[k],controlPoints[uind + k][vind]);
		}
		verb_core_Vec.addMulMutate(position,v_basis_vals[l],temp);
	}
	return position;
};
verb_eval_Eval.curveRegularSamplePoints = function(crv,divs) {
	var derivs = verb_eval_Eval.curveDerivatives(crv,crv.knots[0],crv.degree);
	var t = 1.0 / divs;
	var temp = t * t;
	var f = derivs[0];
	var fd = verb_core_Vec.mul(t,derivs[1]);
	var fdd_per2 = verb_core_Vec.mul(temp * 0.5,derivs[2]);
	var fddd_per2 = verb_core_Vec.mul(temp * t * 0.5,derivs[3]);
	var fdd = verb_core_Vec.add(fdd_per2,fdd_per2);
	var fddd = verb_core_Vec.add(fddd_per2,fddd_per2);
	var fddd_per6 = verb_core_Vec.mul(0.333333333333333315,fddd_per2);
	var pts = [];
	var _g1 = 0;
	var _g = divs + 1;
	while(_g1 < _g) {
		var i = _g1++;
		pts.push(verb_eval_Eval.dehomogenize(f));
		verb_core_Vec.addAllMutate([f,fd,fdd_per2,fddd_per6]);
		verb_core_Vec.addAllMutate([fd,fdd,fddd_per2]);
		verb_core_Vec.addAllMutate([fdd,fddd]);
		verb_core_Vec.addAllMutate([fdd_per2,fddd_per2]);
	}
	return pts;
};
verb_eval_Eval.curveRegularSamplePoints2 = function(crv,divs) {
	var derivs = verb_eval_Eval.curveDerivatives(crv,crv.knots[0],crv.degree);
	var t = 1.0 / divs;
	var temp = t * t;
	var f = derivs[0];
	var fd = verb_core_Vec.mul(t,derivs[1]);
	var fdd_per2 = verb_core_Vec.mul(temp * 0.5,derivs[2]);
	var fddd_per2 = verb_core_Vec.mul(temp * t * 0.5,derivs[3]);
	var fdd = verb_core_Vec.add(fdd_per2,fdd_per2);
	var fddd = verb_core_Vec.add(fddd_per2,fddd_per2);
	var fddd_per6 = verb_core_Vec.mul(0.333333333333333315,fddd_per2);
	var pts = [];
	var _g1 = 0;
	var _g = divs + 1;
	while(_g1 < _g) {
		var i = _g1++;
		pts.push(verb_eval_Eval.dehomogenize(f));
		verb_core_Vec.addAllMutate([f,fd,fdd_per2,fddd_per6]);
		verb_core_Vec.addAllMutate([fd,fdd,fddd_per2]);
		verb_core_Vec.addAllMutate([fdd,fddd]);
		verb_core_Vec.addAllMutate([fdd_per2,fddd_per2]);
	}
	return pts;
};
verb_eval_Eval.rationalSurfaceRegularSampleDerivatives = function(surface,divsU,divsV,numDerivs) {
	var allders = verb_eval_Eval.surfaceRegularSampleDerivatives(surface,divsU,divsV,numDerivs);
	var allratders = [];
	var divsU1 = divsU + 1;
	var divsV1 = divsV + 1;
	var numDerivs1 = numDerivs + 1;
	var _g = 0;
	while(_g < divsU1) {
		var i = _g++;
		var rowders = [];
		allratders.push(rowders);
		var _g1 = 0;
		while(_g1 < divsV1) {
			var j = _g1++;
			var ders = allders[i][j];
			var Aders = verb_eval_Eval.rational2d(ders);
			var wders = verb_eval_Eval.weight2d(ders);
			var SKL = [];
			var dim = Aders[0][0].length;
			var _g2 = 0;
			while(_g2 < numDerivs1) {
				var k = _g2++;
				SKL.push([]);
				var _g4 = 0;
				var _g3 = numDerivs1 - k;
				while(_g4 < _g3) {
					var l = _g4++;
					var v = Aders[k][l];
					var _g6 = 1;
					var _g5 = l + 1;
					while(_g6 < _g5) {
						var j1 = _g6++;
						verb_core_Vec.subMulMutate(v,verb_core_Binomial.get(l,j1) * wders[0][j1],SKL[k][l - j1]);
					}
					var _g61 = 1;
					var _g51 = k + 1;
					while(_g61 < _g51) {
						var i1 = _g61++;
						verb_core_Vec.subMulMutate(v,verb_core_Binomial.get(k,i1) * wders[i1][0],SKL[k - i1][l]);
						var v2 = verb_core_Vec.zeros1d(dim);
						var _g8 = 1;
						var _g7 = l + 1;
						while(_g8 < _g7) {
							var j2 = _g8++;
							verb_core_Vec.addMulMutate(v2,verb_core_Binomial.get(l,j2) * wders[i1][j2],SKL[k - i1][l - j2]);
						}
						verb_core_Vec.subMulMutate(v,verb_core_Binomial.get(k,i1),v2);
					}
					verb_core_Vec.mulMutate(1 / wders[0][0],v);
					SKL[k].push(v);
				}
			}
			rowders.push(SKL);
		}
	}
	return allratders;
};
verb_eval_Eval.surfaceRegularSampleDerivatives = function(surface,divsU,divsV,numDerivs) {
	var degreeU = surface.degreeU;
	var degreeV = surface.degreeV;
	var controlPoints = surface.controlPoints;
	var knotsU = surface.knotsU;
	var knotsV = surface.knotsV;
	var dim = controlPoints[0][0].length;
	var spanU = (verb_core_ArrayExtensions.last(knotsU) - knotsU[0]) / divsU;
	var spanV = (verb_core_ArrayExtensions.last(knotsV) - knotsV[0]) / divsV;
	var knotSpansBasesU = verb_eval_Eval.regularlySpacedDerivativeBasisFunctions(degreeU,knotsU,divsU);
	var knotSpansU = knotSpansBasesU.item0;
	var basesU = knotSpansBasesU.item1;
	var knotSpansBasesV = verb_eval_Eval.regularlySpacedDerivativeBasisFunctions(degreeV,knotsV,divsV);
	var knotSpansV = knotSpansBasesV.item0;
	var basesV = knotSpansBasesV.item1;
	var pts = [];
	var divsU1 = divsU + 1;
	var divsV1 = divsV + 1;
	var _g = 0;
	while(_g < divsU1) {
		var i = _g++;
		var ptsi = [];
		pts.push(ptsi);
		var _g1 = 0;
		while(_g1 < divsV1) {
			var j = _g1++;
			ptsi.push(verb_eval_Eval.surfaceDerivativesGivenBasesKnotSpans(degreeU,degreeV,controlPoints,knotSpansU[i],knotSpansV[j],basesU[i],basesV[j],dim,numDerivs));
		}
	}
	return pts;
};
verb_eval_Eval.rationalSurfaceRegularSamplePoints = function(surface,divsU,divsV) {
	return verb_eval_Eval.dehomogenize2d(verb_eval_Eval.surfaceRegularSamplePoints(surface,divsU,divsV));
};
verb_eval_Eval.surfaceRegularSamplePoints = function(surface,divsU,divsV) {
	var degreeU = surface.degreeU;
	var degreeV = surface.degreeV;
	var controlPoints = surface.controlPoints;
	var knotsU = surface.knotsU;
	var knotsV = surface.knotsV;
	var dim = controlPoints[0][0].length;
	var spanU = (verb_core_ArrayExtensions.last(knotsU) - knotsU[0]) / divsU;
	var spanV = (verb_core_ArrayExtensions.last(knotsV) - knotsV[0]) / divsV;
	var knotSpansBasesU = verb_eval_Eval.regularlySpacedBasisFunctions(degreeU,knotsU,divsU);
	var knotSpansU = knotSpansBasesU.item0;
	var basesU = knotSpansBasesU.item1;
	var knotSpansBasesV = verb_eval_Eval.regularlySpacedBasisFunctions(degreeV,knotsV,divsV);
	var knotSpansV = knotSpansBasesV.item0;
	var basesV = knotSpansBasesV.item1;
	var pts = [];
	var divsU1 = divsU + 1;
	var divsV1 = divsV + 1;
	var _g = 0;
	while(_g < divsU1) {
		var i = _g++;
		var ptsi = [];
		pts.push(ptsi);
		var _g1 = 0;
		while(_g1 < divsV1) {
			var j = _g1++;
			ptsi.push(verb_eval_Eval.surfacePointGivenBasesKnotSpans(degreeU,degreeV,controlPoints,knotSpansU[i],knotSpansV[j],basesU[i],basesV[j],dim));
		}
	}
	return pts;
};
verb_eval_Eval.regularlySpacedBasisFunctions = function(degree,knots,divs) {
	var n = knots.length - degree - 2;
	var span = (verb_core_ArrayExtensions.last(knots) - knots[0]) / divs;
	var bases = [];
	var knotspans = [];
	var u = knots[0];
	var knotIndex = verb_eval_Eval.knotSpanGivenN(n,degree,u,knots);
	var div1 = divs + 1;
	var _g = 0;
	while(_g < div1) {
		var i = _g++;
		while(u >= knots[knotIndex + 1]) knotIndex++;
		knotspans.push(knotIndex);
		bases.push(verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotIndex,u,degree,knots));
		u += span;
	}
	return new verb_core_Pair(knotspans,bases);
};
verb_eval_Eval.regularlySpacedDerivativeBasisFunctions = function(degree,knots,divs) {
	var n = knots.length - degree - 2;
	var span = (verb_core_ArrayExtensions.last(knots) - knots[0]) / divs;
	var bases = [];
	var knotspans = [];
	var u = knots[0];
	var knotIndex = verb_eval_Eval.knotSpanGivenN(n,degree,u,knots);
	var div1 = divs + 1;
	var _g = 0;
	while(_g < div1) {
		var i = _g++;
		while(u >= knots[knotIndex + 1]) knotIndex++;
		knotspans.push(knotIndex);
		bases.push(verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotIndex,u,degree,n,knots));
		u += span;
	}
	return new verb_core_Pair(knotspans,bases);
};
verb_eval_Eval.surfacePointGivenBasesKnotSpans = function(degreeU,degreeV,controlPoints,knotSpanU,knotSpanV,basesU,basesV,dim) {
	var position = verb_core_Vec.zeros1d(dim);
	var temp;
	var uind = knotSpanU - degreeU;
	var vind = knotSpanV - degreeV;
	var _g1 = 0;
	var _g = degreeV + 1;
	while(_g1 < _g) {
		var l = _g1++;
		temp = verb_core_Vec.zeros1d(dim);
		var _g3 = 0;
		var _g2 = degreeU + 1;
		while(_g3 < _g2) {
			var k = _g3++;
			verb_core_Vec.addMulMutate(temp,basesU[k],controlPoints[uind + k][vind]);
		}
		vind++;
		verb_core_Vec.addMulMutate(position,basesV[l],temp);
	}
	return position;
};
verb_eval_Eval.surfaceDerivativesGivenBasesKnotSpans = function(degreeU,degreeV,controlPoints,knotSpanU,knotSpanV,basesU,basesV,dim,numDerivs) {
	var dim1 = controlPoints[0][0].length;
	var du;
	if(numDerivs < degreeU) du = numDerivs; else du = degreeU;
	var dv;
	if(numDerivs < degreeV) dv = numDerivs; else dv = degreeV;
	var SKL = verb_core_Vec.zeros3d(du + 1,dv + 1,dim1);
	var temp = verb_core_Vec.zeros2d(degreeV + 1,dim1);
	var dd = 0;
	var _g1 = 0;
	var _g = du + 1;
	while(_g1 < _g) {
		var k = _g1++;
		var _g3 = 0;
		var _g2 = degreeV + 1;
		while(_g3 < _g2) {
			var s = _g3++;
			temp[s] = verb_core_Vec.zeros1d(dim1);
			var _g5 = 0;
			var _g4 = degreeU + 1;
			while(_g5 < _g4) {
				var r = _g5++;
				verb_core_Vec.addMulMutate(temp[s],basesU[k][r],controlPoints[knotSpanU - degreeU + r][knotSpanV - degreeV + s]);
			}
		}
		var nk = numDerivs - k;
		if(nk < dv) dd = nk; else dd = dv;
		var _g31 = 0;
		var _g21 = dd + 1;
		while(_g31 < _g21) {
			var l = _g31++;
			SKL[k][l] = verb_core_Vec.zeros1d(dim1);
			var _g51 = 0;
			var _g41 = degreeV + 1;
			while(_g51 < _g41) {
				var s1 = _g51++;
				verb_core_Vec.addMulMutate(SKL[k][l],basesV[l][s1],temp[s1]);
			}
		}
	}
	return SKL;
};
verb_eval_Eval.curveDerivatives = function(crv,u,numDerivs) {
	var n = crv.knots.length - crv.degree - 2;
	return verb_eval_Eval.curveDerivativesGivenN(n,crv,u,numDerivs);
};
verb_eval_Eval.curveDerivativesGivenN = function(n,curve,u,numDerivs) {
	var degree = curve.degree;
	var controlPoints = curve.controlPoints;
	var knots = curve.knots;
	if(!verb_eval_Eval.areValidRelations(degree,controlPoints.length,knots.length)) throw new Error("Invalid relations between control points, knot vector, and n");
	var dim = controlPoints[0].length;
	var du;
	if(numDerivs < degree) du = numDerivs; else du = degree;
	var CK = verb_core_Vec.zeros2d(numDerivs + 1,dim);
	var knotSpan_index = verb_eval_Eval.knotSpanGivenN(n,degree,u,knots);
	var nders = verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotSpan_index,u,degree,du,knots);
	var k = 0;
	var j = 0;
	var _g1 = 0;
	var _g = du + 1;
	while(_g1 < _g) {
		var k1 = _g1++;
		var _g3 = 0;
		var _g2 = degree + 1;
		while(_g3 < _g2) {
			var j1 = _g3++;
			verb_core_Vec.addMulMutate(CK[k1],nders[k1][j1],controlPoints[knotSpan_index - degree + j1]);
		}
	}
	return CK;
};
verb_eval_Eval.curvePoint = function(curve,u) {
	var n = curve.knots.length - curve.degree - 2;
	return verb_eval_Eval.curvePointGivenN(n,curve,u);
};
verb_eval_Eval.areValidRelations = function(degree,num_controlPoints,knots_length) {
	return num_controlPoints + degree + 1 - knots_length == 0;
};
verb_eval_Eval.curvePointGivenN = function(n,curve,u) {
	var degree = curve.degree;
	var controlPoints = curve.controlPoints;
	var knots = curve.knots;
	if(!verb_eval_Eval.areValidRelations(degree,controlPoints.length,knots.length)) {
		throw new Error("Invalid relations between control points, knot Array, and n");
		return null;
	}
	var knotSpan_index = verb_eval_Eval.knotSpanGivenN(n,degree,u,knots);
	var basis_values = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index,u,degree,knots);
	var position = verb_core_Vec.zeros1d(controlPoints[0].length);
	var _g1 = 0;
	var _g = degree + 1;
	while(_g1 < _g) {
		var j = _g1++;
		verb_core_Vec.addMulMutate(position,basis_values[j],controlPoints[knotSpan_index - degree + j]);
	}
	return position;
};
verb_eval_Eval.volumePoint = function(volume,u,v,w) {
	var n = volume.knotsU.length - volume.degreeU - 2;
	var m = volume.knotsV.length - volume.degreeV - 2;
	var l = volume.knotsW.length - volume.degreeW - 2;
	return verb_eval_Eval.volumePointGivenNML(volume,n,m,l,u,v,w);
};
verb_eval_Eval.volumePointGivenNML = function(volume,n,m,l,u,v,w) {
	if(!verb_eval_Eval.areValidRelations(volume.degreeU,volume.controlPoints.length,volume.knotsU.length) || !verb_eval_Eval.areValidRelations(volume.degreeV,volume.controlPoints[0].length,volume.knotsV.length) || !verb_eval_Eval.areValidRelations(volume.degreeW,volume.controlPoints[0][0].length,volume.knotsW.length)) throw new Error("Invalid relations between control points and knot vector");
	var controlPoints = volume.controlPoints;
	var degreeU = volume.degreeU;
	var degreeV = volume.degreeV;
	var degreeW = volume.degreeW;
	var knotsU = volume.knotsU;
	var knotsV = volume.knotsV;
	var knotsW = volume.knotsW;
	var dim = controlPoints[0][0][0].length;
	var knotSpan_index_u = verb_eval_Eval.knotSpanGivenN(n,degreeU,u,knotsU);
	var knotSpan_index_v = verb_eval_Eval.knotSpanGivenN(m,degreeV,v,knotsV);
	var knotSpan_index_w = verb_eval_Eval.knotSpanGivenN(l,degreeW,w,knotsW);
	var u_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_u,u,degreeU,knotsU);
	var v_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_v,v,degreeV,knotsV);
	var w_basis_vals = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index_w,w,degreeW,knotsW);
	var uind = knotSpan_index_u - degreeU;
	var position = verb_core_Vec.zeros1d(dim);
	var temp = verb_core_Vec.zeros1d(dim);
	var temp2 = verb_core_Vec.zeros1d(dim);
	var _g1 = 0;
	var _g = degreeW + 1;
	while(_g1 < _g) {
		var i = _g1++;
		temp2 = verb_core_Vec.zeros1d(dim);
		var wind = knotSpan_index_w - degreeW + i;
		var _g3 = 0;
		var _g2 = degreeV + 1;
		while(_g3 < _g2) {
			var j = _g3++;
			temp = verb_core_Vec.zeros1d(dim);
			var vind = knotSpan_index_v - degreeV + j;
			var _g5 = 0;
			var _g4 = degreeU + 1;
			while(_g5 < _g4) {
				var k = _g5++;
				verb_core_Vec.addMulMutate(temp,u_basis_vals[k],controlPoints[uind + k][vind][wind]);
			}
			verb_core_Vec.addMulMutate(temp2,v_basis_vals[j],temp);
		}
		verb_core_Vec.addMulMutate(position,w_basis_vals[i],temp2);
	}
	return position;
};
verb_eval_Eval.derivativeBasisFunctions = function(u,degree,knots) {
	var knotSpan_index = verb_eval_Eval.knotSpan(degree,u,knots);
	var m = knots.length - 1;
	var n = m - degree - 1;
	return verb_eval_Eval.derivativeBasisFunctionsGivenNI(knotSpan_index,u,degree,n,knots);
};
verb_eval_Eval.derivativeBasisFunctionsGivenNI = function(knotIndex,u,p,n,knots) {
	var ndu = verb_core_Vec.zeros2d(p + 1,p + 1);
	var left = verb_core_Vec.zeros1d(p + 1);
	var right = verb_core_Vec.zeros1d(p + 1);
	var saved = 0.0;
	var temp = 0.0;
	ndu[0][0] = 1.0;
	var _g1 = 1;
	var _g = p + 1;
	while(_g1 < _g) {
		var j = _g1++;
		left[j] = u - knots[knotIndex + 1 - j];
		right[j] = knots[knotIndex + j] - u;
		saved = 0.0;
		var _g2 = 0;
		while(_g2 < j) {
			var r = _g2++;
			ndu[j][r] = right[r + 1] + left[j - r];
			temp = ndu[r][j - 1] / ndu[j][r];
			ndu[r][j] = saved + right[r + 1] * temp;
			saved = left[j - r] * temp;
		}
		ndu[j][j] = saved;
	}
	var ders = verb_core_Vec.zeros2d(n + 1,p + 1);
	var a = verb_core_Vec.zeros2d(2,p + 1);
	var s1 = 0;
	var s2 = 1;
	var d = 0.0;
	var rk = 0;
	var pk = 0;
	var j1 = 0;
	var j2 = 0;
	var _g11 = 0;
	var _g3 = p + 1;
	while(_g11 < _g3) {
		var j3 = _g11++;
		ders[0][j3] = ndu[j3][p];
	}
	var _g12 = 0;
	var _g4 = p + 1;
	while(_g12 < _g4) {
		var r1 = _g12++;
		s1 = 0;
		s2 = 1;
		a[0][0] = 1.0;
		var _g31 = 1;
		var _g21 = n + 1;
		while(_g31 < _g21) {
			var k = _g31++;
			d = 0.0;
			rk = r1 - k;
			pk = p - k;
			if(r1 >= k) {
				a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
				d = a[s2][0] * ndu[rk][pk];
			}
			if(rk >= -1) j1 = 1; else j1 = -rk;
			if(r1 - 1 <= pk) j2 = k - 1; else j2 = p - r1;
			var _g5 = j1;
			var _g41 = j2 + 1;
			while(_g5 < _g41) {
				var j4 = _g5++;
				a[s2][j4] = (a[s1][j4] - a[s1][j4 - 1]) / ndu[pk + 1][rk + j4];
				d += a[s2][j4] * ndu[rk + j4][pk];
			}
			if(r1 <= pk) {
				a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r1];
				d += a[s2][k] * ndu[r1][pk];
			}
			ders[k][r1] = d;
			var temp1 = s1;
			s1 = s2;
			s2 = temp1;
		}
	}
	var acc = p;
	var _g13 = 1;
	var _g6 = n + 1;
	while(_g13 < _g6) {
		var k1 = _g13++;
		var _g32 = 0;
		var _g22 = p + 1;
		while(_g32 < _g22) {
			var j5 = _g32++;
			ders[k1][j5] *= acc;
		}
		acc *= p - k1;
	}
	return ders;
};
verb_eval_Eval.basisFunctions = function(u,degree,knots) {
	var knotSpan_index = verb_eval_Eval.knotSpan(degree,u,knots);
	return verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(knotSpan_index,u,degree,knots);
};
verb_eval_Eval.basisFunctionsGivenKnotSpanIndex = function(knotSpan_index,u,degree,knots) {
	var basisFunctions = verb_core_Vec.zeros1d(degree + 1);
	var left = verb_core_Vec.zeros1d(degree + 1);
	var right = verb_core_Vec.zeros1d(degree + 1);
	var saved = 0;
	var temp = 0;
	basisFunctions[0] = 1.0;
	var _g1 = 1;
	var _g = degree + 1;
	while(_g1 < _g) {
		var j = _g1++;
		left[j] = u - knots[knotSpan_index + 1 - j];
		right[j] = knots[knotSpan_index + j] - u;
		saved = 0.0;
		var _g2 = 0;
		while(_g2 < j) {
			var r = _g2++;
			temp = basisFunctions[r] / (right[r + 1] + left[j - r]);
			basisFunctions[r] = saved + right[r + 1] * temp;
			saved = left[j - r] * temp;
		}
		basisFunctions[j] = saved;
	}
	return basisFunctions;
};
verb_eval_Eval.knotSpan = function(degree,u,knots) {
	return verb_eval_Eval.knotSpanGivenN(knots.length - degree - 2,degree,u,knots);
};
verb_eval_Eval.knotSpanGivenN = function(n,degree,u,knots) {
	if(u > knots[n + 1] - verb_core_Constants.EPSILON) return n;
	if(u < knots[degree] + verb_core_Constants.EPSILON) return degree;
	var low = degree;
	var high = n + 1;
	var mid = Math.floor((low + high) / 2);
	while(u < knots[mid] || u >= knots[mid + 1]) {
		if(u < knots[mid]) high = mid; else low = mid;
		mid = Math.floor((low + high) / 2);
	}
	return mid;
};
verb_eval_Eval.dehomogenize = function(homoPoint) {
	var dim = homoPoint.length;
	var point = [];
	var wt = homoPoint[dim - 1];
	var l = homoPoint.length - 1;
	var _g = 0;
	while(_g < l) {
		var i = _g++;
		point.push(homoPoint[i] / wt);
	}
	return point;
};
verb_eval_Eval.rational1d = function(homoPoints) {
	var dim = homoPoints[0].length - 1;
	return homoPoints.map(function(x) {
		return x.slice(0,dim);
	});
};
verb_eval_Eval.rational2d = function(homoPoints) {
	return homoPoints.map(verb_eval_Eval.rational1d);
};
verb_eval_Eval.weight1d = function(homoPoints) {
	var dim = homoPoints[0].length - 1;
	return homoPoints.map(function(x) {
		return x[dim];
	});
};
verb_eval_Eval.weight2d = function(homoPoints) {
	return homoPoints.map(verb_eval_Eval.weight1d);
};
verb_eval_Eval.dehomogenize1d = function(homoPoints) {
	return homoPoints.map(verb_eval_Eval.dehomogenize);
};
verb_eval_Eval.dehomogenize2d = function(homoPoints) {
	return homoPoints.map(verb_eval_Eval.dehomogenize1d);
};
verb_eval_Eval.homogenize1d = function(controlPoints,weights) {
	var rows = controlPoints.length;
	var dim = controlPoints[0].length;
	var homo_controlPoints = [];
	var wt = 0.0;
	var ref_pt = [];
	var weights1;
	if(weights != null) weights1 = weights; else weights1 = verb_core_Vec.rep(controlPoints.length,1.0);
	var _g = 0;
	while(_g < rows) {
		var i = _g++;
		var pt = [];
		ref_pt = controlPoints[i];
		wt = weights1[i];
		var _g1 = 0;
		while(_g1 < dim) {
			var k = _g1++;
			pt.push(ref_pt[k] * wt);
		}
		pt.push(wt);
		homo_controlPoints.push(pt);
	}
	return homo_controlPoints;
};
verb_eval_Eval.homogenize2d = function(controlPoints,weights) {
	var rows = controlPoints.length;
	var homo_controlPoints = [];
	var weights1;
	if(weights != null) weights1 = weights; else {
		var _g = [];
		var _g1 = 0;
		while(_g1 < rows) {
			var i = _g1++;
			_g.push(verb_core_Vec.rep(controlPoints[0].length,1.0));
		}
		weights1 = _g;
	}
	var _g11 = 0;
	while(_g11 < rows) {
		var i1 = _g11++;
		homo_controlPoints.push(verb_eval_Eval.homogenize1d(controlPoints[i1],weights1[i1]));
	}
	return homo_controlPoints;
};
var verb_eval_Intersect = function() { };

verb_eval_Intersect.__name__ = ["verb","eval","Intersect"];
verb_eval_Intersect.surfaces = function(surface0,surface1,tol) {
	var tess1 = verb_eval_Tess.rationalSurfaceAdaptive(surface0);
	var tess2 = verb_eval_Tess.rationalSurfaceAdaptive(surface1);
	var resApprox = verb_eval_Intersect.meshes(tess1,tess2);
	var exactPls = resApprox.map(function(pl) {
		return pl.map(function(inter) {
			return verb_eval_Intersect.surfacesAtPointWithEstimate(surface0,surface1,inter.uv0,inter.uv1,tol);
		});
	});
	return exactPls.map(function(x) {
		return verb_eval_Make.rationalInterpCurve(x.map(function(y) {
			return y.point;
		}),3);
	});
};
verb_eval_Intersect.surfacesAtPointWithEstimate = function(surface0,surface1,uv1,uv2,tol) {
	var pds;
	var p;
	var pn;
	var pu;
	var pv;
	var pd;
	var qds;
	var q;
	var qn;
	var qu;
	var qv;
	var qd;
	var dist;
	var maxits = 5;
	var its = 0;
	do {
		pds = verb_eval_Eval.rationalSurfaceDerivatives(surface0,uv1[0],uv1[1],1);
		p = pds[0][0];
		pu = pds[1][0];
		pv = pds[0][1];
		pn = verb_core_Vec.normalized(verb_core_Vec.cross(pu,pv));
		pd = verb_core_Vec.dot(pn,p);
		qds = verb_eval_Eval.rationalSurfaceDerivatives(surface1,uv2[0],uv2[1],1);
		q = qds[0][0];
		qu = qds[1][0];
		qv = qds[0][1];
		qn = verb_core_Vec.normalized(verb_core_Vec.cross(qu,qv));
		qd = verb_core_Vec.dot(qn,q);
		dist = verb_core_Vec.distSquared(p,q);
		if(dist < tol * tol) break;
		var fn = verb_core_Vec.normalized(verb_core_Vec.cross(pn,qn));
		var fd = verb_core_Vec.dot(fn,p);
		var x = verb_eval_Intersect.threePlanes(pn,pd,qn,qd,fn,fd);
		if(x == null) throw new Error("panic!");
		var pdif = verb_core_Vec.sub(x,p);
		var qdif = verb_core_Vec.sub(x,q);
		var rw = verb_core_Vec.cross(pu,pn);
		var rt = verb_core_Vec.cross(pv,pn);
		var su = verb_core_Vec.cross(qu,qn);
		var sv = verb_core_Vec.cross(qv,qn);
		var dw = verb_core_Vec.dot(rt,pdif) / verb_core_Vec.dot(rt,pu);
		var dt = verb_core_Vec.dot(rw,pdif) / verb_core_Vec.dot(rw,pv);
		var du = verb_core_Vec.dot(sv,qdif) / verb_core_Vec.dot(sv,qu);
		var dv = verb_core_Vec.dot(su,qdif) / verb_core_Vec.dot(su,qv);
		uv1 = verb_core_Vec.add([dw,dt],uv1);
		uv2 = verb_core_Vec.add([du,dv],uv2);
		its++;
	} while(its < maxits);
	return new verb_core_SurfaceSurfaceIntersectionPoint(uv1,uv2,p,dist);
};
verb_eval_Intersect.meshes = function(mesh0,mesh1,bbtree0,bbtree1) {
	if(bbtree0 == null) bbtree0 = new verb_core_LazyMeshBoundingBoxTree(mesh0);
	if(bbtree1 == null) bbtree1 = new verb_core_LazyMeshBoundingBoxTree(mesh1);
	var bbints = verb_eval_Intersect.boundingBoxTrees(bbtree0,bbtree1,0);
	var segments = verb_core_ArrayExtensions.unique(bbints.map(function(ids) {
		return verb_eval_Intersect.triangles(mesh0,ids.item0,mesh1,ids.item1);
	}).filter(function(x) {
		return x != null;
	}).filter(function(x1) {
		return verb_core_Vec.distSquared(x1.min.point,x1.max.point) > verb_core_Constants.EPSILON;
	}),function(a,b) {
		var s1 = verb_core_Vec.sub(a.min.uv0,b.min.uv0);
		var d1 = verb_core_Vec.dot(s1,s1);
		var s2 = verb_core_Vec.sub(a.max.uv0,b.max.uv0);
		var d2 = verb_core_Vec.dot(s2,s2);
		var s3 = verb_core_Vec.sub(a.min.uv0,b.max.uv0);
		var d3 = verb_core_Vec.dot(s3,s3);
		var s4 = verb_core_Vec.sub(a.max.uv0,b.min.uv0);
		var d4 = verb_core_Vec.dot(s4,s4);
		return d1 < verb_core_Constants.EPSILON && d2 < verb_core_Constants.EPSILON || d3 < verb_core_Constants.EPSILON && d4 < verb_core_Constants.EPSILON;
	});
	return verb_eval_Intersect.makeMeshIntersectionPolylines(segments);
};
verb_eval_Intersect.meshSlices = function(mesh,min,max,step) {
	var bbtree = new verb_core_MeshBoundingBoxTree(mesh);
	var bb = bbtree.boundingBox();
	var x0 = bb.min[0];
	var y0 = bb.min[1];
	var x1 = bb.max[0];
	var y1 = bb.max[1];
	var span = verb_core_Vec.span(min,max,step);
	var slices = [];
	var _g = 0;
	while(_g < span.length) {
		var z = span[_g];
		++_g;
		var pts = [[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
		var uvs = [[0.0,0.0],[1.0,0.0],[1.0,1.0],[0.0,1.0]];
		var faces = [[0,1,2],[0,2,3]];
		var plane = new verb_core_MeshData(faces,pts,null,uvs);
		slices.push(verb_eval_Intersect.meshes(mesh,plane,bbtree));
	}
	return slices;
};
verb_eval_Intersect.makeMeshIntersectionPolylines = function(segments) {
	if(segments.length == 0) return [];
	var _g = 0;
	while(_g < segments.length) {
		var s = segments[_g];
		++_g;
		s.max.opp = s.min;
		s.min.opp = s.max;
	}
	var tree = verb_eval_Intersect.kdTreeFromSegments(segments);
	var ends = [];
	var _g1 = 0;
	while(_g1 < segments.length) {
		var seg = segments[_g1];
		++_g1;
		ends.push(seg.min);
		ends.push(seg.max);
	}
	var _g2 = 0;
	while(_g2 < ends.length) {
		var segEnd = ends[_g2];
		++_g2;
		if(segEnd.adj != null) continue;
		var adjEnd = verb_eval_Intersect.lookupAdjacentSegment(segEnd,tree,segments.length);
		if(adjEnd != null && adjEnd.adj == null) {
			segEnd.adj = adjEnd;
			adjEnd.adj = segEnd;
		}
	}
	var freeEnds = ends.filter(function(x) {
		return x.adj == null;
	});
	if(freeEnds.length == 0) freeEnds = ends;
	var pls = [];
	var numVisitedEnds = 0;
	var loopDetected = false;
	while(freeEnds.length != 0) {
		var end = freeEnds.pop();
		if(!end.visited) {
			var pl = [];
			var curEnd = end;
			while(curEnd != null) {
				if(curEnd.visited) break;
				curEnd.visited = true;
				curEnd.opp.visited = true;
				pl.push(curEnd);
				numVisitedEnds += 2;
				curEnd = curEnd.opp.adj;
				if(curEnd == end) break;
			}
			if(pl.length > 0) {
				pl.push(pl[pl.length - 1].opp);
				pls.push(pl);
			}
		}
		if(freeEnds.length == 0 && ends.length > 0 && (loopDetected || numVisitedEnds < ends.length)) {
			loopDetected = true;
			var e = ends.pop();
			freeEnds.push(e);
		}
	}
	return pls;
};
verb_eval_Intersect.kdTreeFromSegments = function(segments) {
	var treePoints = [];
	var _g = 0;
	while(_g < segments.length) {
		var seg = segments[_g];
		++_g;
		treePoints.push(new verb_core_KdPoint(seg.min.point,seg.min));
		treePoints.push(new verb_core_KdPoint(seg.max.point,seg.max));
	}
	return new verb_core_KdTree(treePoints,verb_core_Vec.distSquared);
};
verb_eval_Intersect.lookupAdjacentSegment = function(segEnd,tree,numResults) {
	var adj = tree.nearest(segEnd.point,numResults,verb_core_Constants.EPSILON).filter(function(r) {
		return segEnd != r.item0.obj;
	}).map(function(r1) {
		return r1.item0.obj;
	});
	if(adj.length == 1) return adj[0]; else return null;
};
verb_eval_Intersect.curveAndSurface = function(curve,surface,tol,crvBbTree,srfBbTree) {
	if(tol == null) tol = 1e-3;
	if(crvBbTree != null) crvBbTree = crvBbTree; else crvBbTree = new verb_core_LazyCurveBoundingBoxTree(curve);
	if(srfBbTree != null) srfBbTree = srfBbTree; else srfBbTree = new verb_core_LazySurfaceBoundingBoxTree(surface);
	var ints = verb_eval_Intersect.boundingBoxTrees(crvBbTree,srfBbTree,tol);
	return verb_core_ArrayExtensions.unique(ints.map(function(inter) {
		var crvSeg = inter.item0;
		var srfPart = inter.item1;
		var min = verb_core_ArrayExtensions.first(crvSeg.knots);
		var max = verb_core_ArrayExtensions.last(crvSeg.knots);
		var u = (min + max) / 2.0;
		var minu = verb_core_ArrayExtensions.first(srfPart.knotsU);
		var maxu = verb_core_ArrayExtensions.last(srfPart.knotsU);
		var minv = verb_core_ArrayExtensions.first(srfPart.knotsV);
		var maxv = verb_core_ArrayExtensions.last(srfPart.knotsV);
		var uv = [(minu + maxu) / 2.0,(minv + maxv) / 2.0];
		return verb_eval_Intersect.curveAndSurfaceWithEstimate(crvSeg,srfPart,[u].concat(uv),tol);
	}).filter(function(x) {
		return verb_core_Vec.distSquared(x.curvePoint,x.surfacePoint) < tol * tol;
	}),function(a,b) {
		return Math.abs(a.u - b.u) < 0.5 * tol;
	});
};
verb_eval_Intersect.curveAndSurfaceWithEstimate = function(curve,surface,start_params,tol) {
	if(tol == null) tol = 1e-3;
	var objective = function(x) {
		var p1 = verb_eval_Eval.rationalCurvePoint(curve,x[0]);
		var p2 = verb_eval_Eval.rationalSurfacePoint(surface,x[1],x[2]);
		var p1_p2 = verb_core_Vec.sub(p1,p2);
		return verb_core_Vec.dot(p1_p2,p1_p2);
	};
	var grad = function(x1) {
		var dc = verb_eval_Eval.rationalCurveDerivatives(curve,x1[0],1);
		var ds = verb_eval_Eval.rationalSurfaceDerivatives(surface,x1[1],x1[2],1);
		var r = verb_core_Vec.sub(ds[0][0],dc[0]);
		var drdt = verb_core_Vec.mul(-1.0,dc[1]);
		var drdu = ds[1][0];
		var drdv = ds[0][1];
		return [2.0 * verb_core_Vec.dot(drdt,r),2.0 * verb_core_Vec.dot(drdu,r),2.0 * verb_core_Vec.dot(drdv,r)];
	};
	var sol_obj = verb_core_Minimizer.uncmin(objective,start_params,tol * tol,grad);
	var $final = sol_obj.solution;
	return new verb_core_CurveSurfaceIntersection($final[0],[$final[1],$final[2]],verb_eval_Eval.rationalCurvePoint(curve,$final[0]),verb_eval_Eval.rationalSurfacePoint(surface,$final[1],$final[2]));
};
verb_eval_Intersect.polylineAndMesh = function(polyline,mesh,tol) {
	var res = verb_eval_Intersect.boundingBoxTrees(new verb_core_LazyPolylineBoundingBoxTree(polyline),new verb_core_LazyMeshBoundingBoxTree(mesh),tol);
	var finalResults = [];
	var _g = 0;
	while(_g < res.length) {
		var event = res[_g];
		++_g;
		var polid = event.item0;
		var faceid = event.item1;
		var inter = verb_eval_Intersect.segmentWithTriangle(polyline.points[polid],polyline.points[polid + 1],mesh.points,mesh.faces[faceid]);
		if(inter == null) continue;
		var pt = inter.point;
		var u = verb_core_Vec.lerp(inter.p,[polyline.params[polid]],[polyline.params[polid + 1]])[0];
		var uv = verb_core_Mesh.triangleUVFromPoint(mesh,faceid,pt);
		finalResults.push(new verb_core_PolylineMeshIntersection(pt,u,uv,polid,faceid));
	}
	return finalResults;
};
verb_eval_Intersect.boundingBoxTrees = function(ai,bi,tol) {
	if(tol == null) tol = 1e-9;
	var atrees = [];
	var btrees = [];
	atrees.push(ai);
	btrees.push(bi);
	var results = [];
	while(atrees.length > 0) {
		var a = atrees.pop();
		var b = btrees.pop();
		if(a.empty() || b.empty()) continue;
		if(!a.boundingBox().intersects(b.boundingBox(),tol)) continue;
		var ai1 = a.indivisible(tol);
		var bi1 = b.indivisible(tol);
		if(ai1 && bi1) {
			results.push(new verb_core_Pair(a["yield"](),b["yield"]()));
			continue;
		} else if(ai1 && !bi1) {
			var bs1 = b.split();
			atrees.push(a);
			btrees.push(bs1.item1);
			atrees.push(a);
			btrees.push(bs1.item0);
			continue;
		} else if(!ai1 && bi1) {
			var as1 = a.split();
			atrees.push(as1.item1);
			btrees.push(b);
			atrees.push(as1.item0);
			btrees.push(b);
			continue;
		}
		var $as = a.split();
		var bs = b.split();
		atrees.push($as.item1);
		btrees.push(bs.item1);
		atrees.push($as.item1);
		btrees.push(bs.item0);
		atrees.push($as.item0);
		btrees.push(bs.item1);
		atrees.push($as.item0);
		btrees.push(bs.item0);
	}
	return results;
};
verb_eval_Intersect.curves = function(curve1,curve2,tolerance) {
	var ints = verb_eval_Intersect.boundingBoxTrees(new verb_core_LazyCurveBoundingBoxTree(curve1),new verb_core_LazyCurveBoundingBoxTree(curve2),0);
	return verb_core_ArrayExtensions.unique(ints.map(function(x) {
		return verb_eval_Intersect.curvesWithEstimate(curve1,curve2,verb_core_ArrayExtensions.first(x.item0.knots),verb_core_ArrayExtensions.first(x.item1.knots),tolerance);
	}).filter(function(x1) {
		return verb_core_Vec.distSquared(x1.point0,x1.point1) < tolerance;
	}),function(a,b) {
		return Math.abs(a.u0 - b.u0) < tolerance * 5;
	});
};
verb_eval_Intersect.curvesWithEstimate = function(curve0,curve1,u0,u1,tolerance) {
	var objective = function(x) {
		var p1 = verb_eval_Eval.rationalCurvePoint(curve0,x[0]);
		var p2 = verb_eval_Eval.rationalCurvePoint(curve1,x[1]);
		var p1_p2 = verb_core_Vec.sub(p1,p2);
		return verb_core_Vec.dot(p1_p2,p1_p2);
	};
	var grad = function(x1) {
		var dc0 = verb_eval_Eval.rationalCurveDerivatives(curve0,x1[0],1);
		var dc1 = verb_eval_Eval.rationalCurveDerivatives(curve1,x1[1],1);
		var r = verb_core_Vec.sub(dc0[0],dc1[0]);
		var drdu = dc0[1];
		var drdt = verb_core_Vec.mul(-1.0,dc1[1]);
		return [2.0 * verb_core_Vec.dot(drdu,r),2.0 * verb_core_Vec.dot(drdt,r)];
	};
	var sol_obj = verb_core_Minimizer.uncmin(objective,[u0,u1],tolerance * tolerance,grad);
	var u11 = sol_obj.solution[0];
	var u2 = sol_obj.solution[1];
	var p11 = verb_eval_Eval.rationalCurvePoint(curve0,u11);
	var p21 = verb_eval_Eval.rationalCurvePoint(curve1,u2);
	return new verb_core_CurveCurveIntersection(p11,p21,u11,u2);
};
verb_eval_Intersect.triangles = function(mesh0,faceIndex0,mesh1,faceIndex1) {
	var tri0 = mesh0.faces[faceIndex0];
	var tri1 = mesh1.faces[faceIndex1];
	var n0 = verb_core_Mesh.getTriangleNorm(mesh0.points,tri0);
	var n1 = verb_core_Mesh.getTriangleNorm(mesh1.points,tri1);
	var o0 = mesh0.points[tri0[0]];
	var o1 = mesh1.points[tri1[0]];
	var ray = verb_eval_Intersect.planes(o0,n0,o1,n1);
	if(ray == null) return null;
	var clip1 = verb_eval_Intersect.clipRayInCoplanarTriangle(ray,mesh0,faceIndex0);
	if(clip1 == null) return null;
	var clip2 = verb_eval_Intersect.clipRayInCoplanarTriangle(ray,mesh1,faceIndex1);
	if(clip2 == null) return null;
	var merged = verb_eval_Intersect.mergeTriangleClipIntervals(clip1,clip2,mesh0,faceIndex0,mesh1,faceIndex1);
	if(merged == null) return null;
	return new verb_core_Interval(new verb_core_MeshIntersectionPoint(merged.min.uv0,merged.min.uv1,merged.min.point,faceIndex0,faceIndex1),new verb_core_MeshIntersectionPoint(merged.max.uv0,merged.max.uv1,merged.max.point,faceIndex0,faceIndex1));
};
verb_eval_Intersect.clipRayInCoplanarTriangle = function(ray,mesh,faceIndex) {
	var tri = mesh.faces[faceIndex];
	var o = [mesh.points[tri[0]],mesh.points[tri[1]],mesh.points[tri[2]]];
	var uvs = [mesh.uvs[tri[0]],mesh.uvs[tri[1]],mesh.uvs[tri[2]]];
	var uvd = [verb_core_Vec.sub(uvs[1],uvs[0]),verb_core_Vec.sub(uvs[2],uvs[1]),verb_core_Vec.sub(uvs[0],uvs[2])];
	var s = [verb_core_Vec.sub(o[1],o[0]),verb_core_Vec.sub(o[2],o[1]),verb_core_Vec.sub(o[0],o[2])];
	var d = s.map(verb_core_Vec.normalized);
	var l = s.map(verb_core_Vec.norm);
	var minU = null;
	var maxU = null;
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		var o0 = o[i];
		var d0 = d[i];
		var res = verb_eval_Intersect.rays(o0,d0,ray.origin,ray.dir);
		if(res == null) continue;
		var useg = res.u0;
		var uray = res.u1;
		if(useg < -verb_core_Constants.EPSILON || useg > l[i] + verb_core_Constants.EPSILON) continue;
		if(minU == null || uray < minU.u) minU = new verb_core_CurveTriPoint(uray,verb_core_Vec.onRay(ray.origin,ray.dir,uray),verb_core_Vec.onRay(uvs[i],uvd[i],useg / l[i]));
		if(maxU == null || uray > maxU.u) maxU = new verb_core_CurveTriPoint(uray,verb_core_Vec.onRay(ray.origin,ray.dir,uray),verb_core_Vec.onRay(uvs[i],uvd[i],useg / l[i]));
	}
	if(maxU == null || minU == null) return null;
	return new verb_core_Interval(minU,maxU);
};
verb_eval_Intersect.mergeTriangleClipIntervals = function(clip1,clip2,mesh1,faceIndex1,mesh2,faceIndex2) {
	if(clip2.min.u > clip1.max.u + verb_core_Constants.EPSILON || clip1.min.u > clip2.max.u + verb_core_Constants.EPSILON) return null;
	var min;
	if(clip1.min.u > clip2.min.u) min = new verb_core_Pair(clip1.min,0); else min = new verb_core_Pair(clip2.min,1);
	var max;
	if(clip1.max.u < clip2.max.u) max = new verb_core_Pair(clip1.max,0); else max = new verb_core_Pair(clip2.max,1);
	var res = new verb_core_Interval(new verb_core_MeshIntersectionPoint(null,null,min.item0.point,faceIndex1,faceIndex2),new verb_core_MeshIntersectionPoint(null,null,max.item0.point,faceIndex1,faceIndex2));
	if(min.item1 == 0) {
		res.min.uv0 = min.item0.uv;
		res.min.uv1 = verb_core_Mesh.triangleUVFromPoint(mesh2,faceIndex2,min.item0.point);
	} else {
		res.min.uv0 = verb_core_Mesh.triangleUVFromPoint(mesh1,faceIndex1,min.item0.point);
		res.min.uv1 = min.item0.uv;
	}
	if(max.item1 == 0) {
		res.max.uv0 = max.item0.uv;
		res.max.uv1 = verb_core_Mesh.triangleUVFromPoint(mesh2,faceIndex2,max.item0.point);
	} else {
		res.max.uv0 = verb_core_Mesh.triangleUVFromPoint(mesh1,faceIndex1,max.item0.point);
		res.max.uv1 = max.item0.uv;
	}
	return res;
};
verb_eval_Intersect.planes = function(origin0,normal0,origin1,normal1) {
	var d = verb_core_Vec.cross(normal0,normal1);
	if(verb_core_Vec.dot(d,d) < verb_core_Constants.EPSILON) return null;
	var li = 0;
	var mi = Math.abs(d[0]);
	var m1 = Math.abs(d[1]);
	var m2 = Math.abs(d[2]);
	if(m1 > mi) {
		li = 1;
		mi = m1;
	}
	if(m2 > mi) {
		li = 2;
		mi = m2;
	}
	var a1;
	var b1;
	var a2;
	var b2;
	if(li == 0) {
		a1 = normal0[1];
		b1 = normal0[2];
		a2 = normal1[1];
		b2 = normal1[2];
	} else if(li == 1) {
		a1 = normal0[0];
		b1 = normal0[2];
		a2 = normal1[0];
		b2 = normal1[2];
	} else {
		a1 = normal0[0];
		b1 = normal0[1];
		a2 = normal1[0];
		b2 = normal1[1];
	}
	var d1 = -verb_core_Vec.dot(origin0,normal0);
	var d2 = -verb_core_Vec.dot(origin1,normal1);
	var den = a1 * b2 - b1 * a2;
	var x = (b1 * d2 - d1 * b2) / den;
	var y = (d1 * a2 - a1 * d2) / den;
	var p;
	if(li == 0) p = [0,x,y]; else if(li == 1) p = [x,0,y]; else p = [x,y,0];
	return new verb_core_Ray(p,verb_core_Vec.normalized(d));
};
verb_eval_Intersect.threePlanes = function(n0,d0,n1,d1,n2,d2) {
	var u = verb_core_Vec.cross(n1,n2);
	var den = verb_core_Vec.dot(n0,u);
	if(Math.abs(den) < verb_core_Constants.EPSILON) return null;
	var diff = verb_core_Vec.sub(verb_core_Vec.mul(d2,n1),verb_core_Vec.mul(d1,n2));
	var num = verb_core_Vec.add(verb_core_Vec.mul(d0,u),verb_core_Vec.cross(n0,diff));
	return verb_core_Vec.mul(1 / den,num);
};
verb_eval_Intersect.polylines = function(polyline0,polyline1,tol) {
	var res = verb_eval_Intersect.boundingBoxTrees(new verb_core_LazyPolylineBoundingBoxTree(polyline0),new verb_core_LazyPolylineBoundingBoxTree(polyline1),tol);
	var finalResults = [];
	var _g = 0;
	while(_g < res.length) {
		var event = res[_g];
		++_g;
		var polid0 = event.item0;
		var polid1 = event.item1;
		var inter = verb_eval_Intersect.segments(polyline0.points[polid0],polyline0.points[polid0 + 1],polyline1.points[polid1],polyline1.points[polid1 + 1],tol);
		if(inter == null) continue;
		inter.u0 = verb_core_Vec.lerp(inter.u0,[polyline0.params[polid0]],[polyline0.params[polid0 + 1]])[0];
		inter.u1 = verb_core_Vec.lerp(inter.u1,[polyline1.params[polid1]],[polyline1.params[polid1 + 1]])[0];
		finalResults.push(inter);
	}
	return finalResults;
};
verb_eval_Intersect.segments = function(a0,a1,b0,b1,tol) {
	var a1ma0 = verb_core_Vec.sub(a1,a0);
	var aN = Math.sqrt(verb_core_Vec.dot(a1ma0,a1ma0));
	var a = verb_core_Vec.mul(1 / aN,a1ma0);
	var b1mb0 = verb_core_Vec.sub(b1,b0);
	var bN = Math.sqrt(verb_core_Vec.dot(b1mb0,b1mb0));
	var b = verb_core_Vec.mul(1 / bN,b1mb0);
	var int_params = verb_eval_Intersect.rays(a0,a,b0,b);
	if(int_params != null) {
		var u0 = Math.min(Math.max(0,int_params.u0 / aN),1.0);
		var u1 = Math.min(Math.max(0,int_params.u1 / bN),1.0);
		var point0 = verb_core_Vec.onRay(a0,a1ma0,u0);
		var point1 = verb_core_Vec.onRay(b0,b1mb0,u1);
		var dist = verb_core_Vec.distSquared(point0,point1);
		if(dist < tol * tol) return new verb_core_CurveCurveIntersection(point0,point1,u0,u1);
	}
	return null;
};
verb_eval_Intersect.rays = function(a0,a,b0,b) {
	var dab = verb_core_Vec.dot(a,b);
	var dab0 = verb_core_Vec.dot(a,b0);
	var daa0 = verb_core_Vec.dot(a,a0);
	var dbb0 = verb_core_Vec.dot(b,b0);
	var dba0 = verb_core_Vec.dot(b,a0);
	var daa = verb_core_Vec.dot(a,a);
	var dbb = verb_core_Vec.dot(b,b);
	var div = daa * dbb - dab * dab;
	if(Math.abs(div) < verb_core_Constants.EPSILON) return null;
	var num = dab * (dab0 - daa0) - daa * (dbb0 - dba0);
	var w = num / div;
	var t = (dab0 - daa0 + w * dab) / daa;
	var p0 = verb_core_Vec.onRay(a0,a,t);
	var p1 = verb_core_Vec.onRay(b0,b,w);
	return new verb_core_CurveCurveIntersection(p0,p1,t,w);
};
verb_eval_Intersect.segmentWithTriangle = function(p0,p1,points,tri) {
	var v0 = points[tri[0]];
	var v1 = points[tri[1]];
	var v2 = points[tri[2]];
	var u = verb_core_Vec.sub(v1,v0);
	var v = verb_core_Vec.sub(v2,v0);
	var n = verb_core_Vec.cross(u,v);
	var dir = verb_core_Vec.sub(p1,p0);
	var w0 = verb_core_Vec.sub(p0,v0);
	var a = -verb_core_Vec.dot(n,w0);
	var b = verb_core_Vec.dot(n,dir);
	if(Math.abs(b) < verb_core_Constants.EPSILON) return null;
	var r = a / b;
	if(r < 0 || r > 1) return null;
	var pt = verb_core_Vec.add(p0,verb_core_Vec.mul(r,dir));
	var uv = verb_core_Vec.dot(u,v);
	var uu = verb_core_Vec.dot(u,u);
	var vv = verb_core_Vec.dot(v,v);
	var w = verb_core_Vec.sub(pt,v0);
	var wu = verb_core_Vec.dot(w,u);
	var wv = verb_core_Vec.dot(w,v);
	var denom = uv * uv - uu * vv;
	if(Math.abs(denom) < verb_core_Constants.EPSILON) return null;
	var s = (uv * wv - vv * wu) / denom;
	var t = (uv * wu - uu * wv) / denom;
	if(s > 1.0 + verb_core_Constants.EPSILON || t > 1.0 + verb_core_Constants.EPSILON || t < -verb_core_Constants.EPSILON || s < -verb_core_Constants.EPSILON || s + t > 1.0 + verb_core_Constants.EPSILON) return null;
	return new verb_core_TriSegmentIntersection(pt,s,t,r);
};
verb_eval_Intersect.segmentAndPlane = function(p0,p1,v0,n) {
	var denom = verb_core_Vec.dot(n,verb_core_Vec.sub(p1,p0));
	if(Math.abs(denom) < verb_core_Constants.EPSILON) return null;
	var numer = verb_core_Vec.dot(n,verb_core_Vec.sub(v0,p0));
	var p = numer / denom;
	if(p > 1.0 + verb_core_Constants.EPSILON || p < -verb_core_Constants.EPSILON) return null;
	return { p : p};
};
var verb_eval_Make = function() { };

verb_eval_Make.__name__ = ["verb","eval","Make"];
verb_eval_Make.rationalTranslationalSurface = function(profile,rail) {
	var pt0 = verb_eval_Eval.rationalCurvePoint(rail,verb_core_ArrayExtensions.first(rail.knots));
	var startu = verb_core_ArrayExtensions.first(rail.knots);
	var endu = verb_core_ArrayExtensions.last(rail.knots);
	var numSamples = 2 * rail.controlPoints.length;
	var span = (endu - startu) / (numSamples - 1);
	var crvs = [];
	var _g = 0;
	while(_g < numSamples) {
		var i = _g++;
		var pt = verb_core_Vec.sub(verb_eval_Eval.rationalCurvePoint(rail,startu + i * span),pt0);
		var crv = verb_eval_Modify.rationalCurveTransform(profile,[[1,0,0,pt[0]],[0,1,0,pt[1]],[0,0,1,pt[2]],[0,0,0,1]]);
		crvs.push(crv);
	}
	return verb_eval_Make.loftedSurface(crvs);
};
verb_eval_Make.surfaceBoundaryCurves = function(surface) {
	var crvs = [];
	var c0 = verb_eval_Make.surfaceIsocurve(surface,verb_core_ArrayExtensions.first(surface.knotsU),false);
	var c1 = verb_eval_Make.surfaceIsocurve(surface,verb_core_ArrayExtensions.last(surface.knotsU),false);
	var c2 = verb_eval_Make.surfaceIsocurve(surface,verb_core_ArrayExtensions.first(surface.knotsV),true);
	var c3 = verb_eval_Make.surfaceIsocurve(surface,verb_core_ArrayExtensions.last(surface.knotsV),true);
	return [c0,c1,c2,c3];
};
verb_eval_Make.surfaceIsocurve = function(surface,u,useV) {
	if(useV == null) useV = false;
	var knots;
	if(useV) knots = surface.knotsV; else knots = surface.knotsU;
	var degree;
	if(useV) degree = surface.degreeV; else degree = surface.degreeU;
	var knotMults = verb_eval_Analyze.knotMultiplicities(knots);
	var reqKnotIndex = -1;
	var _g1 = 0;
	var _g = knotMults.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(Math.abs(u - knotMults[i].knot) < verb_core_Constants.EPSILON) {
			reqKnotIndex = i;
			break;
		}
	}
	var numKnotsToInsert = degree + 1;
	if(reqKnotIndex >= 0) numKnotsToInsert = numKnotsToInsert - knotMults[reqKnotIndex].mult;
	var newSrf;
	if(numKnotsToInsert > 0) newSrf = verb_eval_Modify.surfaceKnotRefine(surface,verb_core_Vec.rep(numKnotsToInsert,u),useV); else newSrf = surface;
	var span = verb_eval_Eval.knotSpan(degree,u,knots);
	if(Math.abs(u - verb_core_ArrayExtensions.first(knots)) < verb_core_Constants.EPSILON) span = 0; else if(Math.abs(u - verb_core_ArrayExtensions.last(knots)) < verb_core_Constants.EPSILON) span = (useV?newSrf.controlPoints[0].length:newSrf.controlPoints.length) - 1;
	if(useV) return new verb_core_NurbsCurveData(newSrf.degreeU,newSrf.knotsU,(function($this) {
		var $r;
		var _g2 = [];
		{
			var _g11 = 0;
			var _g21 = newSrf.controlPoints;
			while(_g11 < _g21.length) {
				var row = _g21[_g11];
				++_g11;
				_g2.push(row[span]);
			}
		}
		$r = _g2;
		return $r;
	}(this)));
	return new verb_core_NurbsCurveData(newSrf.degreeV,newSrf.knotsV,newSrf.controlPoints[span]);
};
verb_eval_Make.loftedSurface = function(curves,degreeV) {
	curves = verb_eval_Modify.unifyCurveKnotVectors(curves);
	var degreeU = curves[0].degree;
	if(degreeV == null) degreeV = 3;
	if(degreeV > curves.length - 1) degreeV = curves.length - 1;
	var knotsU = curves[0].knots;
	var knotsV = [];
	var controlPoints = [];
	var _g1 = 0;
	var _g = curves[0].controlPoints.length;
	while(_g1 < _g) {
		var i = [_g1++];
		var points = curves.map((function(i) {
			return function(x) {
				return x.controlPoints[i[0]];
			};
		})(i));
		var c = verb_eval_Make.rationalInterpCurve(points,degreeV,true);
		controlPoints.push(c.controlPoints);
		knotsV = c.knots;
	}
	return new verb_core_NurbsSurfaceData(degreeU,degreeV,knotsU,knotsV,controlPoints);
};
verb_eval_Make.clonedCurve = function(curve) {
	return new verb_core_NurbsCurveData(curve.degree,curve.knots.slice(),curve.controlPoints.map(function(x) {
		return x.slice();
	}));
};
verb_eval_Make.rationalBezierCurve = function(controlPoints,weights) {
	var degree = controlPoints.length - 1;
	var knots = [];
	var _g1 = 0;
	var _g = degree + 1;
	while(_g1 < _g) {
		var i = _g1++;
		knots.push(0.0);
	}
	var _g11 = 0;
	var _g2 = degree + 1;
	while(_g11 < _g2) {
		var i1 = _g11++;
		knots.push(1.0);
	}
	if(weights == null) weights = verb_core_Vec.rep(controlPoints.length,1.0);
	return new verb_core_NurbsCurveData(degree,knots,verb_eval_Eval.homogenize1d(controlPoints,weights));
};
verb_eval_Make.fourPointSurface = function(p1,p2,p3,p4,degree) {
	if(degree == null) degree = 3;
	var degreeFloat = degree;
	var pts = [];
	var _g1 = 0;
	var _g = degree + 1;
	while(_g1 < _g) {
		var i = _g1++;
		var row = [];
		var _g3 = 0;
		var _g2 = degree + 1;
		while(_g3 < _g2) {
			var j = _g3++;
			var l = 1.0 - i / degreeFloat;
			var p1p2 = verb_core_Vec.lerp(l,p1,p2);
			var p4p3 = verb_core_Vec.lerp(l,p4,p3);
			var res = verb_core_Vec.lerp(1.0 - j / degreeFloat,p1p2,p4p3);
			res.push(1.0);
			row.push(res);
		}
		pts.push(row);
	}
	var zeros = verb_core_Vec.rep(degree + 1,0.0);
	var ones = verb_core_Vec.rep(degree + 1,1.0);
	return new verb_core_NurbsSurfaceData(degree,degree,zeros.concat(ones),zeros.concat(ones),pts);
};
verb_eval_Make.ellipseArc = function(center,xaxis,yaxis,startAngle,endAngle) {
	var xradius = verb_core_Vec.norm(xaxis);
	var yradius = verb_core_Vec.norm(yaxis);
	xaxis = verb_core_Vec.normalized(xaxis);
	yaxis = verb_core_Vec.normalized(yaxis);
	if(endAngle < startAngle) endAngle = 2.0 * Math.PI + startAngle;
	var theta = endAngle - startAngle;
	var numArcs = 0;
	if(theta <= Math.PI / 2) numArcs = 1; else if(theta <= Math.PI) numArcs = 2; else if(theta <= 3 * Math.PI / 2) numArcs = 3; else numArcs = 4;
	var dtheta = theta / numArcs;
	var n = 2 * numArcs;
	var w1 = Math.cos(dtheta / 2);
	var P0 = verb_core_Vec.add(center,verb_core_Vec.add(verb_core_Vec.mul(xradius * Math.cos(startAngle),xaxis),verb_core_Vec.mul(yradius * Math.sin(startAngle),yaxis)));
	var T0 = verb_core_Vec.sub(verb_core_Vec.mul(Math.cos(startAngle),yaxis),verb_core_Vec.mul(Math.sin(startAngle),xaxis));
	var controlPoints = [];
	var knots = verb_core_Vec.zeros1d(2 * numArcs + 3);
	var index = 0;
	var angle = startAngle;
	var weights = verb_core_Vec.zeros1d(numArcs * 2);
	controlPoints[0] = P0;
	weights[0] = 1.0;
	var _g1 = 1;
	var _g = numArcs + 1;
	while(_g1 < _g) {
		var i = _g1++;
		angle += dtheta;
		var P2 = verb_core_Vec.add(center,verb_core_Vec.add(verb_core_Vec.mul(xradius * Math.cos(angle),xaxis),verb_core_Vec.mul(yradius * Math.sin(angle),yaxis)));
		weights[index + 2] = 1;
		controlPoints[index + 2] = P2;
		var T2 = verb_core_Vec.sub(verb_core_Vec.mul(Math.cos(angle),yaxis),verb_core_Vec.mul(Math.sin(angle),xaxis));
		var inters = verb_eval_Intersect.rays(P0,verb_core_Vec.mul(1 / verb_core_Vec.norm(T0),T0),P2,verb_core_Vec.mul(1 / verb_core_Vec.norm(T2),T2));
		var P1 = verb_core_Vec.add(P0,verb_core_Vec.mul(inters.u0,T0));
		weights[index + 1] = w1;
		controlPoints[index + 1] = P1;
		index += 2;
		if(i < numArcs) {
			P0 = P2;
			T0 = T2;
		}
	}
	var j = 2 * numArcs + 1;
	var _g2 = 0;
	while(_g2 < 3) {
		var i1 = _g2++;
		knots[i1] = 0.0;
		knots[i1 + j] = 1.0;
	}
	switch(numArcs) {
	case 2:
		knots[3] = knots[4] = 0.5;
		break;
	case 3:
		knots[3] = knots[4] = 0.333333333333333315;
		knots[5] = knots[6] = 0.66666666666666663;
		break;
	case 4:
		knots[3] = knots[4] = 0.25;
		knots[5] = knots[6] = 0.5;
		knots[7] = knots[8] = 0.75;
		break;
	}
	return new verb_core_NurbsCurveData(2,knots,verb_eval_Eval.homogenize1d(controlPoints,weights));
};
verb_eval_Make.arc = function(center,xaxis,yaxis,radius,startAngle,endAngle) {
	return verb_eval_Make.ellipseArc(center,verb_core_Vec.mul(radius,verb_core_Vec.normalized(xaxis)),verb_core_Vec.mul(radius,verb_core_Vec.normalized(yaxis)),startAngle,endAngle);
};
verb_eval_Make.polyline = function(pts) {
	var knots = [0.0,0.0];
	var lsum = 0.0;
	var _g1 = 0;
	var _g = pts.length - 1;
	while(_g1 < _g) {
		var i = _g1++;
		lsum += verb_core_Vec.dist(pts[i],pts[i + 1]);
		knots.push(lsum);
	}
	knots.push(lsum);
	knots = verb_core_Vec.mul(1 / lsum,knots);
	var weights;
	var _g2 = [];
	var _g21 = 0;
	var _g11 = pts.length;
	while(_g21 < _g11) {
		var i1 = _g21++;
		_g2.push(1.0);
	}
	weights = _g2;
	return new verb_core_NurbsCurveData(1,knots,verb_eval_Eval.homogenize1d(pts.slice(0),weights));
};
verb_eval_Make.extrudedSurface = function(axis,length,profile) {
	var controlPoints = [[],[],[]];
	var weights = [[],[],[]];
	var prof_controlPoints = verb_eval_Eval.dehomogenize1d(profile.controlPoints);
	var prof_weights = verb_eval_Eval.weight1d(profile.controlPoints);
	var translation = verb_core_Vec.mul(length,axis);
	var halfTranslation = verb_core_Vec.mul(0.5 * length,axis);
	var _g1 = 0;
	var _g = prof_controlPoints.length;
	while(_g1 < _g) {
		var j = _g1++;
		controlPoints[2][j] = prof_controlPoints[j];
		controlPoints[1][j] = verb_core_Vec.add(halfTranslation,prof_controlPoints[j]);
		controlPoints[0][j] = verb_core_Vec.add(translation,prof_controlPoints[j]);
		weights[0][j] = prof_weights[j];
		weights[1][j] = prof_weights[j];
		weights[2][j] = prof_weights[j];
	}
	return new verb_core_NurbsSurfaceData(2,profile.degree,[0,0,0,1,1,1],profile.knots,verb_eval_Eval.homogenize2d(controlPoints,weights));
};
verb_eval_Make.cylindricalSurface = function(axis,xaxis,base,height,radius) {
	var yaxis = verb_core_Vec.cross(axis,xaxis);
	var angle = 2.0 * Math.PI;
	var circ = verb_eval_Make.arc(base,xaxis,yaxis,radius,0.0,2 * Math.PI);
	return verb_eval_Make.extrudedSurface(axis,height,circ);
};
verb_eval_Make.revolvedSurface = function(profile,center,axis,theta) {
	var prof_controlPoints = verb_eval_Eval.dehomogenize1d(profile.controlPoints);
	var prof_weights = verb_eval_Eval.weight1d(profile.controlPoints);
	var narcs;
	var knotsU;
	var controlPoints;
	var weights;
	if(theta <= Math.PI / 2) {
		narcs = 1;
		knotsU = verb_core_Vec.zeros1d(6 + 2 * (narcs - 1));
	} else if(theta <= Math.PI) {
		narcs = 2;
		knotsU = verb_core_Vec.zeros1d(6 + 2 * (narcs - 1));
		knotsU[3] = knotsU[4] = 0.5;
	} else if(theta <= 3 * Math.PI / 2) {
		narcs = 3;
		knotsU = verb_core_Vec.zeros1d(6 + 2 * (narcs - 1));
		knotsU[3] = knotsU[4] = 0.333333333333333315;
		knotsU[5] = knotsU[6] = 0.66666666666666663;
	} else {
		narcs = 4;
		knotsU = verb_core_Vec.zeros1d(6 + 2 * (narcs - 1));
		knotsU[3] = knotsU[4] = 0.25;
		knotsU[5] = knotsU[6] = 0.5;
		knotsU[7] = knotsU[8] = 0.75;
	}
	var dtheta = theta / narcs;
	var j = 3 + 2 * (narcs - 1);
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		knotsU[i] = 0.0;
		knotsU[j + i] = 1.0;
	}
	var n = 2 * narcs;
	var wm = Math.cos(dtheta / 2.0);
	var angle = 0.0;
	var sines = verb_core_Vec.zeros1d(narcs + 1);
	var cosines = verb_core_Vec.zeros1d(narcs + 1);
	var controlPoints1 = verb_core_Vec.zeros3d(2 * narcs + 1,prof_controlPoints.length,3);
	var weights1 = verb_core_Vec.zeros2d(2 * narcs + 1,prof_controlPoints.length);
	var _g1 = 1;
	var _g2 = narcs + 1;
	while(_g1 < _g2) {
		var i1 = _g1++;
		angle += dtheta;
		cosines[i1] = Math.cos(angle);
		sines[i1] = Math.sin(angle);
	}
	var _g11 = 0;
	var _g3 = prof_controlPoints.length;
	while(_g11 < _g3) {
		var j1 = _g11++;
		var O = verb_core_Trig.rayClosestPoint(prof_controlPoints[j1],center,axis);
		var X = verb_core_Vec.sub(prof_controlPoints[j1],O);
		var r = verb_core_Vec.norm(X);
		var Y = verb_core_Vec.cross(axis,X);
		if(r > verb_core_Constants.EPSILON) {
			X = verb_core_Vec.mul(1 / r,X);
			Y = verb_core_Vec.mul(1 / r,Y);
		}
		controlPoints1[0][j1] = prof_controlPoints[j1];
		var P0 = prof_controlPoints[j1];
		weights1[0][j1] = prof_weights[j1];
		var T0 = Y;
		var index = 0;
		var angle1 = 0.0;
		var _g31 = 1;
		var _g21 = narcs + 1;
		while(_g31 < _g21) {
			var i2 = _g31++;
			var P2;
			if(r == 0) P2 = O; else P2 = verb_core_Vec.add(O,verb_core_Vec.add(verb_core_Vec.mul(r * cosines[i2],X),verb_core_Vec.mul(r * sines[i2],Y)));
			controlPoints1[index + 2][j1] = P2;
			weights1[index + 2][j1] = prof_weights[j1];
			var T2 = verb_core_Vec.sub(verb_core_Vec.mul(cosines[i2],Y),verb_core_Vec.mul(sines[i2],X));
			if(r == 0) controlPoints1[index + 1][j1] = O; else {
				var inters = verb_eval_Intersect.rays(P0,verb_core_Vec.mul(1 / verb_core_Vec.norm(T0),T0),P2,verb_core_Vec.mul(1 / verb_core_Vec.norm(T2),T2));
				var P1 = verb_core_Vec.add(P0,verb_core_Vec.mul(inters.u0,T0));
				controlPoints1[index + 1][j1] = P1;
			}
			weights1[index + 1][j1] = wm * prof_weights[j1];
			index += 2;
			if(i2 < narcs) {
				P0 = P2;
				T0 = T2;
			}
		}
	}
	return new verb_core_NurbsSurfaceData(2,profile.degree,knotsU,profile.knots,verb_eval_Eval.homogenize2d(controlPoints1,weights1));
};
verb_eval_Make.sphericalSurface = function(center,axis,xaxis,radius) {
	var arc = verb_eval_Make.arc(center,verb_core_Vec.mul(-1.0,axis),xaxis,radius,0.0,Math.PI);
	return verb_eval_Make.revolvedSurface(arc,center,axis,2 * Math.PI);
};
verb_eval_Make.conicalSurface = function(axis,xaxis,base,height,radius) {
	var angle = 2 * Math.PI;
	var prof_degree = 1;
	var prof_ctrl_pts = [verb_core_Vec.add(base,verb_core_Vec.mul(height,axis)),verb_core_Vec.add(base,verb_core_Vec.mul(radius,xaxis))];
	var prof_knots = [0.0,0.0,1.0,1.0];
	var prof_weights = [1.0,1.0];
	var prof = new verb_core_NurbsCurveData(prof_degree,prof_knots,verb_eval_Eval.homogenize1d(prof_ctrl_pts,prof_weights));
	return verb_eval_Make.revolvedSurface(prof,base,axis,angle);
};
verb_eval_Make.rationalInterpCurve = function(points,degree,homogeneousPoints,start_tangent,end_tangent) {
	if(homogeneousPoints == null) homogeneousPoints = false;
	if(degree == null) degree = 3;
	if(points.length < degree + 1) throw new Error("You need to supply at least degree + 1 points! You only supplied " + points.length + " points.");
	var us = [0.0];
	var _g1 = 1;
	var _g = points.length;
	while(_g1 < _g) {
		var i = _g1++;
		var chord = verb_core_Vec.norm(verb_core_Vec.sub(points[i],points[i - 1]));
		var last = us[us.length - 1];
		us.push(last + chord);
	}
	var max = us[us.length - 1];
	var _g11 = 0;
	var _g2 = us.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		us[i1] = us[i1] / max;
	}
	var knotsStart = verb_core_Vec.rep(degree + 1,0.0);
	var hasTangents = start_tangent != null && end_tangent != null;
	var start;
	if(hasTangents) start = 0; else start = 1;
	var end;
	if(hasTangents) end = us.length - degree + 1; else end = us.length - degree;
	var _g3 = start;
	while(_g3 < end) {
		var i2 = _g3++;
		var weightSums = 0.0;
		var _g12 = 0;
		while(_g12 < degree) {
			var j = _g12++;
			weightSums += us[i2 + j];
		}
		knotsStart.push(1 / degree * weightSums);
	}
	var knots = knotsStart.concat(verb_core_Vec.rep(degree + 1,1.0));
	var A = [];
	var n;
	if(hasTangents) n = points.length + 1; else n = points.length - 1;
	var lst;
	if(hasTangents) lst = 1; else lst = 0;
	var ld;
	if(hasTangents) ld = points.length - (degree - 1); else ld = points.length - (degree + 1);
	var _g4 = 0;
	while(_g4 < us.length) {
		var u = us[_g4];
		++_g4;
		var span = verb_eval_Eval.knotSpanGivenN(n,degree,u,knots);
		var basisFuncs = verb_eval_Eval.basisFunctionsGivenKnotSpanIndex(span,u,degree,knots);
		var ls = span - degree;
		var rowstart = verb_core_Vec.zeros1d(ls);
		var rowend = verb_core_Vec.zeros1d(ld - ls);
		A.push(rowstart.concat(basisFuncs).concat(rowend));
	}
	if(hasTangents) {
		var ln = A[0].length - 2;
		var tanRow0 = [-1.0,1.0].concat(verb_core_Vec.zeros1d(ln));
		var tanRow1 = verb_core_Vec.zeros1d(ln).concat([-1.0,1.0]);
		verb_core_ArrayExtensions.spliceAndInsert(A,1,0,tanRow0);
		verb_core_ArrayExtensions.spliceAndInsert(A,A.length - 1,0,tanRow1);
	}
	var dim = points[0].length;
	var xs = [];
	var mult1 = (1 - knots[knots.length - degree - 2]) / degree;
	var mult0 = knots[degree + 1] / degree;
	var _g5 = 0;
	while(_g5 < dim) {
		var i3 = [_g5++];
		var b;
		if(!hasTangents) b = points.map((function(i3) {
			return function(x1) {
				return x1[i3[0]];
			};
		})(i3)); else {
			b = [points[0][i3[0]]];
			b.push(mult0 * start_tangent[i3[0]]);
			var _g21 = 1;
			var _g13 = points.length - 1;
			while(_g21 < _g13) {
				var j1 = _g21++;
				b.push(points[j1][i3[0]]);
			}
			b.push(mult1 * end_tangent[i3[0]]);
			b.push(verb_core_ArrayExtensions.last(points)[i3[0]]);
		}
		var x = verb_core_Mat.solve(A,b);
		xs.push(x);
	}
	var controlPts = verb_core_Mat.transpose(xs);
	if(!homogeneousPoints) {
		var weights = verb_core_Vec.rep(controlPts.length,1.0);
		controlPts = verb_eval_Eval.homogenize1d(controlPts,weights);
	}
	return new verb_core_NurbsCurveData(degree,knots,controlPts);
};
var verb_eval_Modify = function() { };

verb_eval_Modify.__name__ = ["verb","eval","Modify"];
verb_eval_Modify.curveReverse = function(curve) {
	return new verb_core_NurbsCurveData(curve.degree,verb_eval_Modify.knotsReverse(curve.knots),verb_core_ArrayExtensions.reversed(curve.controlPoints));
};
verb_eval_Modify.surfaceReverse = function(surface,useV) {
	if(useV == null) useV = false;
	if(useV) return new verb_core_NurbsSurfaceData(surface.degreeU,surface.degreeV,surface.knotsU,verb_eval_Modify.knotsReverse(surface.knotsV),(function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			var _g2 = surface.controlPoints;
			while(_g1 < _g2.length) {
				var row = _g2[_g1];
				++_g1;
				_g.push(verb_core_ArrayExtensions.reversed(row));
			}
		}
		$r = _g;
		return $r;
	}(this)));
	return new verb_core_NurbsSurfaceData(surface.degreeU,surface.degreeV,verb_eval_Modify.knotsReverse(surface.knotsU),surface.knotsV,verb_core_ArrayExtensions.reversed(surface.controlPoints));
};
verb_eval_Modify.knotsReverse = function(knots) {
	var min = verb_core_ArrayExtensions.first(knots);
	var max = verb_core_ArrayExtensions.last(knots);
	var l = [min];
	var len = knots.length;
	var _g = 1;
	while(_g < len) {
		var i = _g++;
		l.push(l[i - 1] + (knots[len - i] - knots[len - i - 1]));
	}
	return l;
};
verb_eval_Modify.unifyCurveKnotVectors = function(curves) {
	curves = curves.map(verb_eval_Make.clonedCurve);
	var maxDegree = Lambda.fold(curves,function(x,a) {
		return verb_eval_Modify.imax(x.degree,a);
	},0);
	var _g1 = 0;
	var _g = curves.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(curves[i].degree < maxDegree) curves[i] = verb_eval_Modify.curveElevateDegree(curves[i],maxDegree);
	}
	var knotIntervals;
	var _g2 = [];
	var _g11 = 0;
	while(_g11 < curves.length) {
		var c = curves[_g11];
		++_g11;
		_g2.push(new verb_core_Interval(verb_core_ArrayExtensions.first(c.knots),verb_core_ArrayExtensions.last(c.knots)));
	}
	knotIntervals = _g2;
	var _g21 = 0;
	var _g12 = curves.length;
	while(_g21 < _g12) {
		var i1 = _g21++;
		var min = [knotIntervals[i1].min];
		curves[i1].knots = curves[i1].knots.map((function(min) {
			return function(x4) {
				return x4 - min[0];
			};
		})(min));
	}
	var knotSpans = knotIntervals.map(function(x1) {
		return x1.max - x1.min;
	});
	var maxKnotSpan = Lambda.fold(knotSpans,function(x2,a1) {
		return Math.max(x2,a1);
	},0.0);
	var _g22 = 0;
	var _g13 = curves.length;
	while(_g22 < _g13) {
		var i2 = _g22++;
		var scale = [maxKnotSpan / knotSpans[i2]];
		curves[i2].knots = curves[i2].knots.map((function(scale) {
			return function(x5) {
				return x5 * scale[0];
			};
		})(scale));
	}
	var mergedKnots = Lambda.fold(curves,function(x3,a2) {
		return verb_core_Vec.sortedSetUnion(x3.knots,a2);
	},[]);
	var _g23 = 0;
	var _g14 = curves.length;
	while(_g23 < _g14) {
		var i3 = _g23++;
		var rem = verb_core_Vec.sortedSetSub(mergedKnots,curves[i3].knots);
		if(rem.length == 0) curves[i3] = curves[i3];
		curves[i3] = verb_eval_Modify.curveKnotRefine(curves[i3],rem);
	}
	return curves;
};
verb_eval_Modify.imin = function(a,b) {
	if(a < b) return a; else return b;
};
verb_eval_Modify.imax = function(a,b) {
	if(a > b) return a; else return b;
};
verb_eval_Modify.curveElevateDegree = function(curve,finalDegree) {
	if(finalDegree <= curve.degree) return curve;
	var n = curve.knots.length - curve.degree - 2;
	var newDegree = curve.degree;
	var knots = curve.knots;
	var controlPoints = curve.controlPoints;
	var degreeInc = finalDegree - curve.degree;
	var dim = curve.controlPoints[0].length;
	var bezalfs = verb_core_Vec.zeros2d(newDegree + degreeInc + 1,newDegree + 1);
	var bpts = [];
	var ebpts = [];
	var Nextbpts = [];
	var alphas = [];
	var m = n + newDegree + 1;
	var ph = finalDegree;
	var ph2 = Math.floor(ph / 2);
	var Qw = [];
	var Uh = [];
	var nh;
	bezalfs[0][0] = 1.0;
	bezalfs[ph][newDegree] = 1.0;
	var _g1 = 1;
	var _g = ph2 + 1;
	while(_g1 < _g) {
		var i = _g1++;
		var inv = 1.0 / verb_core_Binomial.get(ph,i);
		var mpi = verb_eval_Modify.imin(newDegree,i);
		var _g3 = verb_eval_Modify.imax(0,i - degreeInc);
		var _g2 = mpi + 1;
		while(_g3 < _g2) {
			var j = _g3++;
			bezalfs[i][j] = inv * verb_core_Binomial.get(newDegree,j) * verb_core_Binomial.get(degreeInc,i - j);
		}
	}
	var _g4 = ph2 + 1;
	while(_g4 < ph) {
		var i1 = _g4++;
		var mpi1 = verb_eval_Modify.imin(newDegree,i1);
		var _g21 = verb_eval_Modify.imax(0,i1 - degreeInc);
		var _g11 = mpi1 + 1;
		while(_g21 < _g11) {
			var j1 = _g21++;
			bezalfs[i1][j1] = bezalfs[ph - i1][newDegree - j1];
		}
	}
	var mh = ph;
	var kind = ph + 1;
	var r = -1;
	var a = newDegree;
	var b = newDegree + 1;
	var cind = 1;
	var ua = knots[0];
	Qw[0] = controlPoints[0];
	var _g12 = 0;
	var _g5 = ph + 1;
	while(_g12 < _g5) {
		var i2 = _g12++;
		Uh[i2] = ua;
	}
	var _g13 = 0;
	var _g6 = newDegree + 1;
	while(_g13 < _g6) {
		var i3 = _g13++;
		bpts[i3] = controlPoints[i3];
	}
	while(b < m) {
		var i4 = b;
		while(b < m && knots[b] == knots[b + 1]) b = b + 1;
		var mul = b - i4 + 1;
		var mh1 = mh + mul + degreeInc;
		var ub = knots[b];
		var oldr = r;
		r = newDegree - mul;
		var lbz;
		if(oldr > 0) lbz = Math.floor((oldr + 2) / 2); else lbz = 1;
		var rbz;
		if(r > 0) rbz = Math.floor(ph - (r + 1) / 2); else rbz = ph;
		if(r > 0) {
			var numer = ub - ua;
			var alfs = [];
			var k = newDegree;
			while(k > mul) {
				alfs[k - mul - 1] = numer / (knots[a + k] - ua);
				k--;
			}
			var _g14 = 1;
			var _g7 = r + 1;
			while(_g14 < _g7) {
				var j2 = _g14++;
				var save = r - j2;
				var s = mul + j2;
				var k1 = newDegree;
				while(k1 >= s) {
					bpts[k1] = verb_core_Vec.add(verb_core_Vec.mul(alfs[k1 - s],bpts[k1]),verb_core_Vec.mul(1.0 - alfs[k1 - s],bpts[k1 - 1]));
					k1--;
				}
				Nextbpts[save] = bpts[newDegree];
			}
		}
		var _g15 = lbz;
		var _g8 = ph + 1;
		while(_g15 < _g8) {
			var i5 = _g15++;
			ebpts[i5] = verb_core_Vec.zeros1d(dim);
			var mpi2 = verb_eval_Modify.imin(newDegree,i5);
			var _g31 = verb_eval_Modify.imax(0,i5 - degreeInc);
			var _g22 = mpi2 + 1;
			while(_g31 < _g22) {
				var j3 = _g31++;
				ebpts[i5] = verb_core_Vec.add(ebpts[i5],verb_core_Vec.mul(bezalfs[i5][j3],bpts[j3]));
			}
		}
		if(oldr > 1) {
			var first = kind - 2;
			var last = kind;
			var den = ub - ua;
			var bet = (ub - Uh[kind - 1]) / den;
			var _g9 = 1;
			while(_g9 < oldr) {
				var tr = _g9++;
				var i6 = first;
				var j4 = last;
				var kj = j4 - kind + 1;
				while(j4 - i6 > tr) {
					if(i6 < cind) {
						var alf = (ub - Uh[i6]) / (ua - Uh[i6]);
						Qw[i6] = verb_core_Vec.lerp(alf,Qw[i6],Qw[i6 - 1]);
					}
					if(j4 >= lbz) {
						if(j4 - tr <= kind - ph + oldr) {
							var gam = (ub - Uh[j4 - tr]) / den;
							ebpts[kj] = verb_core_Vec.lerp(gam,ebpts[kj],ebpts[kj + 1]);
						}
					} else ebpts[kj] = verb_core_Vec.lerp(bet,ebpts[kj],ebpts[kj + 1]);
					i6 = i6 + 1;
					j4 = j4 - 1;
					kj = kj - 1;
				}
				first = first - 1;
				last = last + 1;
			}
		}
		if(a != newDegree) {
			var _g16 = 0;
			var _g10 = ph - oldr;
			while(_g16 < _g10) {
				var i7 = _g16++;
				Uh[kind] = ua;
				kind = kind + 1;
			}
		}
		var _g17 = lbz;
		var _g18 = rbz + 1;
		while(_g17 < _g18) {
			var j5 = _g17++;
			Qw[cind] = ebpts[j5];
			cind = cind + 1;
		}
		if(b < m) {
			var _g19 = 0;
			while(_g19 < r) {
				var j6 = _g19++;
				bpts[j6] = Nextbpts[j6];
			}
			var _g110 = r;
			var _g20 = newDegree + 1;
			while(_g110 < _g20) {
				var j7 = _g110++;
				bpts[j7] = controlPoints[b - newDegree + j7];
			}
			a = b;
			b = b + 1;
			ua = ub;
		} else {
			var _g111 = 0;
			var _g23 = ph + 1;
			while(_g111 < _g23) {
				var i8 = _g111++;
				Uh[kind + i8] = ub;
			}
		}
	}
	nh = mh - ph - 1;
	return new verb_core_NurbsCurveData(finalDegree,Uh,Qw);
};
verb_eval_Modify.rationalSurfaceTransform = function(surface,mat) {
	var pts = verb_eval_Eval.dehomogenize2d(surface.controlPoints);
	var _g1 = 0;
	var _g = pts.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = 0;
		var _g2 = pts[i].length;
		while(_g3 < _g2) {
			var j = _g3++;
			var homoPt = pts[i][j];
			homoPt.push(1.0);
			pts[i][j] = verb_core_Mat.dot(mat,homoPt).slice(0,homoPt.length - 1);
		}
	}
	return new verb_core_NurbsSurfaceData(surface.degreeU,surface.degreeV,surface.knotsU.slice(),surface.knotsV.slice(),verb_eval_Eval.homogenize2d(pts,verb_eval_Eval.weight2d(surface.controlPoints)));
};
verb_eval_Modify.rationalCurveTransform = function(curve,mat) {
	var pts = verb_eval_Eval.dehomogenize1d(curve.controlPoints);
	var _g1 = 0;
	var _g = pts.length;
	while(_g1 < _g) {
		var i = _g1++;
		var homoPt = pts[i];
		homoPt.push(1.0);
		pts[i] = verb_core_Mat.dot(mat,homoPt).slice(0,homoPt.length - 1);
	}
	return new verb_core_NurbsCurveData(curve.degree,curve.knots.slice(),verb_eval_Eval.homogenize1d(pts,verb_eval_Eval.weight1d(curve.controlPoints)));
};
verb_eval_Modify.surfaceKnotRefine = function(surface,knotsToInsert,useV) {
	var newPts = [];
	var knots;
	var degree;
	var ctrlPts;
	if(!useV) {
		ctrlPts = verb_core_Mat.transpose(surface.controlPoints);
		knots = surface.knotsU;
		degree = surface.degreeU;
	} else {
		ctrlPts = surface.controlPoints;
		knots = surface.knotsV;
		degree = surface.degreeV;
	}
	var c = null;
	var _g = 0;
	while(_g < ctrlPts.length) {
		var cptrow = ctrlPts[_g];
		++_g;
		c = verb_eval_Modify.curveKnotRefine(new verb_core_NurbsCurveData(degree,knots,cptrow),knotsToInsert);
		newPts.push(c.controlPoints);
	}
	var newknots = c.knots;
	if(!useV) {
		newPts = verb_core_Mat.transpose(newPts);
		return new verb_core_NurbsSurfaceData(surface.degreeU,surface.degreeV,newknots,surface.knotsV.slice(),newPts);
	} else return new verb_core_NurbsSurfaceData(surface.degreeU,surface.degreeV,surface.knotsU.slice(),newknots,newPts);
};
verb_eval_Modify.decomposeCurveIntoBeziers = function(curve) {
	var degree = curve.degree;
	var controlPoints = curve.controlPoints;
	var knots = curve.knots;
	var knotmults = verb_eval_Analyze.knotMultiplicities(knots);
	var reqMult = degree + 1;
	var _g = 0;
	while(_g < knotmults.length) {
		var knotmult = knotmults[_g];
		++_g;
		if(knotmult.mult < reqMult) {
			var knotsInsert = verb_core_Vec.rep(reqMult - knotmult.mult,knotmult.knot);
			var res = verb_eval_Modify.curveKnotRefine(new verb_core_NurbsCurveData(degree,knots,controlPoints),knotsInsert);
			knots = res.knots;
			controlPoints = res.controlPoints;
		}
	}
	var numCrvs = knots.length / reqMult - 1;
	var crvKnotLength = reqMult * 2;
	var crvs = [];
	var i = 0;
	while(i < controlPoints.length) {
		var kts = knots.slice(i,i + crvKnotLength);
		var pts = controlPoints.slice(i,i + reqMult);
		crvs.push(new verb_core_NurbsCurveData(degree,kts,pts));
		i += reqMult;
	}
	return crvs;
};
verb_eval_Modify.curveKnotRefine = function(curve,knotsToInsert) {
	if(knotsToInsert.length == 0) return verb_eval_Make.clonedCurve(curve);
	var degree = curve.degree;
	var controlPoints = curve.controlPoints;
	var knots = curve.knots;
	var n = controlPoints.length - 1;
	var m = n + degree + 1;
	var r = knotsToInsert.length - 1;
	var a = verb_eval_Eval.knotSpan(degree,knotsToInsert[0],knots);
	var b = verb_eval_Eval.knotSpan(degree,knotsToInsert[r],knots);
	var controlPoints_post = [];
	var knots_post = [];
	var _g1 = 0;
	var _g = a - degree + 1;
	while(_g1 < _g) {
		var i1 = _g1++;
		controlPoints_post[i1] = controlPoints[i1];
	}
	var _g11 = b - 1;
	var _g2 = n + 1;
	while(_g11 < _g2) {
		var i2 = _g11++;
		controlPoints_post[i2 + r + 1] = controlPoints[i2];
	}
	var _g12 = 0;
	var _g3 = a + 1;
	while(_g12 < _g3) {
		var i3 = _g12++;
		knots_post[i3] = knots[i3];
	}
	var _g13 = b + degree;
	var _g4 = m + 1;
	while(_g13 < _g4) {
		var i4 = _g13++;
		knots_post[i4 + r + 1] = knots[i4];
	}
	var i = b + degree - 1;
	var k = b + degree + r;
	var j = r;
	while(j >= 0) {
		while(knotsToInsert[j] <= knots[i] && i > a) {
			controlPoints_post[k - degree - 1] = controlPoints[i - degree - 1];
			knots_post[k] = knots[i];
			k = k - 1;
			i = i - 1;
		}
		controlPoints_post[k - degree - 1] = controlPoints_post[k - degree];
		var _g14 = 1;
		var _g5 = degree + 1;
		while(_g14 < _g5) {
			var l = _g14++;
			var ind = k - degree + l;
			var alfa = knots_post[k + l] - knotsToInsert[j];
			if(Math.abs(alfa) < verb_core_Constants.EPSILON) controlPoints_post[ind - 1] = controlPoints_post[ind]; else {
				alfa = alfa / (knots_post[k + l] - knots[i - degree + l]);
				controlPoints_post[ind - 1] = verb_core_Vec.add(verb_core_Vec.mul(alfa,controlPoints_post[ind - 1]),verb_core_Vec.mul(1.0 - alfa,controlPoints_post[ind]));
			}
		}
		knots_post[k] = knotsToInsert[j];
		k = k - 1;
		j--;
	}
	return new verb_core_NurbsCurveData(degree,knots_post,controlPoints_post);
};
verb_eval_Modify.curveKnotInsert = function(curve,u,r) {
	var degree = curve.degree;
	var controlPoints = curve.controlPoints;
	var knots = curve.knots;
	var s = 0;
	var num_pts = controlPoints.length;
	var k = verb_eval_Eval.knotSpan(degree,u,knots);
	var num_pts_post = num_pts + r;
	var controlPoints_temp = [];
	var knots_post = [];
	var controlPoints_post = [];
	var i = 0;
	var _g1 = 1;
	var _g = k + 1;
	while(_g1 < _g) {
		var i1 = _g1++;
		knots_post[i1] = knots[i1];
	}
	var _g11 = 1;
	var _g2 = r + 1;
	while(_g11 < _g2) {
		var i2 = _g11++;
		knots_post[k + i2] = u;
	}
	var _g12 = k + 1;
	var _g3 = knots.length;
	while(_g12 < _g3) {
		var i3 = _g12++;
		knots_post[i3 + r] = knots[i3];
	}
	var _g13 = 0;
	var _g4 = k - degree + 1;
	while(_g13 < _g4) {
		var i4 = _g13++;
		controlPoints_post[i4] = controlPoints[i4];
	}
	var _g5 = k - s;
	while(_g5 < num_pts) {
		var i5 = _g5++;
		controlPoints_post[i5 + r] = controlPoints[i5];
	}
	var _g14 = 0;
	var _g6 = degree - s + 1;
	while(_g14 < _g6) {
		var i6 = _g14++;
		controlPoints_temp[i6] = controlPoints[k - degree + i6];
	}
	var L = 0;
	var alpha = 0;
	var _g15 = 1;
	var _g7 = r + 1;
	while(_g15 < _g7) {
		var j = _g15++;
		L = k - degree + j;
		var _g31 = 0;
		var _g21 = degree - j - s + 1;
		while(_g31 < _g21) {
			var i7 = _g31++;
			alpha = (u - knots[L + i7]) / (knots[i7 + k + 1] - knots[L + i7]);
			controlPoints_temp[i7] = verb_core_Vec.add(verb_core_Vec.mul(alpha,controlPoints_temp[i7 + 1]),verb_core_Vec.mul(1.0 - alpha,controlPoints_temp[i7]));
		}
		controlPoints_post[L] = controlPoints_temp[0];
		controlPoints_post[k + r - j - s] = controlPoints_temp[degree - j - s];
	}
	var _g16 = L + 1;
	var _g8 = k - s;
	while(_g16 < _g8) {
		var i8 = _g16++;
		controlPoints_post[i8] = controlPoints_temp[i8 - L];
	}
	return new verb_core_NurbsCurveData(degree,knots_post,controlPoints_post);
};
var verb_eval_Tess = function() { };

verb_eval_Tess.__name__ = ["verb","eval","Tess"];
verb_eval_Tess.rationalCurveRegularSample = function(curve,numSamples,includeU) {
	return verb_eval_Tess.rationalCurveRegularSampleRange(curve,curve.knots[0],verb_core_ArrayExtensions.last(curve.knots),numSamples,includeU);
};
verb_eval_Tess.rationalCurveRegularSampleRange = function(curve,start,end,numSamples,includeU) {
	if(numSamples < 1) numSamples = 2;
	var p = [];
	var span = (end - start) / (numSamples - 1);
	var u = 0;
	var _g = 0;
	while(_g < numSamples) {
		var i = _g++;
		u = start + span * i;
		if(includeU) p.push([u].concat(verb_eval_Eval.rationalCurvePoint(curve,u))); else p.push(verb_eval_Eval.rationalCurvePoint(curve,u));
	}
	return p;
};
verb_eval_Tess.rationalCurveAdaptiveSample = function(curve,tol,includeU) {
	if(includeU == null) includeU = false;
	if(tol == null) tol = 1e-6;
	if(curve.degree == 1) {
		if(!includeU) return curve.controlPoints.map(verb_eval_Eval.dehomogenize); else {
			var _g = [];
			var _g2 = 0;
			var _g1 = curve.controlPoints.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push([curve.knots[i + 1]].concat(verb_eval_Eval.dehomogenize(curve.controlPoints[i])));
			}
			return _g;
		}
	}
	return verb_eval_Tess.rationalCurveAdaptiveSampleRange(curve,curve.knots[0],verb_core_ArrayExtensions.last(curve.knots),tol,includeU);
};
verb_eval_Tess.rationalCurveAdaptiveSampleRange = function(curve,start,end,tol,includeU) {
	var p1 = verb_eval_Eval.rationalCurvePoint(curve,start);
	var p3 = verb_eval_Eval.rationalCurvePoint(curve,end);
	var t = 0.5 + 0.2 * Math.random();
	var mid = start + (end - start) * t;
	var p2 = verb_eval_Eval.rationalCurvePoint(curve,mid);
	var diff = verb_core_Vec.sub(p1,p3);
	var diff2 = verb_core_Vec.sub(p1,p2);
	if(verb_core_Vec.dot(diff,diff) < tol && verb_core_Vec.dot(diff2,diff2) > tol || !verb_core_Trig.threePointsAreFlat(p1,p2,p3,tol)) {
		var exact_mid = start + (end - start) * 0.5;
		var left_pts = verb_eval_Tess.rationalCurveAdaptiveSampleRange(curve,start,exact_mid,tol,includeU);
		var right_pts = verb_eval_Tess.rationalCurveAdaptiveSampleRange(curve,exact_mid,end,tol,includeU);
		return left_pts.slice(0,-1).concat(right_pts);
	} else if(includeU) return [[start].concat(p1),[end].concat(p3)]; else return [p1,p3];
};
verb_eval_Tess.rationalSurfaceNaive = function(surface,divs_u,divs_v) {
	if(divs_u < 1) divs_u = 1;
	if(divs_v < 1) divs_v = 1;
	var degreeU = surface.degreeU;
	var degreeV = surface.degreeV;
	var controlPoints = surface.controlPoints;
	var knotsU = surface.knotsU;
	var knotsV = surface.knotsV;
	var u_span = verb_core_ArrayExtensions.last(knotsU) - knotsU[0];
	var v_span = verb_core_ArrayExtensions.last(knotsV) - knotsV[0];
	var span_u = u_span / divs_u;
	var span_v = v_span / divs_v;
	var points = [];
	var uvs = [];
	var normals = [];
	var _g1 = 0;
	var _g = divs_u + 1;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = 0;
		var _g2 = divs_v + 1;
		while(_g3 < _g2) {
			var j = _g3++;
			var pt_u = i * span_u;
			var pt_v = j * span_v;
			uvs.push([pt_u,pt_v]);
			var derivs = verb_eval_Eval.rationalSurfaceDerivatives(surface,pt_u,pt_v,1);
			var pt = derivs[0][0];
			points.push(pt);
			var normal = verb_core_Vec.normalized(verb_core_Vec.cross(derivs[1][0],derivs[0][1]));
			normals.push(normal);
		}
	}
	var faces = [];
	var _g4 = 0;
	while(_g4 < divs_u) {
		var i1 = _g4++;
		var _g11 = 0;
		while(_g11 < divs_v) {
			var j1 = _g11++;
			var a_i = i1 * (divs_v + 1) + j1;
			var b_i = (i1 + 1) * (divs_v + 1) + j1;
			var c_i = b_i + 1;
			var d_i = a_i + 1;
			var abc = [a_i,b_i,c_i];
			var acd = [a_i,c_i,d_i];
			faces.push(abc);
			faces.push(acd);
		}
	}
	return new verb_core_MeshData(faces,points,normals,uvs);
};
verb_eval_Tess.divideRationalSurfaceAdaptive = function(surface,options) {
	if(options == null) options = new verb_eval_AdaptiveRefinementOptions();
	if(options.minDivsU != null) options.minDivsU = options.minDivsU; else options.minDivsU = 1;
	if(options.minDivsV != null) options.minDivsU = options.minDivsV; else options.minDivsU = 1;
	if(options.refine != null) options.refine = options.refine; else options.refine = true;
	var minU = (surface.controlPoints.length - 1) * 2;
	var minV = (surface.controlPoints[0].length - 1) * 2;
	var divsU;
	if(options.minDivsU > minU) divsU = options.minDivsU = options.minDivsU; else divsU = options.minDivsU = minU;
	var divsV;
	if(options.minDivsV > minV) divsV = options.minDivsV = options.minDivsV; else divsV = options.minDivsV = minV;
	var umax = verb_core_ArrayExtensions.last(surface.knotsU);
	var umin = surface.knotsU[0];
	var vmax = verb_core_ArrayExtensions.last(surface.knotsV);
	var vmin = surface.knotsV[0];
	var du = (umax - umin) / divsU;
	var dv = (vmax - vmin) / divsV;
	var divs = [];
	var pts = [];
	var _g1 = 0;
	var _g = divsV + 1;
	while(_g1 < _g) {
		var i = _g1++;
		var ptrow = [];
		var _g3 = 0;
		var _g2 = divsU + 1;
		while(_g3 < _g2) {
			var j = _g3++;
			var u = umin + du * j;
			var v = vmin + dv * i;
			var ds = verb_eval_Eval.rationalSurfaceDerivatives(surface,u,v,1);
			var norm = verb_core_Vec.normalized(verb_core_Vec.cross(ds[0][1],ds[1][0]));
			ptrow.push(new verb_core_SurfacePoint(ds[0][0],norm,[u,v],-1,verb_core_Vec.isZero(norm)));
		}
		pts.push(ptrow);
	}
	var _g4 = 0;
	while(_g4 < divsV) {
		var i1 = _g4++;
		var _g11 = 0;
		while(_g11 < divsU) {
			var j1 = _g11++;
			var corners = [pts[divsV - i1 - 1][j1],pts[divsV - i1 - 1][j1 + 1],pts[divsV - i1][j1 + 1],pts[divsV - i1][j1]];
			divs.push(new verb_eval_AdaptiveRefinementNode(surface,corners));
		}
	}
	if(!options.refine) return divs;
	var _g5 = 0;
	while(_g5 < divsV) {
		var i2 = _g5++;
		var _g12 = 0;
		while(_g12 < divsU) {
			var j2 = _g12++;
			var ci = i2 * divsU + j2;
			var n = verb_eval_Tess.north(ci,i2,j2,divsU,divsV,divs);
			var e = verb_eval_Tess.east(ci,i2,j2,divsU,divsV,divs);
			var s = verb_eval_Tess.south(ci,i2,j2,divsU,divsV,divs);
			var w = verb_eval_Tess.west(ci,i2,j2,divsU,divsV,divs);
			divs[ci].neighbors = [s,e,n,w];
			divs[ci].divide(options);
		}
	}
	return divs;
};
verb_eval_Tess.north = function(index,i,j,divsU,divsV,divs) {
	if(i == 0) return null;
	return divs[index - divsU];
};
verb_eval_Tess.south = function(index,i,j,divsU,divsV,divs) {
	if(i == divsV - 1) return null;
	return divs[index + divsU];
};
verb_eval_Tess.east = function(index,i,j,divsU,divsV,divs) {
	if(j == divsU - 1) return null;
	return divs[index + 1];
};
verb_eval_Tess.west = function(index,i,j,divsU,divsV,divs) {
	if(j == 0) return null;
	return divs[index - 1];
};
verb_eval_Tess.triangulateAdaptiveRefinementNodeTree = function(arrTree) {
	var mesh = verb_core_MeshData.empty();
	var _g = 0;
	while(_g < arrTree.length) {
		var x = arrTree[_g];
		++_g;
		x.triangulate(mesh);
	}
	return mesh;
};
verb_eval_Tess.rationalSurfaceAdaptive = function(surface,options) {
	if(options != null) options = options; else options = new verb_eval_AdaptiveRefinementOptions();
	var arrTrees = verb_eval_Tess.divideRationalSurfaceAdaptive(surface,options);
	return verb_eval_Tess.triangulateAdaptiveRefinementNodeTree(arrTrees);
};
var verb_eval_AdaptiveRefinementOptions = function() {
	this.minDivsV = 1;
	this.minDivsU = 1;
	this.refine = true;
	this.maxDepth = 10;
	this.minDepth = 0;
	this.normTol = 2.5e-2;
};

verb_eval_AdaptiveRefinementOptions.__name__ = ["verb","eval","AdaptiveRefinementOptions"];
verb_eval_AdaptiveRefinementOptions.prototype = {
	__class__: verb_eval_AdaptiveRefinementOptions
};
var verb_eval_AdaptiveRefinementNode = function(srf,corners,neighbors) {
	this.srf = srf;
	if(neighbors == null) this.neighbors = [null,null,null,null]; else this.neighbors = neighbors;
	this.corners = corners;
	if(this.corners == null) {
		var u0 = srf.knotsU[0];
		var u1 = verb_core_ArrayExtensions.last(srf.knotsU);
		var v0 = srf.knotsV[0];
		var v1 = verb_core_ArrayExtensions.last(srf.knotsV);
		this.corners = [verb_core_SurfacePoint.fromUv(u0,v0),verb_core_SurfacePoint.fromUv(u1,v0),verb_core_SurfacePoint.fromUv(u1,v1),verb_core_SurfacePoint.fromUv(u0,v1)];
	}
};

verb_eval_AdaptiveRefinementNode.__name__ = ["verb","eval","AdaptiveRefinementNode"];
verb_eval_AdaptiveRefinementNode.prototype = {
	isLeaf: function() {
		return this.children == null;
	}
	,center: function() {
		if(this.centerPoint != null) return this.centerPoint; else return this.evalSrf(this.u05,this.v05);
	}
	,evalCorners: function() {
		this.u05 = (this.corners[0].uv[0] + this.corners[2].uv[0]) / 2;
		this.v05 = (this.corners[0].uv[1] + this.corners[2].uv[1]) / 2;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			if(this.corners[i].point == null) {
				var c = this.corners[i];
				this.evalSrf(c.uv[0],c.uv[1],c);
			}
		}
	}
	,evalSrf: function(u,v,srfPt) {
		var derivs = verb_eval_Eval.rationalSurfaceDerivatives(this.srf,u,v,1);
		var pt = derivs[0][0];
		var norm = verb_core_Vec.cross(derivs[0][1],derivs[1][0]);
		var degen = verb_core_Vec.isZero(norm);
		if(!degen) norm = verb_core_Vec.normalized(norm);
		if(srfPt != null) {
			srfPt.degen = degen;
			srfPt.point = pt;
			srfPt.normal = norm;
			return srfPt;
		} else return new verb_core_SurfacePoint(pt,norm,[u,v],-1,degen);
	}
	,getEdgeCorners: function(edgeIndex) {
		if(this.isLeaf()) return [this.corners[edgeIndex]];
		if(this.horizontal) switch(edgeIndex) {
		case 0:
			return this.children[0].getEdgeCorners(0);
		case 1:
			return this.children[0].getEdgeCorners(1).concat(this.children[1].getEdgeCorners(1));
		case 2:
			return this.children[1].getEdgeCorners(2);
		case 3:
			return this.children[1].getEdgeCorners(3).concat(this.children[0].getEdgeCorners(3));
		}
		switch(edgeIndex) {
		case 0:
			return this.children[0].getEdgeCorners(0).concat(this.children[1].getEdgeCorners(0));
		case 1:
			return this.children[1].getEdgeCorners(1);
		case 2:
			return this.children[1].getEdgeCorners(2).concat(this.children[0].getEdgeCorners(2));
		case 3:
			return this.children[0].getEdgeCorners(3);
		}
		return null;
	}
	,getAllCorners: function(edgeIndex) {
		var baseArr = [this.corners[edgeIndex]];
		if(this.neighbors[edgeIndex] == null) return baseArr;
		var corners = this.neighbors[edgeIndex].getEdgeCorners((edgeIndex + 2) % 4);
		var funcIndex = edgeIndex % 2;
		var e = verb_core_Constants.EPSILON;
		var that = this;
		var rangeFuncMap = [function(c) {
			return c.uv[0] > that.corners[0].uv[0] + e && c.uv[0] < that.corners[2].uv[0] - e;
		},function(c1) {
			return c1.uv[1] > that.corners[0].uv[1] + e && c1.uv[1] < that.corners[2].uv[1] - e;
		}];
		var cornercopy = corners.filter(rangeFuncMap[funcIndex]);
		cornercopy.reverse();
		return baseArr.concat(cornercopy);
	}
	,midpoint: function(index) {
		if(this.midPoints == null) this.midPoints = [null,null,null,null];
		if(!(this.midPoints[index] == null)) return this.midPoints[index];
		switch(index) {
		case 0:
			this.midPoints[0] = this.evalSrf(this.u05,this.corners[0].uv[1]);
			break;
		case 1:
			this.midPoints[1] = this.evalSrf(this.corners[1].uv[0],this.v05);
			break;
		case 2:
			this.midPoints[2] = this.evalSrf(this.u05,this.corners[2].uv[1]);
			break;
		case 3:
			this.midPoints[3] = this.evalSrf(this.corners[0].uv[0],this.v05);
			break;
		}
		return this.midPoints[index];
	}
	,hasBadNormals: function() {
		return this.corners[0].degen || this.corners[1].degen || this.corners[2].degen || this.corners[3].degen;
	}
	,fixNormals: function() {
		var l = this.corners.length;
		var _g = 0;
		while(_g < l) {
			var i = _g++;
			var corn = this.corners[i];
			if(this.corners[i].degen) {
				var v1 = this.corners[(i + 1) % l];
				var v2 = this.corners[(i + 3) % l];
				if(v1.degen) this.corners[i].normal = v2.normal; else this.corners[i].normal = v1.normal;
			}
		}
	}
	,shouldDivide: function(options,currentDepth) {
		if(currentDepth < options.minDepth) return true;
		if(currentDepth >= options.maxDepth) return false;
		if(this.hasBadNormals()) {
			this.fixNormals();
			return false;
		}
		this.splitVert = verb_core_Vec.normSquared(verb_core_Vec.sub(this.corners[0].normal,this.corners[1].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(this.corners[2].normal,this.corners[3].normal)) > options.normTol;
		this.splitHoriz = verb_core_Vec.normSquared(verb_core_Vec.sub(this.corners[1].normal,this.corners[2].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(this.corners[3].normal,this.corners[0].normal)) > options.normTol;
		if(this.splitVert || this.splitHoriz) return true;
		var center = this.center();
		return verb_core_Vec.normSquared(verb_core_Vec.sub(center.normal,this.corners[0].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(center.normal,this.corners[1].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(center.normal,this.corners[2].normal)) > options.normTol || verb_core_Vec.normSquared(verb_core_Vec.sub(center.normal,this.corners[3].normal)) > options.normTol;
	}
	,divide: function(options) {
		if(options == null) options = new verb_eval_AdaptiveRefinementOptions();
		if(options.normTol == null) options.normTol = 8.5e-2;
		if(options.minDepth == null) options.minDepth = 0;
		if(options.maxDepth == null) options.maxDepth = 10;
		this._divide(options,0,true);
	}
	,_divide: function(options,currentDepth,horiz) {
		this.evalCorners();
		if(!this.shouldDivide(options,currentDepth)) return;
		currentDepth++;
		if(this.splitVert && !this.splitHoriz) horiz = false; else if(!this.splitVert && this.splitHoriz) horiz = true;
		this.horizontal = horiz;
		if(this.horizontal) {
			var bott = [this.corners[0],this.corners[1],this.midpoint(1),this.midpoint(3)];
			var top = [this.midpoint(3),this.midpoint(1),this.corners[2],this.corners[3]];
			this.children = [new verb_eval_AdaptiveRefinementNode(this.srf,bott),new verb_eval_AdaptiveRefinementNode(this.srf,top)];
			this.children[0].neighbors = [this.neighbors[0],this.neighbors[1],this.children[1],this.neighbors[3]];
			this.children[1].neighbors = [this.children[0],this.neighbors[1],this.neighbors[2],this.neighbors[3]];
		} else {
			var left = [this.corners[0],this.midpoint(0),this.midpoint(2),this.corners[3]];
			var right = [this.midpoint(0),this.corners[1],this.corners[2],this.midpoint(2)];
			this.children = [new verb_eval_AdaptiveRefinementNode(this.srf,left),new verb_eval_AdaptiveRefinementNode(this.srf,right)];
			this.children[0].neighbors = [this.neighbors[0],this.children[1],this.neighbors[2],this.neighbors[3]];
			this.children[1].neighbors = [this.neighbors[0],this.neighbors[1],this.neighbors[2],this.children[0]];
		}
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child._divide(options,currentDepth,!horiz);
		}
	}
	,triangulate: function(mesh) {
		if(mesh == null) mesh = verb_core_MeshData.empty();
		if(this.isLeaf()) return this.triangulateLeaf(mesh);
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var x = _g1[_g];
			++_g;
			if(x == null) break;
			x.triangulate(mesh);
		}
		return mesh;
	}
	,triangulateLeaf: function(mesh) {
		var baseIndex = mesh.points.length;
		var uvs = [];
		var ids = [];
		var splitid = 0;
		var _g = 0;
		while(_g < 4) {
			var i1 = _g++;
			var edgeCorners = this.getAllCorners(i1);
			if(edgeCorners.length == 2) splitid = i1 + 1;
			var _g2 = 0;
			var _g1 = edgeCorners.length;
			while(_g2 < _g1) {
				var j1 = _g2++;
				uvs.push(edgeCorners[j1]);
			}
		}
		var _g3 = 0;
		while(_g3 < uvs.length) {
			var corner = uvs[_g3];
			++_g3;
			if(corner.id != -1) {
				ids.push(corner.id);
				continue;
			}
			mesh.uvs.push(corner.uv);
			mesh.points.push(corner.point);
			mesh.normals.push(corner.normal);
			corner.id = baseIndex;
			ids.push(baseIndex);
			baseIndex++;
		}
		if(uvs.length == 4) {
			mesh.faces.push([ids[0],ids[3],ids[1]]);
			mesh.faces.push([ids[3],ids[2],ids[1]]);
			return mesh;
		} else if(uvs.length == 5) {
			var il = ids.length;
			mesh.faces.push([ids[splitid],ids[(splitid + 2) % il],ids[(splitid + 1) % il]]);
			mesh.faces.push([ids[(splitid + 4) % il],ids[(splitid + 3) % il],ids[splitid]]);
			mesh.faces.push([ids[splitid],ids[(splitid + 3) % il],ids[(splitid + 2) % il]]);
			return mesh;
		}
		var center = this.center();
		mesh.uvs.push(center.uv);
		mesh.points.push(center.point);
		mesh.normals.push(center.normal);
		var centerIndex = mesh.points.length - 1;
		var i = 0;
		var j = uvs.length - 1;
		while(i < uvs.length) {
			mesh.faces.push([centerIndex,ids[i],ids[j]]);
			j = i++;
		}
		return mesh;
	}
	,__class__: verb_eval_AdaptiveRefinementNode
};
var verb_geom_ICurve = function() { };

verb_geom_ICurve.__name__ = ["verb","geom","ICurve"];
verb_geom_ICurve.__interfaces__ = [verb_core_ISerializable];
verb_geom_ICurve.prototype = {
	__class__: verb_geom_ICurve
};
var verb_geom_NurbsCurve = function(data) {
	this._data = verb_eval_Check.isValidNurbsCurveData(data);
};

verb_geom_NurbsCurve.__name__ = ["verb","geom","NurbsCurve"];
verb_geom_NurbsCurve.__interfaces__ = [verb_geom_ICurve];
verb_geom_NurbsCurve.byKnotsControlPointsWeights = function(degree,knots,controlPoints,weights) {
	return new verb_geom_NurbsCurve(new verb_core_NurbsCurveData(degree,knots.slice(),verb_eval_Eval.homogenize1d(controlPoints,weights)));
};
verb_geom_NurbsCurve.byPoints = function(points,degree) {
	if(degree == null) degree = 3;
	return new verb_geom_NurbsCurve(verb_eval_Make.rationalInterpCurve(points,degree));
};
verb_geom_NurbsCurve.__super__ = verb_core_SerializableBase;
verb_geom_NurbsCurve.prototype = $extend(verb_core_SerializableBase.prototype,{
	degree: function() {
		return this._data.degree;
	}
	,knots: function() {
		return this._data.knots.slice(0);
	}
	,controlPoints: function() {
		return verb_eval_Eval.dehomogenize1d(this._data.controlPoints);
	}
	,weights: function() {
		return verb_eval_Eval.weight1d(this._data.controlPoints);
	}
	,asNurbs: function() {
		return new verb_core_NurbsCurveData(this.degree(),this.knots(),verb_eval_Eval.homogenize1d(this.controlPoints(),this.weights()));
	}
	,clone: function() {
		return new verb_geom_NurbsCurve(this._data);
	}
	,domain: function() {
		return new verb_core_Interval(verb_core_ArrayExtensions.first(this._data.knots),verb_core_ArrayExtensions.last(this._data.knots));
	}
	,transform: function(mat) {
		return new verb_geom_NurbsCurve(verb_eval_Modify.rationalCurveTransform(this._data,mat));
	}
	,transformAsync: function(mat) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Modify,"rationalCurveTransform",[this._data,mat]).then(function(x) {
			return new verb_geom_NurbsCurve(x);
		});
	}
	,point: function(u) {
		return verb_eval_Eval.rationalCurvePoint(this._data,u);
	}
	,pointAsync: function(u) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval,"rationalCurvePoint",[this._data,u]);
	}
	,tangent: function(u) {
		return verb_eval_Eval.rationalCurveTangent(this._data,u);
	}
	,tangentAsync: function(u) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval,"rationalCurveTangent",[this._data,u]);
	}
	,derivatives: function(u,numDerivs) {
		if(numDerivs == null) numDerivs = 1;
		return verb_eval_Eval.rationalCurveDerivatives(this._data,u,numDerivs);
	}
	,derivativesAsync: function(u,numDerivs) {
		if(numDerivs == null) numDerivs = 1;
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval,"rationalCurveDerivatives",[this._data,u,numDerivs]);
	}
	,closestPoint: function(pt) {
		return verb_eval_Analyze.rationalCurveClosestPoint(this._data,pt);
	}
	,closestPointAsync: function(pt) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze,"rationalCurveClosestPoint",[this._data,pt]);
	}
	,closestParam: function(pt) {
		return verb_eval_Analyze.rationalCurveClosestParam(this._data,pt);
	}
	,closestParamAsync: function(pt) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze,"rationalCurveClosestParam",[this._data,pt]);
	}
	,length: function() {
		return verb_eval_Analyze.rationalCurveArcLength(this._data);
	}
	,lengthAsync: function() {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze,"rationalCurveArcLength",[this._data]);
	}
	,lengthAtParam: function(u) {
		return verb_eval_Analyze.rationalCurveArcLength(this._data,u);
	}
	,lengthAtParamAsync: function() {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze,"rationalCurveArcLength",[this._data]);
	}
	,paramAtLength: function(len,tolerance) {
		return verb_eval_Analyze.rationalCurveParamAtArcLength(this._data,len,tolerance);
	}
	,paramAtLengthAsync: function(len,tolerance) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze,"rationalCurveParamAtArcLength",[this._data,len,tolerance]);
	}
	,divideByEqualArcLength: function(divisions) {
		return verb_eval_Divide.rationalCurveByEqualArcLength(this._data,divisions);
	}
	,divideByEqualArcLengthAsync: function(divisions) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Divide,"rationalCurveByEqualArcLength",[this._data,divisions]);
	}
	,divideByArcLength: function(arcLength) {
		return verb_eval_Divide.rationalCurveByArcLength(this._data,arcLength);
	}
	,divideByArcLengthAsync: function(divisions) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Divide,"rationalCurveByArcLength",[this._data,divisions]);
	}
	,split: function(u) {
		return verb_eval_Divide.curveSplit(this._data,u).map(function(x) {
			return new verb_geom_NurbsCurve(x);
		});
	}
	,splitAsync: function(u) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Divide,"curveSplit",[this._data,u]).then(function(cs) {
			return cs.map(function(x) {
				return new verb_geom_NurbsCurve(x);
			});
		});
	}
	,reverse: function() {
		return new verb_geom_NurbsCurve(verb_eval_Modify.curveReverse(this._data));
	}
	,reverseAsync: function() {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Modify,"curveReverse",[this._data]).then(function(c) {
			return new verb_geom_NurbsCurve(c);
		});
	}
	,tessellate: function(tolerance) {
		return verb_eval_Tess.rationalCurveAdaptiveSample(this._data,tolerance,false);
	}
	,tessellateAsync: function(tolerance) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Tess,"rationalCurveAdaptiveSample",[this._data,tolerance,false]);
	}
	,__class__: verb_geom_NurbsCurve
});
var verb_geom_Arc = function(center,xaxis,yaxis,radius,minAngle,maxAngle) {
	verb_geom_NurbsCurve.call(this,verb_eval_Make.arc(center,xaxis,yaxis,radius,minAngle,maxAngle));
	this._center = center;
	this._xaxis = xaxis;
	this._yaxis = yaxis;
	this._radius = radius;
	this._minAngle = minAngle;
	this._maxAngle = maxAngle;
};

verb_geom_Arc.__name__ = ["verb","geom","Arc"];
verb_geom_Arc.__super__ = verb_geom_NurbsCurve;
verb_geom_Arc.prototype = $extend(verb_geom_NurbsCurve.prototype,{
	center: function() {
		return this._center;
	}
	,xaxis: function() {
		return this._xaxis;
	}
	,yaxis: function() {
		return this._yaxis;
	}
	,radius: function() {
		return this._radius;
	}
	,minAngle: function() {
		return this._minAngle;
	}
	,maxAngle: function() {
		return this._maxAngle;
	}
	,__class__: verb_geom_Arc
});
var verb_geom_BezierCurve = function(points,weights) {
	verb_geom_NurbsCurve.call(this,verb_eval_Make.rationalBezierCurve(points,weights));
};

verb_geom_BezierCurve.__name__ = ["verb","geom","BezierCurve"];
verb_geom_BezierCurve.__super__ = verb_geom_NurbsCurve;
verb_geom_BezierCurve.prototype = $extend(verb_geom_NurbsCurve.prototype,{
	__class__: verb_geom_BezierCurve
});
var verb_geom_Circle = function(center,xaxis,yaxis,radius) {
	verb_geom_Arc.call(this,center,xaxis,yaxis,radius,0,Math.PI * 2);
};

verb_geom_Circle.__name__ = ["verb","geom","Circle"];
verb_geom_Circle.__super__ = verb_geom_Arc;
verb_geom_Circle.prototype = $extend(verb_geom_Arc.prototype,{
	__class__: verb_geom_Circle
});
var verb_geom_ISurface = function() { };

verb_geom_ISurface.__name__ = ["verb","geom","ISurface"];
verb_geom_ISurface.__interfaces__ = [verb_core_ISerializable];
verb_geom_ISurface.prototype = {
	__class__: verb_geom_ISurface
};
var verb_geom_NurbsSurface = function(data) {
	this._data = verb_eval_Check.isValidNurbsSurfaceData(data);
};

verb_geom_NurbsSurface.__name__ = ["verb","geom","NurbsSurface"];
verb_geom_NurbsSurface.__interfaces__ = [verb_geom_ISurface];
verb_geom_NurbsSurface.byKnotsControlPointsWeights = function(degreeU,degreeV,knotsU,knotsV,controlPoints,weights) {
	return new verb_geom_NurbsSurface(new verb_core_NurbsSurfaceData(degreeU,degreeV,knotsU,knotsV,verb_eval_Eval.homogenize2d(controlPoints,weights)));
};
verb_geom_NurbsSurface.byCorners = function(point0,point1,point2,point3) {
	return new verb_geom_NurbsSurface(verb_eval_Make.fourPointSurface(point0,point1,point2,point3));
};
verb_geom_NurbsSurface.byLoftingCurves = function(curves,degreeV) {
	return new verb_geom_NurbsSurface(verb_eval_Make.loftedSurface((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < curves.length) {
				var c = curves[_g1];
				++_g1;
				_g.push(c.asNurbs());
			}
		}
		$r = _g;
		return $r;
	}(this)),degreeV));
};
verb_geom_NurbsSurface.__super__ = verb_core_SerializableBase;
verb_geom_NurbsSurface.prototype = $extend(verb_core_SerializableBase.prototype,{
	degreeU: function() {
		return this._data.degreeU;
	}
	,degreeV: function() {
		return this._data.degreeV;
	}
	,knotsU: function() {
		return this._data.knotsU.slice(0);
	}
	,knotsV: function() {
		return this._data.knotsV.slice(0);
	}
	,controlPoints: function() {
		return verb_eval_Eval.dehomogenize2d(this._data.controlPoints);
	}
	,weights: function() {
		return verb_eval_Eval.weight2d(this._data.controlPoints);
	}
	,asNurbs: function() {
		return new verb_core_NurbsSurfaceData(this.degreeU(),this.degreeV(),this.knotsU(),this.knotsV(),verb_eval_Eval.homogenize2d(this.controlPoints(),this.weights()));
	}
	,clone: function() {
		return new verb_geom_NurbsSurface(this.asNurbs());
	}
	,domainU: function() {
		return new verb_core_Interval(verb_core_ArrayExtensions.first(this._data.knotsU),verb_core_ArrayExtensions.last(this._data.knotsU));
	}
	,domainV: function() {
		return new verb_core_Interval(verb_core_ArrayExtensions.first(this._data.knotsV),verb_core_ArrayExtensions.last(this._data.knotsV));
	}
	,point: function(u,v) {
		return verb_eval_Eval.rationalSurfacePoint(this._data,u,v);
	}
	,pointAsync: function(u,v) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval,"rationalSurfacePoint",[this._data,u,v]);
	}
	,normal: function(u,v) {
		return verb_eval_Eval.rationalSurfaceNormal(this._data,u,v);
	}
	,normalAsync: function(u,v) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval,"rationalSurfaceNormal",[this._data,u,v]);
	}
	,derivatives: function(u,v,numDerivs) {
		if(numDerivs == null) numDerivs = 1;
		return verb_eval_Eval.rationalSurfaceDerivatives(this._data,u,v,numDerivs);
	}
	,derivativesAsync: function(u,v,numDerivs) {
		if(numDerivs == null) numDerivs = 1;
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Eval,"rationalSurfaceDerivatives",[this._data,u,v,numDerivs]);
	}
	,closestParam: function(pt) {
		return verb_eval_Analyze.rationalSurfaceClosestParam(this._data,pt);
	}
	,closestParamAsync: function(pt) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze,"rationalSurfaceClosestParam",[this._data,pt]);
	}
	,closestPoint: function(pt) {
		return verb_eval_Analyze.rationalSurfaceClosestPoint(this._data,pt);
	}
	,closestPointAsync: function(pt) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Analyze,"rationalSurfaceClosestPoint",[this._data,pt]);
	}
	,split: function(u,useV) {
		if(useV == null) useV = false;
		return verb_eval_Divide.surfaceSplit(this._data,u,useV).map(function(x) {
			return new verb_geom_NurbsSurface(x);
		});
	}
	,splitAsync: function(u,useV) {
		if(useV == null) useV = false;
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Divide,"surfaceSplit",[this._data,u,useV]).then(function(s) {
			return s.map(function(x) {
				return new verb_geom_NurbsSurface(x);
			});
		});
	}
	,reverse: function(useV) {
		if(useV == null) useV = false;
		return new verb_geom_NurbsSurface(verb_eval_Modify.surfaceReverse(this._data,useV));
	}
	,reverseAsync: function(useV) {
		if(useV == null) useV = false;
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Modify,"surfaceReverse",[this._data,useV]).then(function(c) {
			return new verb_geom_NurbsSurface(c);
		});
	}
	,isocurve: function(u,useV) {
		if(useV == null) useV = false;
		return new verb_geom_NurbsCurve(verb_eval_Make.surfaceIsocurve(this._data,u,useV));
	}
	,isocurveAsync: function(u,useV) {
		if(useV == null) useV = false;
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Make,"surfaceIsocurve",[this._data,u,useV]).then(function(x) {
			return new verb_geom_NurbsCurve(x);
		});
	}
	,boundaries: function(options) {
		return verb_eval_Make.surfaceBoundaryCurves(this._data).map(function(x) {
			return new verb_geom_NurbsCurve(x);
		});
	}
	,boundariesAsync: function(options) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Make,"surfaceBoundaryCurves",[this._data]).then(function(cs) {
			return cs.map(function(x) {
				return new verb_geom_NurbsCurve(x);
			});
		});
	}
	,tessellate: function(options) {
		return verb_eval_Tess.rationalSurfaceAdaptive(this._data,options);
	}
	,tessellateAsync: function(options) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Tess,"rationalSurfaceAdaptive",[this._data,options]);
	}
	,transform: function(mat) {
		return new verb_geom_NurbsSurface(verb_eval_Modify.rationalSurfaceTransform(this._data,mat));
	}
	,transformAsync: function(mat) {
		return verb_exe_Dispatcher.dispatchMethod(verb_eval_Modify,"rationalSurfaceTransform",[this._data,mat]).then(function(x) {
			return new verb_geom_NurbsSurface(x);
		});
	}
	,__class__: verb_geom_NurbsSurface
});
var verb_geom_ConicalSurface = function(axis,xaxis,base,height,radius) {
	verb_geom_NurbsSurface.call(this,verb_eval_Make.conicalSurface(axis,xaxis,base,height,radius));
	this._axis = axis;
	this._xaxis = xaxis;
	this._base = base;
	this._height = height;
	this._radius = radius;
};

verb_geom_ConicalSurface.__name__ = ["verb","geom","ConicalSurface"];
verb_geom_ConicalSurface.__super__ = verb_geom_NurbsSurface;
verb_geom_ConicalSurface.prototype = $extend(verb_geom_NurbsSurface.prototype,{
	axis: function() {
		return this._axis;
	}
	,xaxis: function() {
		return this._xaxis;
	}
	,base: function() {
		return this._base;
	}
	,height: function() {
		return this._height;
	}
	,radius: function() {
		return this._radius;
	}
	,__class__: verb_geom_ConicalSurface
});
var verb_geom_CylindricalSurface = function(axis,xaxis,base,height,radius) {
	verb_geom_NurbsSurface.call(this,verb_eval_Make.cylindricalSurface(axis,xaxis,base,height,radius));
	this._axis = axis;
	this._xaxis = xaxis;
	this._base = base;
	this._height = height;
	this._radius = radius;
};

verb_geom_CylindricalSurface.__name__ = ["verb","geom","CylindricalSurface"];
verb_geom_CylindricalSurface.__super__ = verb_geom_NurbsSurface;
verb_geom_CylindricalSurface.prototype = $extend(verb_geom_NurbsSurface.prototype,{
	axis: function() {
		return this._axis;
	}
	,xaxis: function() {
		return this._xaxis;
	}
	,base: function() {
		return this._base;
	}
	,height: function() {
		return this._height;
	}
	,radius: function() {
		return this._radius;
	}
	,__class__: verb_geom_CylindricalSurface
});
var verb_geom_EllipseArc = function(center,xaxis,yaxis,minAngle,maxAngle) {
	verb_geom_NurbsCurve.call(this,verb_eval_Make.ellipseArc(center,xaxis,yaxis,minAngle,maxAngle));
	this._center = center;
	this._xaxis = xaxis;
	this._yaxis = yaxis;
	this._minAngle = minAngle;
	this._maxAngle = maxAngle;
};

verb_geom_EllipseArc.__name__ = ["verb","geom","EllipseArc"];
verb_geom_EllipseArc.__super__ = verb_geom_NurbsCurve;
verb_geom_EllipseArc.prototype = $extend(verb_geom_NurbsCurve.prototype,{
	center: function() {
		return this._center;
	}
	,xaxis: function() {
		return this._xaxis;
	}
	,yaxis: function() {
		return this._yaxis;
	}
	,minAngle: function() {
		return this._minAngle;
	}
	,maxAngle: function() {
		return this._maxAngle;
	}
	,__class__: verb_geom_EllipseArc
});
var verb_geom_Ellipse = function(center,xaxis,yaxis) {
	verb_geom_EllipseArc.call(this,center,xaxis,yaxis,0,Math.PI * 2);
};

verb_geom_Ellipse.__name__ = ["verb","geom","Ellipse"];
verb_geom_Ellipse.__super__ = verb_geom_EllipseArc;
verb_geom_Ellipse.prototype = $extend(verb_geom_EllipseArc.prototype,{
	__class__: verb_geom_Ellipse
});
var verb_geom_ExtrudedSurface = function(profile,direction) {
	verb_geom_NurbsSurface.call(this,verb_eval_Make.extrudedSurface(verb_core_Vec.normalized(direction),verb_core_Vec.norm(direction),profile.asNurbs()));
	this._profile = profile;
	this._direction = direction;
};

verb_geom_ExtrudedSurface.__name__ = ["verb","geom","ExtrudedSurface"];
verb_geom_ExtrudedSurface.__super__ = verb_geom_NurbsSurface;
verb_geom_ExtrudedSurface.prototype = $extend(verb_geom_NurbsSurface.prototype,{
	profile: function() {
		return this._profile;
	}
	,direction: function() {
		return this._direction;
	}
	,__class__: verb_geom_ExtrudedSurface
});
var verb_geom_Intersect = function() { };

verb_geom_Intersect.__name__ = ["verb","geom","Intersect"];
verb_geom_Intersect.curves = function(first,second,tol) {
	if(tol == null) tol = 1e-3;
	return verb_eval_Intersect.curves(first.asNurbs(),second.asNurbs(),tol);
};
verb_geom_Intersect.curvesAsync = function(first,second,tol) {
	if(tol == null) tol = 1e-3;
	return verb_exe_Dispatcher.dispatchMethod(verb_eval_Intersect,"curves",[first.asNurbs(),second.asNurbs(),tol]);
};
verb_geom_Intersect.curveAndSurface = function(curve,surface,tol) {
	if(tol == null) tol = 1e-3;
	return verb_eval_Intersect.curveAndSurface(curve.asNurbs(),surface.asNurbs(),tol);
};
verb_geom_Intersect.curveAndSurfaceAsync = function(curve,surface,tol) {
	if(tol == null) tol = 1e-3;
	return verb_exe_Dispatcher.dispatchMethod(verb_eval_Intersect,"curveAndSurface",[curve.asNurbs(),surface.asNurbs(),tol]);
};
verb_geom_Intersect.surfaces = function(first,second,tol) {
	if(tol == null) tol = 1e-3;
	return verb_eval_Intersect.surfaces(first.asNurbs(),second.asNurbs(),tol).map(function(cd) {
		return new verb_geom_NurbsCurve(cd);
	});
};
verb_geom_Intersect.surfacesAsync = function(first,second,tol) {
	if(tol == null) tol = 1e-3;
	return verb_exe_Dispatcher.dispatchMethod(verb_eval_Intersect,"surfaces",[first.asNurbs(),second.asNurbs(),tol]).then(function(cds) {
		return cds.map(function(cd) {
			return new verb_geom_NurbsCurve(cd);
		});
	});
};
var verb_geom_Line = function(start,end) {
	verb_geom_NurbsCurve.call(this,verb_eval_Make.polyline([start,end]));
	this._start = start;
	this._end = end;
};

verb_geom_Line.__name__ = ["verb","geom","Line"];
verb_geom_Line.__super__ = verb_geom_NurbsCurve;
verb_geom_Line.prototype = $extend(verb_geom_NurbsCurve.prototype,{
	start: function() {
		return this._start;
	}
	,end: function() {
		return this._end;
	}
	,__class__: verb_geom_Line
});
var verb_geom_RevolvedSurface = function(profile,center,axis,angle) {
	verb_geom_NurbsSurface.call(this,verb_eval_Make.revolvedSurface(profile.asNurbs(),center,axis,angle));
	this._profile = profile;
	this._center = center;
	this._axis = axis;
	this._angle = angle;
};

verb_geom_RevolvedSurface.__name__ = ["verb","geom","RevolvedSurface"];
verb_geom_RevolvedSurface.__super__ = verb_geom_NurbsSurface;
verb_geom_RevolvedSurface.prototype = $extend(verb_geom_NurbsSurface.prototype,{
	profile: function() {
		return this._profile;
	}
	,center: function() {
		return this._center;
	}
	,axis: function() {
		return this._center;
	}
	,angle: function() {
		return this._angle;
	}
	,__class__: verb_geom_RevolvedSurface
});
var verb_geom_SphericalSurface = function(center,radius) {
	verb_geom_NurbsSurface.call(this,verb_eval_Make.sphericalSurface(center,[0,0,1],[1,0,0],radius));
	this._center = center;
	this._radius = radius;
};

verb_geom_SphericalSurface.__name__ = ["verb","geom","SphericalSurface"];
verb_geom_SphericalSurface.__super__ = verb_geom_NurbsSurface;
verb_geom_SphericalSurface.prototype = $extend(verb_geom_NurbsSurface.prototype,{
	center: function() {
		return this._center;
	}
	,radius: function() {
		return this._radius;
	}
	,__class__: verb_geom_SphericalSurface
});
var verb_geom_SweptSurface = function(profile,rail) {
	verb_geom_NurbsSurface.call(this,verb_eval_Make.rationalTranslationalSurface(profile.asNurbs(),rail.asNurbs()));
	this._profile = profile;
	this._rail = rail;
};
verb_geom_SweptSurface.__super__ = verb_geom_NurbsSurface;
verb_geom_SweptSurface.prototype = $extend(verb_geom_NurbsSurface.prototype,{
	profile: function() {
		return this._profile;
	}
	,rail: function() {
		return this._rail;
	}
	,__class__: verb_geom_SweptSurface
});

verb_core_Binomial.memo = new haxe_ds_IntMap();
verb_core_Constants.TOLERANCE = 1e-6;
verb_core_Constants.EPSILON = 1e-10;
verb_core_Constants.VERSION = "2.0.0";
verb_eval_Analyze.Tvalues = [[],[],[-0.5773502691896257645091487805019574556476,0.5773502691896257645091487805019574556476],[0,-0.7745966692414833770358530799564799221665,0.7745966692414833770358530799564799221665],[-0.3399810435848562648026657591032446872005,0.3399810435848562648026657591032446872005,-0.8611363115940525752239464888928095050957,0.8611363115940525752239464888928095050957],[0,-0.5384693101056830910363144207002088049672,0.5384693101056830910363144207002088049672,-0.9061798459386639927976268782993929651256,0.9061798459386639927976268782993929651256],[0.6612093864662645136613995950199053470064,-0.6612093864662645136613995950199053470064,-0.2386191860831969086305017216807119354186,0.2386191860831969086305017216807119354186,-0.9324695142031520278123015544939946091347,0.9324695142031520278123015544939946091347],[0,0.4058451513773971669066064120769614633473,-0.4058451513773971669066064120769614633473,-0.7415311855993944398638647732807884070741,0.7415311855993944398638647732807884070741,-0.9491079123427585245261896840478512624007,0.9491079123427585245261896840478512624007],[-0.1834346424956498049394761423601839806667,0.1834346424956498049394761423601839806667,-0.5255324099163289858177390491892463490419,0.5255324099163289858177390491892463490419,-0.7966664774136267395915539364758304368371,0.7966664774136267395915539364758304368371,-0.9602898564975362316835608685694729904282,0.9602898564975362316835608685694729904282],[0,-0.8360311073266357942994297880697348765441,0.8360311073266357942994297880697348765441,-0.9681602395076260898355762029036728700494,0.9681602395076260898355762029036728700494,-0.3242534234038089290385380146433366085719,0.3242534234038089290385380146433366085719,-0.6133714327005903973087020393414741847857,0.6133714327005903973087020393414741847857],[-0.1488743389816312108848260011297199846175,0.1488743389816312108848260011297199846175,-0.4333953941292471907992659431657841622000,0.4333953941292471907992659431657841622000,-0.6794095682990244062343273651148735757692,0.6794095682990244062343273651148735757692,-0.8650633666889845107320966884234930485275,0.8650633666889845107320966884234930485275,-0.9739065285171717200779640120844520534282,0.9739065285171717200779640120844520534282],[0,-0.2695431559523449723315319854008615246796,0.2695431559523449723315319854008615246796,-0.5190961292068118159257256694586095544802,0.5190961292068118159257256694586095544802,-0.7301520055740493240934162520311534580496,0.7301520055740493240934162520311534580496,-0.8870625997680952990751577693039272666316,0.8870625997680952990751577693039272666316,-0.9782286581460569928039380011228573907714,0.9782286581460569928039380011228573907714],[-0.1252334085114689154724413694638531299833,0.1252334085114689154724413694638531299833,-0.3678314989981801937526915366437175612563,0.3678314989981801937526915366437175612563,-0.5873179542866174472967024189405342803690,0.5873179542866174472967024189405342803690,-0.7699026741943046870368938332128180759849,0.7699026741943046870368938332128180759849,-0.9041172563704748566784658661190961925375,0.9041172563704748566784658661190961925375,-0.9815606342467192506905490901492808229601,0.9815606342467192506905490901492808229601],[0,-0.2304583159551347940655281210979888352115,0.2304583159551347940655281210979888352115,-0.4484927510364468528779128521276398678019,0.4484927510364468528779128521276398678019,-0.6423493394403402206439846069955156500716,0.6423493394403402206439846069955156500716,-0.8015780907333099127942064895828598903056,0.8015780907333099127942064895828598903056,-0.9175983992229779652065478365007195123904,0.9175983992229779652065478365007195123904,-0.9841830547185881494728294488071096110649,0.9841830547185881494728294488071096110649],[-0.1080549487073436620662446502198347476119,0.1080549487073436620662446502198347476119,-0.3191123689278897604356718241684754668342,0.3191123689278897604356718241684754668342,-0.5152486363581540919652907185511886623088,0.5152486363581540919652907185511886623088,-0.6872929048116854701480198030193341375384,0.6872929048116854701480198030193341375384,-0.8272013150697649931897947426503949610397,0.8272013150697649931897947426503949610397,-0.9284348836635735173363911393778742644770,0.9284348836635735173363911393778742644770,-0.9862838086968123388415972667040528016760,0.9862838086968123388415972667040528016760],[0,-0.2011940939974345223006283033945962078128,0.2011940939974345223006283033945962078128,-0.3941513470775633698972073709810454683627,0.3941513470775633698972073709810454683627,-0.5709721726085388475372267372539106412383,0.5709721726085388475372267372539106412383,-0.7244177313601700474161860546139380096308,0.7244177313601700474161860546139380096308,-0.8482065834104272162006483207742168513662,0.8482065834104272162006483207742168513662,-0.9372733924007059043077589477102094712439,0.9372733924007059043077589477102094712439,-0.9879925180204854284895657185866125811469,0.9879925180204854284895657185866125811469],[-0.0950125098376374401853193354249580631303,0.0950125098376374401853193354249580631303,-0.2816035507792589132304605014604961064860,0.2816035507792589132304605014604961064860,-0.4580167776572273863424194429835775735400,0.4580167776572273863424194429835775735400,-0.6178762444026437484466717640487910189918,0.6178762444026437484466717640487910189918,-0.7554044083550030338951011948474422683538,0.7554044083550030338951011948474422683538,-0.8656312023878317438804678977123931323873,0.8656312023878317438804678977123931323873,-0.9445750230732325760779884155346083450911,0.9445750230732325760779884155346083450911,-0.9894009349916499325961541734503326274262,0.9894009349916499325961541734503326274262],[0,-0.1784841814958478558506774936540655574754,0.1784841814958478558506774936540655574754,-0.3512317634538763152971855170953460050405,0.3512317634538763152971855170953460050405,-0.5126905370864769678862465686295518745829,0.5126905370864769678862465686295518745829,-0.6576711592166907658503022166430023351478,0.6576711592166907658503022166430023351478,-0.7815140038968014069252300555204760502239,0.7815140038968014069252300555204760502239,-0.8802391537269859021229556944881556926234,0.8802391537269859021229556944881556926234,-0.9506755217687677612227169578958030214433,0.9506755217687677612227169578958030214433,-0.9905754753144173356754340199406652765077,0.9905754753144173356754340199406652765077],[-0.0847750130417353012422618529357838117333,0.0847750130417353012422618529357838117333,-0.2518862256915055095889728548779112301628,0.2518862256915055095889728548779112301628,-0.4117511614628426460359317938330516370789,0.4117511614628426460359317938330516370789,-0.5597708310739475346078715485253291369276,0.5597708310739475346078715485253291369276,-0.6916870430603532078748910812888483894522,0.6916870430603532078748910812888483894522,-0.8037049589725231156824174550145907971032,0.8037049589725231156824174550145907971032,-0.8926024664975557392060605911271455154078,0.8926024664975557392060605911271455154078,-0.9558239495713977551811958929297763099728,0.9558239495713977551811958929297763099728,-0.9915651684209309467300160047061507702525,0.9915651684209309467300160047061507702525],[0,-0.1603586456402253758680961157407435495048,0.1603586456402253758680961157407435495048,-0.3165640999636298319901173288498449178922,0.3165640999636298319901173288498449178922,-0.4645707413759609457172671481041023679762,0.4645707413759609457172671481041023679762,-0.6005453046616810234696381649462392798683,0.6005453046616810234696381649462392798683,-0.7209661773352293786170958608237816296571,0.7209661773352293786170958608237816296571,-0.8227146565371428249789224867127139017745,0.8227146565371428249789224867127139017745,-0.9031559036148179016426609285323124878093,0.9031559036148179016426609285323124878093,-0.9602081521348300308527788406876515266150,0.9602081521348300308527788406876515266150,-0.9924068438435844031890176702532604935893,0.9924068438435844031890176702532604935893],[-0.0765265211334973337546404093988382110047,0.0765265211334973337546404093988382110047,-0.2277858511416450780804961953685746247430,0.2277858511416450780804961953685746247430,-0.3737060887154195606725481770249272373957,0.3737060887154195606725481770249272373957,-0.5108670019508270980043640509552509984254,0.5108670019508270980043640509552509984254,-0.6360536807265150254528366962262859367433,0.6360536807265150254528366962262859367433,-0.7463319064601507926143050703556415903107,0.7463319064601507926143050703556415903107,-0.8391169718222188233945290617015206853296,0.8391169718222188233945290617015206853296,-0.9122344282513259058677524412032981130491,0.9122344282513259058677524412032981130491,-0.9639719272779137912676661311972772219120,0.9639719272779137912676661311972772219120,-0.9931285991850949247861223884713202782226,0.9931285991850949247861223884713202782226],[0,-0.1455618541608950909370309823386863301163,0.1455618541608950909370309823386863301163,-0.2880213168024010966007925160646003199090,0.2880213168024010966007925160646003199090,-0.4243421202074387835736688885437880520964,0.4243421202074387835736688885437880520964,-0.5516188358872198070590187967243132866220,0.5516188358872198070590187967243132866220,-0.6671388041974123193059666699903391625970,0.6671388041974123193059666699903391625970,-0.7684399634756779086158778513062280348209,0.7684399634756779086158778513062280348209,-0.8533633645833172836472506385875676702761,0.8533633645833172836472506385875676702761,-0.9200993341504008287901871337149688941591,0.9200993341504008287901871337149688941591,-0.9672268385663062943166222149076951614246,0.9672268385663062943166222149076951614246,-0.9937521706203895002602420359379409291933,0.9937521706203895002602420359379409291933],[-0.0697392733197222212138417961186280818222,0.0697392733197222212138417961186280818222,-0.2078604266882212854788465339195457342156,0.2078604266882212854788465339195457342156,-0.3419358208920842251581474204273796195591,0.3419358208920842251581474204273796195591,-0.4693558379867570264063307109664063460953,0.4693558379867570264063307109664063460953,-0.5876404035069115929588769276386473488776,0.5876404035069115929588769276386473488776,-0.6944872631866827800506898357622567712673,0.6944872631866827800506898357622567712673,-0.7878168059792081620042779554083515213881,0.7878168059792081620042779554083515213881,-0.8658125777203001365364256370193787290847,0.8658125777203001365364256370193787290847,-0.9269567721871740005206929392590531966353,0.9269567721871740005206929392590531966353,-0.9700604978354287271239509867652687108059,0.9700604978354287271239509867652687108059,-0.9942945854823992920730314211612989803930,0.9942945854823992920730314211612989803930],[0,-0.1332568242984661109317426822417661370104,0.1332568242984661109317426822417661370104,-0.2641356809703449305338695382833096029790,0.2641356809703449305338695382833096029790,-0.3903010380302908314214888728806054585780,0.3903010380302908314214888728806054585780,-0.5095014778460075496897930478668464305448,0.5095014778460075496897930478668464305448,-0.6196098757636461563850973116495956533871,0.6196098757636461563850973116495956533871,-0.7186613631319501944616244837486188483299,0.7186613631319501944616244837486188483299,-0.8048884016188398921511184069967785579414,0.8048884016188398921511184069967785579414,-0.8767523582704416673781568859341456716389,0.8767523582704416673781568859341456716389,-0.9329710868260161023491969890384229782357,0.9329710868260161023491969890384229782357,-0.9725424712181152319560240768207773751816,0.9725424712181152319560240768207773751816,-0.9947693349975521235239257154455743605736,0.9947693349975521235239257154455743605736],[-0.0640568928626056260850430826247450385909,0.0640568928626056260850430826247450385909,-0.1911188674736163091586398207570696318404,0.1911188674736163091586398207570696318404,-0.3150426796961633743867932913198102407864,0.3150426796961633743867932913198102407864,-0.4337935076260451384870842319133497124524,0.4337935076260451384870842319133497124524,-0.5454214713888395356583756172183723700107,0.5454214713888395356583756172183723700107,-0.6480936519369755692524957869107476266696,0.6480936519369755692524957869107476266696,-0.7401241915785543642438281030999784255232,0.7401241915785543642438281030999784255232,-0.8200019859739029219539498726697452080761,0.8200019859739029219539498726697452080761,-0.8864155270044010342131543419821967550873,0.8864155270044010342131543419821967550873,-0.9382745520027327585236490017087214496548,0.9382745520027327585236490017087214496548,-0.9747285559713094981983919930081690617411,0.9747285559713094981983919930081690617411,-0.9951872199970213601799974097007368118745,0.9951872199970213601799974097007368118745]];
verb_eval_Analyze.Cvalues = [[],[],[1.0,1.0],[0.8888888888888888888888888888888888888888,0.5555555555555555555555555555555555555555,0.5555555555555555555555555555555555555555],[0.6521451548625461426269360507780005927646,0.6521451548625461426269360507780005927646,0.3478548451374538573730639492219994072353,0.3478548451374538573730639492219994072353],[0.5688888888888888888888888888888888888888,0.4786286704993664680412915148356381929122,0.4786286704993664680412915148356381929122,0.2369268850561890875142640407199173626432,0.2369268850561890875142640407199173626432],[0.3607615730481386075698335138377161116615,0.3607615730481386075698335138377161116615,0.4679139345726910473898703439895509948116,0.4679139345726910473898703439895509948116,0.1713244923791703450402961421727328935268,0.1713244923791703450402961421727328935268],[0.4179591836734693877551020408163265306122,0.3818300505051189449503697754889751338783,0.3818300505051189449503697754889751338783,0.2797053914892766679014677714237795824869,0.2797053914892766679014677714237795824869,0.1294849661688696932706114326790820183285,0.1294849661688696932706114326790820183285],[0.3626837833783619829651504492771956121941,0.3626837833783619829651504492771956121941,0.3137066458778872873379622019866013132603,0.3137066458778872873379622019866013132603,0.2223810344533744705443559944262408844301,0.2223810344533744705443559944262408844301,0.1012285362903762591525313543099621901153,0.1012285362903762591525313543099621901153],[0.3302393550012597631645250692869740488788,0.1806481606948574040584720312429128095143,0.1806481606948574040584720312429128095143,0.0812743883615744119718921581105236506756,0.0812743883615744119718921581105236506756,0.3123470770400028400686304065844436655987,0.3123470770400028400686304065844436655987,0.2606106964029354623187428694186328497718,0.2606106964029354623187428694186328497718],[0.2955242247147528701738929946513383294210,0.2955242247147528701738929946513383294210,0.2692667193099963550912269215694693528597,0.2692667193099963550912269215694693528597,0.2190863625159820439955349342281631924587,0.2190863625159820439955349342281631924587,0.1494513491505805931457763396576973324025,0.1494513491505805931457763396576973324025,0.0666713443086881375935688098933317928578,0.0666713443086881375935688098933317928578],[0.2729250867779006307144835283363421891560,0.2628045445102466621806888698905091953727,0.2628045445102466621806888698905091953727,0.2331937645919904799185237048431751394317,0.2331937645919904799185237048431751394317,0.1862902109277342514260976414316558916912,0.1862902109277342514260976414316558916912,0.1255803694649046246346942992239401001976,0.1255803694649046246346942992239401001976,0.0556685671161736664827537204425485787285,0.0556685671161736664827537204425485787285],[0.2491470458134027850005624360429512108304,0.2491470458134027850005624360429512108304,0.2334925365383548087608498989248780562594,0.2334925365383548087608498989248780562594,0.2031674267230659217490644558097983765065,0.2031674267230659217490644558097983765065,0.1600783285433462263346525295433590718720,0.1600783285433462263346525295433590718720,0.1069393259953184309602547181939962242145,0.1069393259953184309602547181939962242145,0.0471753363865118271946159614850170603170,0.0471753363865118271946159614850170603170],[0.2325515532308739101945895152688359481566,0.2262831802628972384120901860397766184347,0.2262831802628972384120901860397766184347,0.2078160475368885023125232193060527633865,0.2078160475368885023125232193060527633865,0.1781459807619457382800466919960979955128,0.1781459807619457382800466919960979955128,0.1388735102197872384636017768688714676218,0.1388735102197872384636017768688714676218,0.0921214998377284479144217759537971209236,0.0921214998377284479144217759537971209236,0.0404840047653158795200215922009860600419,0.0404840047653158795200215922009860600419],[0.2152638534631577901958764433162600352749,0.2152638534631577901958764433162600352749,0.2051984637212956039659240656612180557103,0.2051984637212956039659240656612180557103,0.1855383974779378137417165901251570362489,0.1855383974779378137417165901251570362489,0.1572031671581935345696019386238421566056,0.1572031671581935345696019386238421566056,0.1215185706879031846894148090724766259566,0.1215185706879031846894148090724766259566,0.0801580871597602098056332770628543095836,0.0801580871597602098056332770628543095836,0.0351194603317518630318328761381917806197,0.0351194603317518630318328761381917806197],[0.2025782419255612728806201999675193148386,0.1984314853271115764561183264438393248186,0.1984314853271115764561183264438393248186,0.1861610000155622110268005618664228245062,0.1861610000155622110268005618664228245062,0.1662692058169939335532008604812088111309,0.1662692058169939335532008604812088111309,0.1395706779261543144478047945110283225208,0.1395706779261543144478047945110283225208,0.1071592204671719350118695466858693034155,0.1071592204671719350118695466858693034155,0.0703660474881081247092674164506673384667,0.0703660474881081247092674164506673384667,0.0307532419961172683546283935772044177217,0.0307532419961172683546283935772044177217],[0.1894506104550684962853967232082831051469,0.1894506104550684962853967232082831051469,0.1826034150449235888667636679692199393835,0.1826034150449235888667636679692199393835,0.1691565193950025381893120790303599622116,0.1691565193950025381893120790303599622116,0.1495959888165767320815017305474785489704,0.1495959888165767320815017305474785489704,0.1246289712555338720524762821920164201448,0.1246289712555338720524762821920164201448,0.0951585116824927848099251076022462263552,0.0951585116824927848099251076022462263552,0.0622535239386478928628438369943776942749,0.0622535239386478928628438369943776942749,0.0271524594117540948517805724560181035122,0.0271524594117540948517805724560181035122],[0.1794464703562065254582656442618856214487,0.1765627053669926463252709901131972391509,0.1765627053669926463252709901131972391509,0.1680041021564500445099706637883231550211,0.1680041021564500445099706637883231550211,0.1540457610768102880814315948019586119404,0.1540457610768102880814315948019586119404,0.1351363684685254732863199817023501973721,0.1351363684685254732863199817023501973721,0.1118838471934039710947883856263559267358,0.1118838471934039710947883856263559267358,0.0850361483171791808835353701910620738504,0.0850361483171791808835353701910620738504,0.0554595293739872011294401653582446605128,0.0554595293739872011294401653582446605128,0.0241483028685479319601100262875653246916,0.0241483028685479319601100262875653246916],[0.1691423829631435918406564701349866103341,0.1691423829631435918406564701349866103341,0.1642764837458327229860537764659275904123,0.1642764837458327229860537764659275904123,0.1546846751262652449254180038363747721932,0.1546846751262652449254180038363747721932,0.1406429146706506512047313037519472280955,0.1406429146706506512047313037519472280955,0.1225552067114784601845191268002015552281,0.1225552067114784601845191268002015552281,0.1009420441062871655628139849248346070628,0.1009420441062871655628139849248346070628,0.0764257302548890565291296776166365256053,0.0764257302548890565291296776166365256053,0.0497145488949697964533349462026386416808,0.0497145488949697964533349462026386416808,0.0216160135264833103133427102664524693876,0.0216160135264833103133427102664524693876],[0.1610544498487836959791636253209167350399,0.1589688433939543476499564394650472016787,0.1589688433939543476499564394650472016787,0.1527660420658596667788554008976629984610,0.1527660420658596667788554008976629984610,0.1426067021736066117757461094419029724756,0.1426067021736066117757461094419029724756,0.1287539625393362276755157848568771170558,0.1287539625393362276755157848568771170558,0.1115666455473339947160239016817659974813,0.1115666455473339947160239016817659974813,0.0914900216224499994644620941238396526609,0.0914900216224499994644620941238396526609,0.0690445427376412265807082580060130449618,0.0690445427376412265807082580060130449618,0.0448142267656996003328381574019942119517,0.0448142267656996003328381574019942119517,0.0194617882297264770363120414644384357529,0.0194617882297264770363120414644384357529],[0.1527533871307258506980843319550975934919,0.1527533871307258506980843319550975934919,0.1491729864726037467878287370019694366926,0.1491729864726037467878287370019694366926,0.1420961093183820513292983250671649330345,0.1420961093183820513292983250671649330345,0.1316886384491766268984944997481631349161,0.1316886384491766268984944997481631349161,0.1181945319615184173123773777113822870050,0.1181945319615184173123773777113822870050,0.1019301198172404350367501354803498761666,0.1019301198172404350367501354803498761666,0.0832767415767047487247581432220462061001,0.0832767415767047487247581432220462061001,0.0626720483341090635695065351870416063516,0.0626720483341090635695065351870416063516,0.0406014298003869413310399522749321098790,0.0406014298003869413310399522749321098790,0.0176140071391521183118619623518528163621,0.0176140071391521183118619623518528163621],[0.1460811336496904271919851476833711882448,0.1445244039899700590638271665537525436099,0.1445244039899700590638271665537525436099,0.1398873947910731547221334238675831108927,0.1398873947910731547221334238675831108927,0.1322689386333374617810525744967756043290,0.1322689386333374617810525744967756043290,0.1218314160537285341953671771257335983563,0.1218314160537285341953671771257335983563,0.1087972991671483776634745780701056420336,0.1087972991671483776634745780701056420336,0.0934444234560338615532897411139320884835,0.0934444234560338615532897411139320884835,0.0761001136283793020170516533001831792261,0.0761001136283793020170516533001831792261,0.0571344254268572082836358264724479574912,0.0571344254268572082836358264724479574912,0.0369537897708524937999506682993296661889,0.0369537897708524937999506682993296661889,0.0160172282577743333242246168584710152658,0.0160172282577743333242246168584710152658],[0.1392518728556319933754102483418099578739,0.1392518728556319933754102483418099578739,0.1365414983460151713525738312315173965863,0.1365414983460151713525738312315173965863,0.1311735047870623707329649925303074458757,0.1311735047870623707329649925303074458757,0.1232523768105124242855609861548144719594,0.1232523768105124242855609861548144719594,0.1129322960805392183934006074217843191142,0.1129322960805392183934006074217843191142,0.1004141444428809649320788378305362823508,0.1004141444428809649320788378305362823508,0.0859416062170677274144436813727028661891,0.0859416062170677274144436813727028661891,0.0697964684245204880949614189302176573987,0.0697964684245204880949614189302176573987,0.0522933351526832859403120512732112561121,0.0522933351526832859403120512732112561121,0.0337749015848141547933022468659129013491,0.0337749015848141547933022468659129013491,0.0146279952982722006849910980471854451902,0.0146279952982722006849910980471854451902],[0.1336545721861061753514571105458443385831,0.1324620394046966173716424647033169258050,0.1324620394046966173716424647033169258050,0.1289057221880821499785953393997936532597,0.1289057221880821499785953393997936532597,0.1230490843067295304675784006720096548158,0.1230490843067295304675784006720096548158,0.1149966402224113649416435129339613014914,0.1149966402224113649416435129339613014914,0.1048920914645414100740861850147438548584,0.1048920914645414100740861850147438548584,0.0929157660600351474770186173697646486034,0.0929157660600351474770186173697646486034,0.0792814117767189549228925247420432269137,0.0792814117767189549228925247420432269137,0.0642324214085258521271696151589109980391,0.0642324214085258521271696151589109980391,0.0480376717310846685716410716320339965612,0.0480376717310846685716410716320339965612,0.0309880058569794443106942196418845053837,0.0309880058569794443106942196418845053837,0.0134118594871417720813094934586150649766,0.0134118594871417720813094934586150649766],[0.1279381953467521569740561652246953718517,0.1279381953467521569740561652246953718517,0.1258374563468282961213753825111836887264,0.1258374563468282961213753825111836887264,0.1216704729278033912044631534762624256070,0.1216704729278033912044631534762624256070,0.1155056680537256013533444839067835598622,0.1155056680537256013533444839067835598622,0.1074442701159656347825773424466062227946,0.1074442701159656347825773424466062227946,0.0976186521041138882698806644642471544279,0.0976186521041138882698806644642471544279,0.0861901615319532759171852029837426671850,0.0861901615319532759171852029837426671850,0.0733464814110803057340336152531165181193,0.0733464814110803057340336152531165181193,0.0592985849154367807463677585001085845412,0.0592985849154367807463677585001085845412,0.0442774388174198061686027482113382288593,0.0442774388174198061686027482113382288593,0.0285313886289336631813078159518782864491,0.0285313886289336631813078159518782864491,0.0123412297999871995468056670700372915759,0.0123412297999871995468056670700372915759]];
verb_Verb.main();
