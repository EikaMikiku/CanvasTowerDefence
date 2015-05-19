var BlockTypes = [
    {
        name:"air",
        color: "rgba(0,0,0,0)",
        passable: true,
        idx: 0
    },
    {
        name:"block",
        color: "black",
        passable: false,
        idx: 1
    },
    {
        name:"start",
        color: "red",
        passable: true,
        idx: 2
    },
    {
        name:"finish",
        color: "orange",
        passable: true,
        idx: 3
    }
];
var EnemyTypes = [
    {
        idx: 0,
        hp: 20,
        speed: 0.1,
        goldGain: 30
    },
    {
        idx: 1,
        hp: 50,
        speed: 0.2,
        goldGain: 40
    },
    {
        idx: 2,
        hp: 200,
        speed: 0.05,
        goldGain: 80
    },
    {
        idx: 3,
        hp: 500,
        speed: 0.025,
        goldGain: 200
    }
];
var TurretTypes = [
    {
        idx: 0,
        range: 5,
        damage: 4,
        frequency: 100,
        cost: 200,
        rayColor: "red",
        rayWidth: 2,
        passable: false
    },
    {
        idx: 1,
        range: 8,
        damage: 9,
        frequency: 200,
        cost: 350,
        rayColor: "lime",
        rayWidth: 2,
        passable: false
    }
];
var StoryBoard = [
//this will have enemytypes and enemy cooldowns and timings when to start "playing"
];