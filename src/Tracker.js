import Storage from './Storage';

class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals(); //here we store the meals
        this._workouts = Storage.getWorkouts(); //here we store the workouts

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.getElementById('limit').value = this._calorieLimit; //view the limit in the set
    }

    // Public methods/API //
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories; 
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        this._render();
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id); //if it's false it will pass negative -1

        if (index !== -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories; //take away the calories 
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index, 1); //remove the meal from the array (1=only one meal)
            Storage.removeMeal(id);
            this._render();
        }
    }
    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id); //if it's false it will pass negative -1

        if (index !== -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories; // + calories
            Storage.updateTotalCalories(this._totalCalories);
            this._workouts.splice(index, 1); //remove the workout from the array (1=only one workout)
            Storage.removeWorkout(id);
            this._render();
        }
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    loadItems() {
        this._meals.forEach(meal=>this._displayNewMeal(meal));
        this._workouts.forEach(workout=>this._displayNewWorkout(workout));
    }

    // Private methods //

    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }
    _displayCaloriesLimit() {
        const calorieLimitEl = document.getElementById('calories-limit');
        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');
        // loop thrue the meals and add the calories.
        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
        caloriesConsumedEl.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        // loop thrue the meals and add the calories.
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
        caloriesBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress');
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remaining;

        // adding to the box red background
        if (remaining<=0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
        }
    }

    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }

    _displayNewMeal(meal) {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div'); //create the div
        mealEl.classList.add('card', 'my-2'); //create the classes
        mealEl.setAttribute('data-id', meal.id); //set the id 
        mealEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${meal.name}</h4>
                    <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                    ${meal.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
        mealsEl.appendChild(mealEl);
    }
    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div'); //create the div
        workoutEl.classList.add('card', 'my-2'); //create the classes
        workoutEl.setAttribute('data-id', workout.id); //set the id 
        workoutEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
        `;
        workoutsEl.appendChild(workoutEl);
    }

    // if we changed something, we need to create a render method for cheking every time if something changed
    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

export default CalorieTracker;