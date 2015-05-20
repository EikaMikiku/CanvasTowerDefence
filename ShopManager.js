var ShopManager = (function() {
    var instance;
    function createInstance() {
        function ShopManager() {};
        var gold = 1000;
        var currentItem = 0;
        var goldContainer = document.getElementById("goldContainer");
        var currentItemImg = document.getElementById("currentItemImg");
        var turretImages = document.getElementsByClassName("turretIcon");
        var damageText = document.getElementById("currentItemDamage");
        var rateText = document.getElementById("currentItemRate");
        var rangeText = document.getElementById("currentItemRange");
        var costText = document.getElementById("currentItemCost");

        /*INIT*/
        ShopManager.init = function() {
            goldContainer.textContent = gold +" gold";
            updateCurrentItem(currentItem);
            for(var i = 0; i < turretImages.length; i++) {
                (function(num) {
                    turretImages[num].addEventListener("click", function() {
                        updateCurrentItem(num);
                    });
                })(i);
            }
        };

        function updateCurrentItem(id) {
            currentItem = id;
            currentItemImg.src = document.getElementById("turret"+currentItem).src;
            console.log(id);
            console.log(TurretTypes[id]);
            damageText.textContent = "Damage: " + TurretTypes[id].damage;
            console.log("Damage: " + TurretTypes[id].damage);
            rateText.textContent = "Fire rate: " + TurretTypes[id].frequency;
            rangeText.textContent = "Range: " + TurretTypes[id].range;
            costText.textContent = "Cost: " + TurretTypes[id].cost;
        }

        ShopManager.purchase = function() {
            var currentItemCost = TurretTypes[currentItem].cost;
            if(currentItemCost <= gold) {
                gold -= currentItemCost;
                goldContainer.textContent = gold +" gold";
                return true;
            }
            return false; //cannot purchase
        }

        ShopManager.getCurrentItem = function() {
            return currentItem;
        }

        ShopManager.addGold = function(amount) {
            gold += amount;
            goldContainer.textContent = gold +" gold";
        }

        return ShopManager;
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