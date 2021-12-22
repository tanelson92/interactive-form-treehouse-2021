
/*
    Focus 'Name' field on app start.
*/
const nameField = document.querySelector('#name');
nameField.focus();

/*
    Add Event listener for 'job' field changes.
*/
const jobField = document.querySelector('#title');
jobField.addEventListener('change', (e) => {
    const jobSelected = e.target.value;
    const showOther = jobSelected === 'other';
    let other = document.querySelector('#other-job-role');
    //If "other" job role, prompt user to define their job role.
    other.hidden = !showOther;
});

/*
    Add event listener for 'T-Shirt Design' field changes.
*/
const designField = document.querySelector('#design');
designField.addEventListener('change', (e) => {
    let designType = designField.value;
    const colorField = document.querySelector('#color');
    const colorOptions = colorField.querySelectorAll('option');
    colorField.disabled = false;
    //Show color options relevant to the selected theme.
    for (const color of colorOptions) {
        if (color.value !== 'Select a design theme above') {
            const colorTheme = color.getAttribute('data-theme');
            const matching = colorTheme === designType;
            color.selected = !matching && color.selected;
            color.hidden = matching;
        }
    }
});

/* 
    create the 'updateTotalCost' function
    updates the text of the activity-cost html element based on the new cost provided. 
*/

function updateTotalCost(cost) {
    const activitiesCost = document.querySelector('#activities-cost');
    activitiesCost.textContent = `Total $${cost}`;
}

/*
    add event listener for 'Register for Activities' field changes
    Event types include: change, focus, and blur.
*/

const activityContainer = document.querySelector('#activities-box');
const activities = activityContainer.querySelectorAll('input');
let activitiesSelected = 0; //Number of activities chosen.
activityContainer.addEventListener('change', (e) => {
    const activity = e.target;
    const cost = parseInt(activity.getAttribute('data-cost'));
    //update the total cost of all activities selected.
    if (activity.tagName === 'INPUT') {
        var newTotalCost = 0;
        var newTotalSelected = 0;
        for (const selected of activities) {
            let selectedTime = activity.getAttribute('data-day-and-time');

            //check through all inputs for conflicting event times.
            for (const other of activities) {
                let otherTime = other.getAttribute('data-day-and-time');
                //disable events with conflicting times, add class to show this.
                if (selected !== other) {
                    other.disabled = selectedTime === otherTime;
                    if (selectedTime === otherTime) {
                        other.parentElement.classList.add('disabled');
                    } else {
                        other.parentElement.classList.remove('disabled');
                    }
                }
            }

            //add the cost of an activity to total cost calculated.
            if (selected.checked) {
                newTotalCost += cost;
                newTotalSelected++;
            }
        }
        activitiesSelected = newTotalSelected;
        updateTotalCost(newTotalCost);
    }
});
activityContainer.addEventListener('focus', (e) => {
    const activity = e.target;
    if (activity.tagName === 'INPUT') {
        activity.parentElement.classList.add('focus');
    }
});
activityContainer.addEventListener('blur', (e) => {
    const activity = e.target;
    if (activity.tagName === 'INPUT') {
        let label = document.querySelector('.focus');
        label.classList.remove('focus');
    }
});

/*
    add event listener for 'Payment Info'
    Show selected payment method and accompanying details. 
*/

const paymentField = document.querySelector('#payment');
paymentField.addEventListener('change', (e) => {
    const creditCardForm = document.querySelector('#credit-card');
    const payPalForm = document.querySelector('#paypal');
    const bitCoinForm = document.querySelector('#bitcoin');
    creditCardForm.hidden = paymentField.value !== 'credit-card';
    payPalForm.hidden = paymentField.value !== 'paypal';
    bitCoinForm.hidden = paymentField.value !== 'bitcoin';
});

/* 
    Create `validations` object 
    Track and monitor all formfield validation statuses globally. 
*/

function toggleErrorNotice(valid, element) {
    let label = document.querySelector(element).parentElement;
    if (valid) {
        //Show checkmark when valid, and hide hint.
        label.classList.remove('not-valid');
        label.classList.add('valid');
        label.querySelector('.hint').style.display = '';
    } else {
        //Show an exclamation when invalid, and show a hint.
        label.classList.remove('valid');
        label.classList.add('not-valid');
        label.querySelector('.hint').style.display = 'inherit';
    }
}

/*
    create `validateName` function 
    run name against regex, and return boolean.
*/

function validateName(name) {
    let result = name.length > 0;
    toggleErrorNotice(result, '#name');
    return result;
}

/*
    create `validateEmail` function 
    run email against regex, return boolean.
*/

function validateEmail(email) {
    let result = /^\w+@\w+\.\w+$/g.test(email);
    toggleErrorNotice(result, '#email');
    return result;
}

/*
    create `validateActivities` function 
    get the current number of activities selected and return boolean.
*/

function validateActivities() {
    let result = activitiesSelected > 0;
    toggleErrorNotice(result, '#activities-box');
    return result;
}

/*
    create `validateCreditCard` function 
    run credit card number against regex tests, return boolean.
*/

function validateCreditCard(creditCard) {
    let characterCountTest = /^\d{13,16}$/g;
    let charactersTest = /^[^\s\-]+$/g;
    let result = characterCountTest.test(creditCard) && charactersTest.test(creditCard);
    toggleErrorNotice(result, '#cc-num');
    return result;
}

/*
    create `validateZipCode` function 
    run zipcode against regex test, return boolean.
*/

function validateZipCode(zip) {
    let result = /\d{5}/g.test(zip);
    toggleErrorNotice(result, '#zip');
    return result;
}

/*
    create `validateCVV` function 
    run cvv against regex test, return boolean.
*/

function validateCVV(cvv) {
    let result = /^\d{3}$/g.test(cvv);
    toggleErrorNotice(result, '#cvv');
    return result;
}

/* 
    add event listener for the form submit.
    Validate form fields then submit. 
*/

const form = document.querySelector('#userForm');
form.addEventListener('submit', (e) => {
    let nameValid = validateName(nameField.value);
    let emailValid = validateEmail(document.querySelector('#email').value);
    let activitiesValid = validateActivities();
    let isCreditCard = paymentField.value === 'credit-card';
    let creditCardValid;

    //If credit card is selected, validate fields.
    if (isCreditCard) {
        let cardNumValid = validateCreditCard(document.querySelector('#cc-num').value);
        let zipCodeValid = validateZipCode(document.querySelector('#zip').value);
        let cvvNumValid = validateCVV(document.querySelector('#cvv').value);
        if (cardNumValid && zipCodeValid && cvvNumValid) { creditCardValid = true }
    }

    //If name, email, and activites are valid AND creditcard is not selected
    //OR
    //if name, email, and activities are valid AND creditcard is selected AND creditcard is valid
    if (nameValid && emailValid && activitiesValid && !isCreditCard ||
       (nameValid && emailValid && activitiesValid) && (isCreditCard && creditCardValid)
    ) {
        //submit registration form. 
        form.submit();
    } else {
        e.preventDefault();
    }

});

