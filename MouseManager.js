var MouseManager = (function() {
    var instance;
    function createInstance() {
        function MouseManager() {};
        var x = 0;
        var y = 0;
        var canvas = Game.getInstance().getCanvas();
        var cellSize = Game.getInstance().getCellSize();
        var cellX = 0;
        var cellY = 0;
        var isDown = false;

        /*INIT*/
        MouseManager.init = function() {
            canvas.addEventListener("mousemove", function(e) {
                var rect = canvas.getBoundingClientRect();
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
                cellX = ~~(x/cellSize);
                cellY = ~~(y/cellSize);
                
            });
            canvas.addEventListener("mousedown", function() {
                isDown = true;
            });
            canvas.addEventListener("mouseup", function() {
                isDown = false;
            });
        };

        /*HANDLER MANAGEMENT*/
        MouseManager.addClickHandler = function(handler) {
            canvas.addEventListener("click", handler);
        };
        MouseManager.addMoveHandler = function(handler) {
            canvas.addEventListener("mousemove", handler);
        };

        /*GETTERS*/
        MouseManager.getCellMousePos = function() {
            return {
                x: cellX,
                y: cellY
            };
        };
        MouseManager.isMouseDown = function() {
            return isDown;
        }

        return MouseManager;
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