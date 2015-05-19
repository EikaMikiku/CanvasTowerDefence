function aStar(sx,sy,ex,ey) {
    var openNodes = [new Node(sx, sy, null)];
    var closedNodes = [];

    function Node(x,y,parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
    }

    function getH(node) {
        return getDistance(node, new Node(ex, ey));
    }

    function getG(node) {
        if(node.parent) {
            return node.parent.g + getDistance(node, node.parent);
        } else {
            return 0;
        }
    }

    function getDistance(node1, node2) {
        return Math.abs(node1.x-node2.x) + Math.abs(node1.y-node2.y);
    }

    function getNeighbours(node) {
        var neighbours = [];
        var map = Game.getInstance().getMap();
        if(map[node.y][node.x-1] && map[node.y][node.x-1].passable) {
            neighbours.push(new Node(node.x-1, node.y, node));
        }
        if(map[node.y][node.x+1] && map[node.y][node.x+1].passable) {
            neighbours.push(new Node(node.x+1, node.y, node));
        }
        if(map[node.y-1][node.x] && map[node.y-1][node.x].passable) {
            neighbours.push(new Node(node.x, node.y-1, node));
        }
        if(map[node.y+1][node.x] && map[node.y+1][node.x].passable) {
            neighbours.push(new Node(node.x, node.y+1, node));
        }
        return neighbours;
    }

    function getCurrent() {
        var minF = Infinity;
        var minG = Infinity;
        var minH = Infinity;
        var minAt = -1;

        //No available path
        if(openNodes.length === 0) {
            return;
        }

        for(var i = 0; i < openNodes.length; i++) {
            var h = getH(openNodes[i]);
            var g = getG(openNodes[i]);
            var f = h + g;
            if(f < minF) {
                minF = f;
                minG = g;
                minH = h;
                minAt = i;
            } else if(f === minF) {
                //if equal f value, get with lowest heuristic
                if(h < minH) {
                    minF = f;
                    minG = g;
                    minH = h;
                    minAt = i;
                }
            }
        }
        var node = openNodes[minAt];
        node.g = minG;
        node.h = minH;
        openNodes.splice(minAt,1); //remove from open
        closedNodes.push(node); //add to closed
        return node;
    }

    function isOpenNode(node) {
        for(var i = 0; i < openNodes.length; i++) {
            if(node.x === openNodes[i].x && node.y === openNodes[i].y) {
                return true;
            }
        }
        return false;
    }

    function isClosedNode(node) {
        for(var i = 0; i < closedNodes.length; i++) {
            if(node.x === closedNodes[i].x && node.y === closedNodes[i].y) {
                return true;
            }
        }
        return false;
    }

    function isTargetNode(node) {
        return node.x === ex && node.y === ey;
    }

    function getFromOpen(node) {
        for(var i = 0; i < openNodes.length; i++) {
            if(node.x === openNodes[i].x && node.y === openNodes[i].y) {
                return openNodes[i];
            }
        }     
    }

    while(true) {
        var current = getCurrent();
        if(!current) return null;
        if(isTargetNode(current)) {
            break;
        }

        var neighbours = getNeighbours(current);

        for(var i = 0; i < neighbours.length; i++) {
            if(isClosedNode(neighbours[i])) continue; //already calculated
            var nG = getG(neighbours[i]);
            var nH = getH(neighbours[i]);
            var nF = nG + nH;
            if(isOpenNode(neighbours[i])) {
                //if in open list, compare F
                var openNeighbourNode = getFromOpen(neighbours[i]);
                if(nF < openNeighbourNode.h + openNeighbourNode.g) {
                    openNeighbourNode.parent = current;
                    openNeighbourNode.h = nH;
                    openNeighbourNode.g = nG;
                }
            } else {
                //add to open list
                neighbours[i].g = nG;
                neighbours[i].h = nH;
                openNodes.push(neighbours[i]);
            }
        }
    }
    var path = [];
    while(current.parent) {
        path.push({
            x: current.parent.x,
            y: current.parent.y
        });
        current = current.parent;
    }
    return path.reverse();
}