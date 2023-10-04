import '@fortawesome/fontawesome-free/js/all'; //we also need the js
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';



import './css/bootstrap.css';
import './css/style.css';

class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._loadEventListeners();
        this._tracker.loadItems();
    }

    _loadEventListeners() {
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
    
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));
        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));
        document.getElementById('reset').addEventListener('click', this._reset.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
        
    }

    _newItem(type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        // Validate input
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value); // add + to calories to submite the calories with number and not the string
            this._tracker.addMeal(meal);
        } else {
            const workout = new Workout(name.value, +calories.value); // add + to calories to submite the calories with number and not the string
            this._tracker.addWorkout(workout);
        }

        name.value = ''; //clear the filled
        calories.value = '';

        // to close the forms after adding the meal
        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new Collapse(collapseItem, {
            toggle: true
        });

    }

    _removeItem(type, e) {
        //we need to target button class 'delete', and the icon class 'fa-xmark'
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');
                
                type === 'meal'
                    ? this._tracker.removeMeal(id)
                    : this._tracker.removeWorkout(id);
                
                e.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        //we wont to get id of both types
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;

            // if the name matches
            if (name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
             }
        }); 
    }

    _reset() {
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = ''; //to make sure that filter fileds clear
        document.getElementById('filter-workouts').value = '';
    }
    _setLimit(e) {
        e.preventDefault();

        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Please add a limit');
            return;
        }
        // make sure that setLimit is without _ (he is public, we accessing that from the App class)
        this._tracker.setLimit(+limit.value); // + changes  data from string to a number
        limit.value = ''; //clear the limit form

        //close the modul of set limit
        const modalEl = document.getElementById('limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();




// how to add meals/workouts - only for check. not to the DOM
// const tracker = new CalorieTracker();

// const breakfast = new Meal('Breakfast', 400);
// const lunch = new Meal('Lunch', 920);
// tracker.addMeal(breakfast);
// tracker.addMeal(lunch);

// const run = new Workout('Morning Run', 320);
// tracker.addWorkout(run);

// after we have the tracker