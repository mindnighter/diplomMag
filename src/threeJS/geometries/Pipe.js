import * as THREE from 'three';

const Pipe = (item) => {      
    const geometry = new HollowCylinderGeometry(
        item.size.radius,
        item.size.holeRadius,
        item.size.height,
        item.size.segments,
        false
    );
    return geometry;
  
  return geometry;
};

export default Pipe;


function HollowCylinderGeometry(radius, holeRadius, height, segments, openEnded, thetaStart = 0, thetaLength = 2 * Math.PI) {

    if (!(this instanceof HollowCylinderGeometry)) {
        throw new TypeError("HollowCylinderGeometry needs to be called using new");
    }

    THREE.Geometry.call(this);

    this.type = 'HollowCylinderGeometry';

    this.parameters = {
        radius: radius,
        holeRadius: holeRadius,
        height: height,
        segments: segments,
        openEnded: openEnded,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    };

    this.fromBufferGeometry(new HollowCylinderBufferGeometry(radius, holeRadius, height, segments, openEnded, thetaStart, thetaLength));
    this.mergeVertices();

}

HollowCylinderGeometry.prototype = Object.create(THREE.Geometry.prototype);
HollowCylinderGeometry.prototype.constructor = HollowCylinderGeometry;

/**
 * 
 * @param {number} radius 
 * @param {number} holeRadius 
 * @param {number} height 
 * @param {number} segments 
 * @param {boolean} openEnded 
 * @param {number} thetaStart 
 * @param {number} thetaLength 
 */
