function Turret(x,y,type) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.range = TurretTypes[type].range;
    this.damage = TurretTypes[type].damage;
    this.frequency = TurretTypes[type].frequency;
    this.rayColor = TurretTypes[type].rayColor;
    this.rayWidth = TurretTypes[type].rayWidth;
    this.img = document.getElementById("turret"+this.type);
    this.showRay = false;
    this.shootAllowed = true;
}
Turret.prototype.shoot = function(enemy) {
    var c = Game.getInstance().getContext();
    var cellSize = Game.getInstance().getCellSize();
    if(this.shootAllowed) {
        this.shootAllowed = false;
        this.showRay = true;
        enemy.hp -= this.damage;
        if(enemy.hp <= 0) {
            Game.getInstance().removeEnemy(enemy);
            var gain = ~~(enemy.goldGain * (Game.getInstance().getDifficultyIncrease() / 4000));
            ShopManager.getInstance().addGold(gain);
            Game.getInstance().addScore(gain);
        }
        setTimeout(function(that) {
            return function() {
                that.shootAllowed = true;
            }
        }(this), this.frequency);
    }
    if(this.showRay) {
        c.save();
        c.lineWidth = this.rayWidth;
        c.strokeStyle = this.rayColor;
        c.beginPath();
        c.moveTo((this.x+0.5) * cellSize, (this.y+0.5) * cellSize);
        c.lineTo((enemy.x+0.5) * cellSize, (enemy.y+0.5) * cellSize);
        c.stroke();
        c.restore();
        setTimeout(function(that) {
            return function() {
                that.showRay = false;
            }
        }(this), this.frequency/2);
    }
};
Turret.prototype.render = function() {
    var c = Game.getInstance().getContext();
    var cellSize = Game.getInstance().getCellSize();
    c.drawImage(this.img, 0, 0, cellSize, cellSize, this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};