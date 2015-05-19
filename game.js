var Game = (function() {
    var instance;
    function createInstance() {
        function Game() {};
        var canvas = document.getElementById("canvas");
        var c = canvas.getContext("2d");
        var cellSize = 10;
        var gridAlpha = 0;
        var mousePositionAlpha = 0.5;
        var width = canvas.width / cellSize;
        var height = canvas.height / cellSize;
        var gameMap = [];
        var hp = 30;
        var hpContainer = document.getElementById("hpContainer");
        var difficultyIncrease = 0;
        /*Enemy vars*/
        var enemySpawnPoint = {
            x: 0,
            y: 14
        };
        var enemyEndPoint = {
            x: width-1,
            y: 14
        };
        var enemyPath = null;
        var enemies = [];
        var enemyTimeout = 1200;
        var enemyAllowed = false;
        /*Turret vars*/
        var turrets = [];

        /*INIT*/
        Game.init = function() {
            var x,
                y,
                set;

            //Initialise map
            for(y = 0; y < height; y++) {
                gameMap[y] = [];
                for(x = 0; x < width; x++) {
                    set = BlockTypes[0];
                    if(y===0 || y===height-1 || x===0 || x===width-1) {
                        set = BlockTypes[1]; //Set wall around the area
                    }
                    gameMap[y][x] = set;
                }   
            }
            //Set enemy entry and end points
            gameMap[enemySpawnPoint.y][enemySpawnPoint.x] = BlockTypes[2];
            gameMap[enemyEndPoint.y][enemyEndPoint.x] = BlockTypes[3];

            //Set purchase on click
            MouseManager.getInstance().addClickHandler(function() {
                if(ShopManager.getInstance().purchase()) {
                    var pos = MouseManager.getInstance().getCellMousePos();
                    gameMap[pos.y][pos.x] = BlockTypes[1];
                    turrets.push(new Turret(pos.x, pos.y, ShopManager.getInstance().getCurrentItem()));
                    for(var i = 0; i < enemies.length; i++) {
                        enemies[i].updatePath();
                    }
                    updateEnemyPath();
                }
            });
            enemyPath = aStar(enemySpawnPoint.x, enemySpawnPoint.y, enemyEndPoint.x, enemyEndPoint.y);
            setTimeout(function() {
                enemyAllowed = true;
            }, 4000);
            hpContainer.innerText = "HP: " + hp;
            loop();
        };

        function updateEnemyPath() {
            enemyPath = aStar(enemySpawnPoint.x, enemySpawnPoint.y, enemyEndPoint.x, enemyEndPoint.y);
            if(!enemyPath) {
                alert("No path found");
            }
        }

        /*GAME CYCLE*/
        function loop() {
            if(enemyAllowed && enemyPath) {
                enemyAllowed = false;
                enemies.push(new Enemy(enemySpawnPoint.x, enemySpawnPoint.y, enemyPath, ~~(Math.random()*4)));

                setTimeout(function() {
                    enemyAllowed = true;
                }, enemyTimeout-difficultyIncrease/800)
            }
            (function MoveEnemies() {
                for(var i = 0; i < enemies.length; i++) {
                    enemies[i].move();
                }
            })();
            difficultyIncrease++;
            render();
            requestAnimationFrame(loop);
        };
        
        /*RENDER CYCLE*/
        function render() {
            c.clearRect(0,0,canvas.width, canvas.height);
            var cellPos = MouseManager.getInstance().getCellMousePos();
            (function DrawGrid(){
                c.save();
                c.globalAlpha = gridAlpha;
                c.lineWidth = 2;
                for(var i = 0; i < width; i++) {
                    c.beginPath();
                    c.moveTo(i*cellSize, 0);
                    c.lineTo(i*cellSize, canvas.height);
                    c.stroke();
                }
                for(var i = 0; i < height; i++) {
                    c.beginPath();
                    c.moveTo(0, i*cellSize);
                    c.lineTo(canvas.width, i*cellSize);
                    c.stroke();
                }
                c.restore();
            })();
            //Draw enemies should be before draw map, because
            //Spawn point should paint over them
            (function DrawEnemies() {
                for(var i = 0; i < enemies.length; i++) {
                    enemies[i].render();
                }
            })();
            (function DrawMap() {
                c.save();
                for(y = 0; y < height; y++) {
                    for(x = 0; x < width; x++) {
                        c.fillStyle = gameMap[y][x].color;
                        c.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
                    }   
                }
                c.restore();
            })();
            (function DrawTurrets() {
                for(var i = 0; i < turrets.length; i++) {
                    var tRange = turrets[i].range;
                    turrets[i].render();
                    //Check turret proximity
                    for(var t = 0; t < enemies.length; t++) {
                        var distance = Math.abs(enemies[t].x - turrets[i].x) + Math.abs(enemies[t].y - turrets[i].y);
                        if(distance < tRange) {
                            turrets[i].shoot(enemies[t]);
                            break;
                        }
                    }
                }
            })();
            (function DrawMousePosition() {
                c.save();
                c.globalAlpha = mousePositionAlpha;
                c.fillRect(cellPos.x*cellSize, cellPos.y*cellSize, cellSize, cellSize);
                c.restore();
            })();
        };

        /*ENEMY MANAGEMENT*/
        Game.removeEnemy = function(enemy) {
            for(var i = 0; i < enemies.length; i++) {
                if(enemies[i].x === enemy.x && enemies[i].y === enemy.y) {
                    return enemies.splice(i, 1);
                }
            }
        };
        
        Game.loseHp = function(amount) {
            hp -= amount;
            if(hp <= 0) {
                alert("Game over");
            }
            hpContainer.innerText = "HP: " + hp;
        };

        /*PUBLIC GETTERS*/
        Game.getCanvas = function() {
            return canvas;
        };
        Game.getContext = function() {
            return c;
        };
        Game.getCellSize = function() {
            return cellSize;
        };
        Game.getEnemiesEndPoint = function() {
            return enemyEndPoint;
        };
        Game.getMap = function() {
            return gameMap;
        };
        Game.getDifficultyIncrease = function() {
            return difficultyIncrease;
        };

        return Game;
    };

    return {
        getInstance: function() {
            if(!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

window.addEventListener("load", function(event) {
    MouseManager.getInstance().init();
    ShopManager.getInstance().init();
    Game.getInstance().init();
});