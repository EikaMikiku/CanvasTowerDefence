function Enemy(x, y, path, type) {
    this.type = type;
    this.img = document.getElementById("enemy"+this.type);
    this.x = x;
    this.y = y;
    this.moveSpeed = EnemyTypes[this.type].speed;
    this.hp = EnemyTypes[this.type].hp + Game.getInstance().getDifficultyIncrease()/80;
    console.log(this.hp);
    this.goldGain = EnemyTypes[this.type].goldGain;
    this.endPoint = Game.getInstance().getEnemiesEndPoint();
    this.path = path;
    this.currentPathTarget = 0;
    this.target = this.path[this.currentPathTarget];
    this.updateAvailable = false;
    this.finishLine = false;
}

Enemy.prototype.move = function() {
    if(!this.updateAvailable) {
        //if there is update, finish target first
        this.target = this.path[this.currentPathTarget];
    }
    if(!this.target) {
        this.target = {
            x: this.endPoint.x,
            y: this.endPoint.y
        }
        this.finishLine = true;
    }
    if(this.x.toFixed(2) === this.target.x.toFixed(2) && this.y.toFixed(2) === this.target.y.toFixed(2)) {
        if(this.finishLine) {
            //delete self
            Game.getInstance().removeEnemy(this);
            Game.getInstance().loseHp(1);
            return; //stop
        }
        //Reached target, move to enext target
        //if there is update though, start moving on a new path
        if(this.updateAvailable) {
            //using target vars because enemy vars lose precision
            this.path = aStar(this.target.x, this.target.y, this.endPoint.x, this.endPoint.y);
            this.currentPathTarget = 0;
            this.target = this.path[this.currentPathTarget];
            this.updateAvailable = false;       
        }
        this.currentPathTarget++;
        this.move();
    } else if(this.x.toFixed(2) === this.target.x.toFixed(2)){
        //if x axis match, means y axis is off
        var up = this.y - this.target.y > 0;
        if(up) {
            this.y -= this.moveSpeed;
        } else {
            this.y += this.moveSpeed;
        }
    } else {
        //x doesnt match
        var right = this.x - this.target.x < 0;
        if(right) {
            this.x += this.moveSpeed;
        } else {
            this.x -= this.moveSpeed;
        }
    }
};

Enemy.prototype.updatePath = function() {
    this.updateAvailable = true;;
};

Enemy.prototype.render = function() {
    var c = Game.getInstance().getContext();
    var cellSize = Game.getInstance().getCellSize();
    c.drawImage(this.img, 0, 0, cellSize, cellSize, this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};