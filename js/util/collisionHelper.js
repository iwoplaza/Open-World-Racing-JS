var CollisionHelper = {
    calculateIntercept: function(boundingBox, vecA, vecB) {
        var vec3d = this.collideWithXPlane(boundingBox, boundingBox.getMinX(), vecA, vecB);
        var enumfacing = Block.SIDE_LEFT;
        var vec3d1 = this.collideWithXPlane(boundingBox, boundingBox.getMaxX(), vecA, vecB);

        if (vec3d1 != undefined && this.isClosest(vecA, vec3d, vec3d1))
        {
            vec3d = Vector3f.clone(vec3d1);
            enumfacing = Block.SIDE_RIGHT;
        }

        vec3d1 = this.collideWithYPlane(boundingBox, boundingBox.getMinY(), vecA, vecB);

        if (vec3d1 != undefined && this.isClosest(vecA, vec3d, vec3d1))
        {
            vec3d = Vector3f.clone(vec3d1);
            enumfacing = Block.SIDE_BOTTOM;
        }

        vec3d1 = this.collideWithYPlane(boundingBox, boundingBox.getMaxY(), vecA, vecB);

        if (vec3d1 != undefined && this.isClosest(vecA, vec3d, vec3d1))
        {
            vec3d = Vector3f.clone(vec3d1);
            enumfacing = Block.SIDE_TOP;
        }

        vec3d1 = this.collideWithZPlane(boundingBox, boundingBox.getMinZ(), vecA, vecB);

        if (vec3d1 != undefined && this.isClosest(vecA, vec3d, vec3d1))
        {
            vec3d = Vector3f.clone(vec3d1);
            enumfacing = Block.SIDE_BACK;
        }

        vec3d1 = this.collideWithZPlane(boundingBox, boundingBox.getMaxZ(), vecA, vecB);

        if (vec3d1 != undefined && this.isClosest(vecA, vec3d, vec3d1))
        {
            vec3d = Vector3f.clone(vec3d1);
            enumfacing = Block.SIDE_FRONT;
        }

        return vec3d == undefined ? undefined : {
            facing: enumfacing,
            hitPoint: vec3d
        };
    },
    
    isClosest: function(p_186661_1_, p_186661_2_, p_186661_3_)
    {
        return p_186661_2_ == undefined || p_186661_1_.getSquareDistanceTo(p_186661_3_) < p_186661_1_.getSquareDistanceTo(p_186661_2_);
    },
    
    collideWithXPlane: function(boundingBox, p_186671_1_, vecA, vecB) {
        var vec3d = this.getIntermediateWithXValue(vecA, vecB, p_186671_1_);
        return vec3d != undefined && this.intersectsWithYZ(boundingBox, vec3d) ? vec3d : undefined;
    },

    collideWithYPlane: function(boundingBox, p_186671_1_, vecA, vecB) {
        var vec3d = this.getIntermediateWithYValue(vecA, vecB, p_186671_1_);
        //console.dir(vec3d);
        return vec3d != undefined && this.intersectsWithXZ(boundingBox, vec3d) ? vec3d : undefined;
    },

    collideWithZPlane: function(boundingBox, p_186665_1_, vecA, vecB) {
        var vec3d = this.getIntermediateWithZValue(vecA, vecB, p_186665_1_);
        return vec3d != undefined && this.intersectsWithXY(boundingBox, vec3d) ? vec3d : undefined;
    },
    
    getIntermediateWithXValue: function(vecA, vec, x)
    {
        var d0 = vec.x - vecA.x;
        var d1 = vec.y - vecA.y;
        var d2 = vec.z - vecA.z;

        if (d0 * d0 < 1.0000000116860974E-7)
        {
            return undefined;
        }
        else
        {
            var d3 = (x - vecA.x) / d0;
            return d3 >= 0.0 && d3 <= 1.0 ? new Vector3f(vecA.x + d0 * d3, vecA.y + d1 * d3, vecA.z + d2 * d3) : undefined;
        }
    },
    
    getIntermediateWithYValue: function(vecA, vec, y)
    {
        var d0 = vec.x - vecA.x;
        var d1 = vec.y - vecA.y;
        var d2 = vec.z - vecA.z;

        if (d1 * d1 < 1.0000000116860974E-7)
        {
            return undefined;
        }
        else
        {
            var d3 = (y - vecA.y) / d1;
            return d3 >= 0.0 && d3 <= 1.0 ? new Vector3f(vecA.x + d0 * d3, vecA.y + d1 * d3, vecA.z + d2 * d3) : undefined;
        }
    },
    
    getIntermediateWithZValue: function(vecA, vec, z)
    {
        var d0 = vec.x - vecA.x;
        var d1 = vec.y - vecA.y;
        var d2 = vec.z - vecA.z;

        if (d2 * d2 < 1.0000000116860974E-7)
        {
            return undefined;
        }
        else
        {
            var d3 = (z - vecA.z) / d2;
            return d3 >= 0.0 && d3 <= 1.0 ? new Vector3f(vecA.x + d0 * d3, vecA.y + d1 * d3, vecA.z + d2 * d3) : undefined;
        }
    },
    
    intersectsWithYZ: function(boundingBox, vec)
    {
        return vec.y >= boundingBox.getMinY() && vec.y <= boundingBox.getMaxY() && vec.z >= boundingBox.getMinZ() && vec.z <= boundingBox.getMaxZ();
    },
    
    intersectsWithXZ: function(boundingBox, vec)
    {
        return vec.x >= boundingBox.getMinX() && vec.x <= boundingBox.getMaxX() && vec.z >= boundingBox.getMinZ() && vec.z <= boundingBox.getMaxZ();
    },
    
    intersectsWithXY: function(boundingBox, vec)
    {
        return vec.x >= boundingBox.getMinX() && vec.x <= boundingBox.getMaxX() && vec.y >= boundingBox.getMinY() && vec.y <= boundingBox.getMaxY();
    }
};