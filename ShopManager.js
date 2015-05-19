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
            goldContainer.innerText = gold +" gold";
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
            damageText.innerText = "Damage: " + TurretTypes[id].damage;
            rateText.innerText = "Fire rate: " + TurretTypes[id].frequency;
            rangeText.innerText = "Range: " + TurretTypes[id].range;
            costText.innerText = "Cost: " + TurretTypes[id].cost;
        }

        ShopManager.purchase = function() {
            var currentItemCost = TurretTypes[currentItem].cost;
            if(currentItemCost <= gold) {
                gold -= currentItemCost;
                goldContainer.innerText = gold +" gold";
                return true;
            }
            return false; //cannot purchase
        }

        ShopManager.getCurrentItem = function() {
            return currentItem;
        }

        ShopManager.addGold = function(amount) {
            gold += amount;
            goldContainer.innerText = gold +" gold";
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