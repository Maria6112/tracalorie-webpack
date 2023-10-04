class Meal {
    constructor(name, calories) {
        // make the random id (we don't have api, need to create new id). slice(2) it's for reed of 0. in the beginning
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        // make the random id (we don't have api, need to create new id). slice(2) it's for reed of 0. in the beginning
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

export { Meal, Workout };