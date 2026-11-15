// MPLS Dog Boarding: Request a Stay form (book.html)

var form = document.getElementById('booking-form');
var ownerInput = document.getElementById('owner-name');
var emailInput = document.getElementById('email');
var dogInput = document.getElementById('dog-name');
var dropoffInput = document.getElementById('dropoff');
var pickupInput = document.getElementById('pickup');
var statusBox = document.getElementById('booking-status');

// JavaScript is running, so turn off the browser's pop-up messages and show our own.
// (Without JavaScript, "required" and type="email" still work on their own.)
form.noValidate = true;

/* ---------- Date helpers ---------- */

// Today as "YYYY-MM-DD" in the visitor's local time zone, the same format a date input uses.
// (toISOString() would use UTC and can be off by one day in the evening.)
function todayString() {
  var d = new Date();
  var month = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + month + '-' + day;
}

// "YYYY-MM-DD" strings sort in date order, so they can be compared with < and >.
// This helper is only needed to find the day of the week.
function isSunday(value) {
  var parts = value.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]).getDay() === 0;
}

// Error prevention: the date pickers do not offer past dates
dropoffInput.min = todayString();
pickupInput.min = todayString();

// Pick up can't be before drop off, so move the pick up picker's earliest date along with it
dropoffInput.addEventListener('change', function () {
  pickupInput.min = dropoffInput.value || todayString();
});

/* ---------- Showing and clearing errors ---------- */

// Each input's error message is the <p> with the id "<input id>-error"
function errorFor(input) {
  return document.getElementById(input.id + '-error');
}

function showError(input, message) {
  var box = errorFor(input);
  box.textContent = 'Error: ' + message; // the word "Error" means color is not the only signal
  box.hidden = false;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  var box = errorFor(input);
  box.textContent = '';
  box.hidden = true;
  input.removeAttribute('aria-invalid');
}

// Remove a field's error as soon as the visitor starts fixing it
[ownerInput, emailInput, dogInput, dropoffInput, pickupInput].forEach(function (input) {
  input.addEventListener('input', function () { clearError(input); });
});

/* ---------- Checking the form ---------- */

// Returns the first field with a problem, or null if everything is fine
function checkForm() {
  var firstBad = null;
  var today = todayString();
  var drop = dropoffInput.value;
  var pick = pickupInput.value;
  var email = emailInput.value.trim();

  [ownerInput, emailInput, dogInput, dropoffInput, pickupInput].forEach(clearError);

  function fail(input, message) {
    showError(input, message);
    firstBad = firstBad || input;
  }

  if (!ownerInput.value.trim()) {
    fail(ownerInput, 'Enter your name.');
  }

  if (!email) {
    fail(emailInput, 'Enter your email address, like name@example.com.');
  } else if (emailInput.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail(emailInput, 'Enter an email like name@example.com.');
  }

  if (!dogInput.value.trim()) {
    fail(dogInput, "Enter your dog's name.");
  }

  // badInput: the browser could not read a date that was typed in
  if (dropoffInput.validity.badInput) {
    fail(dropoffInput, 'Enter a full drop off date, with month, day, and year.');
  } else if (!drop) {
    fail(dropoffInput, 'Choose the date you will drop off your dog.');
  } else if (drop < today) {
    fail(dropoffInput, 'This date has already passed. Choose today or a later date.');
  } else if (isSunday(drop)) {
    fail(dropoffInput, 'We are closed on Sunday. Choose a drop off date from Monday to Saturday.');
  }

  if (pickupInput.validity.badInput) {
    fail(pickupInput, 'Enter a full pick up date, with month, day, and year.');
  } else if (!pick) {
    fail(pickupInput, 'Choose the date you will pick up your dog.');
  } else if (drop && pick <= drop) {
    fail(pickupInput, 'Your pick up date is on or before your drop off date. Choose a pick up date that is after your drop off date.');
  } else if (isSunday(pick)) {
    fail(pickupInput, 'We are closed on Sunday. Choose a pick up date from Monday to Saturday.');
  }

  return firstBad;
}

/* ---------- Submitting ---------- */

form.addEventListener('submit', function (event) {
  event.preventDefault(); // stay on this page; there is no server yet

  statusBox.textContent = '';
  statusBox.classList.remove('is-shown');

  var firstBad = checkForm();
  if (firstBad) {
    // After a failed submit, move focus to the first problem so keyboard
    // and screen reader users land right on the message that explains it.
    firstBad.focus();
    return;
  }

  // The data the Node.js backend will receive
  var request = {
    ownerName: ownerInput.value.trim(),
    email: emailInput.value.trim(),
    dogName: dogInput.value.trim(),
    dropoffDate: dropoffInput.value,
    pickupDate: pickupInput.value
  };

  // TODO (next module): send the request to the Node.js backend here, for example:
  //   fetch('/api/bookings', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(request)
  //   })
  //     .then(function (response) {
  //       if (!response.ok) throw new Error('Request failed');
  //       showSuccess();
  //     })
  //     .catch(function () {
  //       // Show a plain-language message in the status area, such as:
  //       // "Sorry, we could not send your request. Please try again or call us at 612 555 0142."
  //     });
  // For now, simulate a successful request:
  console.log('Simulated stay request:', request);
  showSuccess();
});

function showSuccess() {
  form.reset();
  pickupInput.min = todayString();
  // Focus is NOT moved. role="status" on the container makes screen readers read this out.
  // The short delay makes sure the message is announced again if the visitor sends a second request.
  setTimeout(function () {
    statusBox.textContent = 'Request received. We will reply within one business day.';
    statusBox.classList.add('is-shown');
  }, 100);
}
