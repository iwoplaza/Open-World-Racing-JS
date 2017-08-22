function BoundingBox(p_x, p_y, p_z, p_w, p_h, p_l) {
    if(p_x.x != undefined) {
        this.x = p_x.x;
        this.y = p_x.y;
        this.z = p_x.z;
        this.width = p_y.x;
        this.height = p_y.y;
        this.length = p_y.z;
    }else{
        this.x = p_x;
        this.y = p_y;
        this.z = p_z;
        this.width = p_w;
        this.height = p_h;
        this.length = p_l;
    }
    
    this.add = function(p_x, p_y, p_z) {
        if(p_x.x != undefined) {
            this.x += p_x.x;
            this.y += p_x.y;
            this.z += p_x.z;
        }else{
            this.x += p_x;
            this.y += p_y;
            this.z += p_z;
        }
    }
    
    this.getAdded = function(p_x, p_y, p_z) {
        if(p_x.x != undefined) {
            return new BoundingBox(this.x+p_x.x, this.y+p_x.y, this.z+p_x.z, this.width, this.height, this.length);
        }else{
            return new BoundingBox(this.x+p_x, this.y+p_y, this.z+p_z, this.width, this.height, this.length);
        }
    }
    
    this.set = function(p_x, p_y, p_z) {
        if(p_x.x != undefined) {
            this.x = p_x.x;
            this.y = p_x.y;
            this.z = p_x.z;
        }else{
            this.x = p_x;
            this.y = p_y;
            this.z = p_z;
        }
    }
    
    this.getMinX = function() {
        return this.x;
    }
    
    this.getMaxX = function() {
        return this.x+this.width;
    }
    
    this.getMinY = function() {
        return this.y;
    }
    
    this.getMaxY = function() {
        return this.y+this.height;
    }
    
    this.getMinZ = function() {
        return this.z;
    }
    
    this.getMaxZ = function() {
        return this.z+this.length;
    }
    
    this.calculateYOffset = function(other, offsetY)
    {
        if (other.getMaxX() > this.getMinX() && other.getMinX() < this.getMaxX() && other.getMaxZ() > this.getMinZ() && other.getMinZ() < this.getMaxZ())
        {
            if (offsetY > 0.0 && other.getMaxY() <= this.getMinY())
            {
                var d1 = this.getMinY() - other.getMaxY();

                if (d1 < offsetY)
                {
                    offsetY = d1;
                }
            }
            else if (offsetY < 0.0 && other.getMinY() >= this.getMaxY())
            {
                var d0 = this.getMaxY() - other.getMinY();

                if (d0 > offsetY)
                {
                    offsetY = d0;
                }
            }

            return offsetY;
        }
        else
        {
            return offsetY;
        }
    }
    
    this.calculateXOffset = function(other, offsetX)
    {
        if (other.getMaxY() > this.getMinY() && other.getMinY() < this.getMaxY() && other.getMaxZ() > this.getMinZ() && other.getMinZ() < this.getMaxZ())
        {
            if (offsetX > 0.0 && other.getMaxX() <= this.getMinX())
            {
                var d1 = this.getMinX() - other.getMaxX();

                if (d1 < offsetX)
                {
                    offsetX = d1;
                }
            }
            else if (offsetX < 0.0 && other.getMinX() >= this.getMaxX())
            {
                var d0 = this.getMaxX() - other.getMinX();

                if (d0 > offsetX)
                {
                    offsetX = d0;
                }
            }

            return offsetX;
        }
        else
        {
            return offsetX;
        }
    }
    
    this.calculateZOffset = function(other, offsetZ)
    {
        if (other.getMaxX() > this.getMinX() && other.getMinX() < this.getMaxX() && other.getMaxY() > this.getMinY() && other.getMinY() < this.getMaxY())
        {
            if (offsetZ > 0.0 && other.getMaxZ() <= this.getMinZ())
            {
                var d1 = this.getMinZ() - other.getMaxZ();

                if (d1 < offsetZ)
                {
                    offsetZ = d1;
                }
            }
            else if (offsetZ < 0.0 && other.getMinZ() >= this.getMaxZ())
            {
                var d0 = this.getMaxZ() - other.getMinZ();

                if (d0 > offsetZ)
                {
                    offsetZ = d0;
                }
            }

            return offsetZ;
        }
        else
        {
            return offsetZ;
        }
    }
}