
MAX_CHILDREN = 3;
MAX_DEPTH = 3;
BIRTH_RADIUS = 70;
NOISE = 5;

function normalize(x, y) {
    mag = sqrt(x**2 + y**2);
    return [x/mag, y/mag];
}

function calcOutwardVector(x, y) {
    // Returns an [x,y] vector away from the canvas center
    vx = x - width/2;
    vy = y - height/2;
    return normalize(vx, vy);
}

function Node(parentNode) {
    this.depth = parentNode ? parentNode.depth + 1 : 0;
    this.diameter = random(2,10);
    this.parent = parentNode;
    this.children = [];
    this.c = color(0, random(200));
    // Calculate direction away from center
    this.outwardVector = parentNode ? 
        calcOutwardVector(parentNode.x, parentNode.y) : 
        random(-NOISE, NOISE);
    // Update own coordinates as parent's coordinates + outwardVector, with some noise
    this.x = parentNode ? 
        parentNode.x + random(BIRTH_RADIUS) * this.outwardVector[0] + random(-NOISE, NOISE) : 
        width/2 + random(-NOISE, NOISE);
    this.y = parentNode ? 
        parentNode.y + random(BIRTH_RADIUS) * this.outwardVector[1] + random(-NOISE, NOISE) : 
        height/2 + random(-NOISE, NOISE);

    this.display = function() {
        fill(this.c);
        if (this.parent) { // The root node doesn't have a parent
            line(this.parent.x, this.parent.y, this.x, this.y);
        }
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }

    this.maybeGrow = function() {
        if (this.depth <= MAX_DEPTH && this.children.length <= MAX_CHILDREN && random(100) > 95) {
            babyNode = new Node(this);
            babyNode.display();
            this.children.push(babyNode);
            nodeCount++;
        }
        // Recursively grow children
        this.children.forEach(childNode => {
            childNode.maybeGrow();
        });
    }
}