function HollowCylinderBufferGeometry(radius, holeRadius, height, segments, openEnded, thetaStart, thetaLength) {

    if (!(this instanceof HollowCylinderBufferGeometry)) {
        throw new TypeError("HollowCylinderBufferGeometry needs to be called using new");
    }

    THREE.BufferGeometry.call(this);

    this.type = 'HollowCylinderBufferGeometry';

    this.parameters = {
        radius: radius,
        holeRadius: holeRadius,
        height: height,
        segments: segments,
        openEnded: openEnded,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    };

    var scope = this;

    radius = !isNaN(radius) ? radius : 20;
    holeRadius = !isNaN(holeRadius) ? holeRadius : 20;
    height = !isNaN(height) ? height : 100;
    segments = !isNaN(segments = Math.floor(segments)) ? segments : 8;
    openEnded = !!openEnded;
    thetaStart = !isNaN(thetaStart) ? thetaStart : 0;
    thetaLength = !isNaN(thetaLength) ? thetaLength : Math.PI * 2;


    // buffers

    var indices = [];
    var vertices = [];
    var normals = [];
    var uvs = [];

    // helper variables

    var index = 0;
    var indexArray = [];
    var halfHeight = height / 2;
    var groupStart = 0;

    // generate geometry

    generateTorso(true);
    generateTorso(false);

    if (thetaLength % (Math.PI * 2) !== 0) {
        generateSide(true);
        generateSide(false);
    }

    if (!openEnded && radius > 0) {
        generateCap(true);
        generateCap(false);
    }

    // build geometry

    this.setIndex(indices);
    this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    function generateTorso(isOuter) {

        var x, y;
        var normal = new THREE.Vector3();
        var vertex = new THREE.Vector3();

        var groupCount = 0;

        var sign = isOuter ? 1 : -1;

        var activeRadius = isOuter ? radius : holeRadius;

        // this will be used to calculate the normal
        // generate vertices, normals and uvs


        // calculate the radius of the current row
        for (y = 0; y < 2; y++) {
            var indexRow = [];
            for (x = 0; x <= segments; x++) {

                var u = x / segments;

                var theta = u * thetaLength + thetaStart;

                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);

                // vertex

                vertex.x = activeRadius * sinTheta;
                vertex.y = -y * height + halfHeight;
                vertex.z = activeRadius * cosTheta;
                vertices.push(vertex.x, vertex.y, vertex.z);

                // normal

                normal.set(sinTheta, 0, cosTheta).normalize();
                normals.push(normal.x * sign, normal.y, normal.z * sign);

                // uv

                uvs.push(u, 1 - y);

                // save index of vertex in respective row

                indexRow.push(index++);

            }
            indexArray.push(indexRow);

        }

        // generate indices

        for (x = 0; x < segments; x++) {

            // we use the index array to access the correct indices
            var addSign = isOuter ? 0 : 2;
            var a = indexArray[addSign][x];
            var b = indexArray[addSign + 1][x];
            var c = indexArray[addSign + 1][x + 1];
            var d = indexArray[addSign][x + 1];

            // faces
            if (isOuter) {
                indices.push(a, b, d);
                indices.push(b, c, d);
            } else {
                indices.push(a, d, b);
                indices.push(b, d, c);
            }
            // update group counter

            groupCount += 6;


        }

        // add a group to the geometry. this will ensure multi material support

        scope.addGroup(groupStart, groupCount, 0);

        // calculate new start value for groups

        groupStart += groupCount;

    }

    /**
     * @returns {void}
     */
    function generateCap(isTop) {
        var indexStart = index;
        var segment = 0;

        var uv = new THREE.Vector2();

        var vertex = new THREE.Vector3();
        var sign = isTop ? 1 : -1;
        var groupCount = 0;

        for (var heightIndex = 0; heightIndex < 2; heightIndex++) {
            var activeRadius = heightIndex == 0 ? holeRadius : radius;
            for (var segmentIndex = 0; segmentIndex <= segments; segmentIndex++) {

                segment = segmentIndex / segments * thetaLength + thetaStart;

                // vertex

                vertex.x = activeRadius * Math.sin(segment);
                vertex.y = halfHeight * sign;
                vertex.z = activeRadius * Math.cos(segment);

                vertices.push(vertex.x, vertex.y, vertex.z);

                // normal

                normals.push(0, sign, 0);

                // uv

                uvs.push((vertex.x / radius + 1) / 2, (vertex.z / radius + 1) / 2);

                index++;
            }
        }

        // Generate Indices

        for (var segmentIndex = 0; segmentIndex < segments; segmentIndex++) {

            segment = segmentIndex + indexStart;

            var a = segment;
            var b = segment + segments + 1;
            var c = segment + segments + 2;
            var d = segment + 1;

            // faces
            if (isTop) {
                indices.push(a, b, d);
                indices.push(b, c, d);
            } else {
                indices.push(a, d, b);
                indices.push(b, d, c);
            }
            groupCount += 6;
        }

        scope.addGroup(groupStart, groupCount, 1);

        // calculate new start value for groups

        groupStart += groupCount;
    }

    function generateSide(isLeft) {

        var indexStart = index;
        var normal = new THREE.Vector3();
        var vertex = new THREE.Vector3();

        var theta = thetaStart;
        if (isLeft) theta += thetaLength;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var y = 0; y < 2; y++) {
            for (var x = 0; x < 2; x++) {
                var activeRadius = x == 0 ? radius : holeRadius;
                vertex.x = activeRadius * sinTheta;
                vertex.y = halfHeight * (y == 0 ? -1 : 1);
                vertex.z = activeRadius * cosTheta;

                vertices.push(vertex.x, vertex.y, vertex.z);

                normal.set(sinTheta, 0, cosTheta).normalize();
                normals.push(normal.x, normal.y, normal.z);

                // uv

                uvs.push(1 - x, 1 - y);
                index++;
            }
        }

        var a = indexStart + 0;
        var b = indexStart + 1;
        var c = indexStart + 3;
        var d = indexStart + 2;

        // faces

        if (isLeft) {
            indices.push(a, b, d);
            indices.push(b, c, d);
        } else {
            indices.push(a, d, b);
            indices.push(b, d, c);
        }

        scope.addGroup(groupStart, 6, 0);

        // calculate new start value for groups

        groupStart += 6;
    }

}

HollowCylinderBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
HollowCylinderBufferGeometry.prototype.constructor = HollowCylinderBufferGeometry;
