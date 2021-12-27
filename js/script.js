
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
    Monitors 'change' events when a user selects a color.
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
    create the `toggleDisabledActivity` function
    Disables elements based on the 'active' argument passed, and the 'activity' element object provided.
*/

function toggleDisabledActivity(active, activity) {
    if (!active) {
        activity.disabled = false;
        activity.parentElement.classList.remove('disabled');
    } else {
        activity.disabled = true;
        activity.parentElement.classList.add('disabled');
    }
}

/* 
    create the `getAllPickedActivities` function
    creates an array of objects containing each selected activity, and the time of said activity.
    Ex: obj = { 
        ele: {element object},
        time: 'Tuesday 9am-12pm',
    } 
*/

function getAllPickedActivities(activities) {
    let arr = [];
    for (const picked of activities) {
        if (picked.checked) {
            let obj = {
                ele: picked,
                time: picked.getAttribute('data-day-and-time')
            }
            arr.push(obj);
        }
    }
    //console.log(arr);
    return arr;
}


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
    let newTotalCost = 0;
    let newTotalSelected = 0;
    let allPicked = getAllPickedActivities(activities);

    //When user clicks on each activity input.
    if (activity.tagName === 'INPUT') {

        //Check picked and nonpicked events.
        for (const activity of activities) {
            let picked = activity.checked;
            let cost = parseInt(activity.getAttribute('data-cost'));
            let disabled = activity.disabled; 
            toggleDisabledActivity(false, activity);

            //add cost of picked events.
            if (picked) {
                newTotalCost += cost;
                newTotalSelected++;
            }

            //Disable events with matching times.
            for (const selected of allPicked) {
                let activityTime = activity.getAttribute('data-day-and-time');
                let matchingTime = selected.time === activityTime;
                let sameActivity = selected.ele === activity; 
                
                //exclude picked events.
                if (!picked) {
                    //exclude identical activities, but check for matching times.
                    if (!sameActivity && matchingTime) {
                        toggleDisabledActivity(true, activity);
                    } 
                }
            }
            
        }

        activitiesSelected = newTotalSelected; //update activities selected count.
        updateTotalCost(newTotalCost); //update selected activity cost total.
        validateActivities(); //make sure atleast one activity is selected by the user.
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

function toggleErrorNotice(valid, element, message = '') {
    let label = document.querySelector(element).parentElement;
    let isMessage = message.length > 0;
    let hint = label.querySelector('.hint');
    if (valid) {
        //Show checkmark when valid, and hide hint.
        label.classList.remove('not-valid');
        label.classList.add('valid');
        label.querySelector('.hint').style.display = '';
    } else {
        //Show an exclamation when invalid, and show a hint.
        label.classList.remove('valid');
        label.classList.add('not-valid');
        hint.style.display = 'inherit';
        if (isMessage) {
            hint.textContent = message;
        } 
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
    //if no email is provided.
    let isProvided = email.length > 0;
    let result = /^\w+@\w+\.\w+$/g.test(email);
    if (!isProvided) {
        toggleErrorNotice(result, '#email', 'Please provide an email address');
    } else {
        toggleErrorNotice(result, '#email', 'Invalid email address format, please provide a valid email address and try again');
    }
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
    let isProvided = creditCard.length > 0;
    let characterCountTest = /^\d{13,16}$/g;
    let charactersTest = /^[^\s\-]+$/g;
    let result = characterCountTest.test(creditCard) && charactersTest.test(creditCard);
    if (!isProvided) {
        toggleErrorNotice(result, '#cc-num', 'Please provide a valid credit card number');
    } else {
        toggleErrorNotice(result, '#cc-num', 'Credit card number must be between 13 - 16 digits');
    }
    return result;
}

/*
    create `validateZipCode` function 
    run zipcode against regex test, return boolean.
*/

function validateZipCode(zip) {
    let isProvided = zip.length > 0;
    let result = /\d{5}/g.test(zip);
    if (isProvided) {
        toggleErrorNotice(result, '#zip', 'Zip Code must be 5 digits');
    } else {
        toggleErrorNotice(result, '#zip', 'Please provide a valid zipcode');
    }
    return result;
}

/*
    create `validateCVV` function 
    run cvv against regex test, return boolean.
*/

function validateCVV(cvv) {
    let isProvided = cvv.length > 0;
    let result = /^\d{3}$/g.test(cvv);
    toggleErrorNotice(result, '#cvv');
    if (!isProvided) {
        toggleErrorNotice(result, '#cvv', 'Please provide a valid cvv');
    } else {
        toggleErrorNotice(result, '#cvv', 'CVV must be 3 digits');
    }
    return result;
}

/* 
    add event listener for `name` required field.
    validate field on `blur`
*/

nameField.addEventListener('blur', (e) => {
    validateName(nameField.value);
});

/* 
    add event listener for `email` required field.
    validate field on `blur`
*/

const emailField = document.querySelector('#email');
emailField.addEventListener('blur', (e) => {
    validateEmail(document.querySelector('#email').value);
});

/* 
    add event listener for `cc-num` required field.
    validate field on `blur`
*/

const ccNumField = document.querySelector('#cc-num');
ccNumField.addEventListener('blur', (e) => {
    let isCreditCard = paymentField.value === 'credit-card';
    //If credit card is selected, validate fields.
    if (isCreditCard) {
        validateCreditCard(document.querySelector('#cc-num').value);
    }
});

/* 
    add event listener for `zip` required field.
    validate field on `blur`
*/

const ccZipField = document.querySelector('#zip');
ccZipField.addEventListener('blur', (e) => {
    let isCreditCard = paymentField.value === 'credit-card';
    //If credit card is selected, validate fields.
    if (isCreditCard) {
        validateZipCode(document.querySelector('#zip').value);
    }
});

/* 
    add event listener for `cvv` required field.
    validate field on `blur`
*/

const ccCvvField = document.querySelector('#cvv');
ccCvvField.addEventListener('blur', (e) => {
    let isCreditCard = paymentField.value === 'credit-card';
    //If credit card is selected, validate fields.
    if (isCreditCard) {
        validateCVV(document.querySelector('#cvv').value);
    }
});

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

