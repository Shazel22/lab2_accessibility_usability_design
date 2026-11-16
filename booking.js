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

// Checks both dates and shows a message next to each problem.
// Used on submit and when dates are carried over from the services page,
// so typed and carried-over dates get exactly the same checks and messages.
// Returns the first date field with a problem, or null.
function checkDates() {
  var firstBad = null;
  var today = todayString();
  var drop = dropoffInput.value;
  var pick = pickupInput.value;

  clearError(dropoffInput);
  clearError(pickupInput);

  function fail(input, message) {
    showError(input, message);
    firstBad = firstBad || input;
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

// Checks the whole form. Returns the first field with a problem, or null if everything is fine.
function checkForm() {
  var firstBad = null;
  var email = emailInput.value.trim();

  [ownerInput, emailInput, dogInput].forEach(clearError);

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

  // The date checks run either way so every problem is shown at once.
  // Fields are in page order, so a name or email problem comes before a date problem.
  var badDate = checkDates();
  return firstBad || badDate;
}

/* ---------- Choices carried over from the services page ---------- */

// services.js links here with the visitor's choices in the query string, for example
// book.html?size=medium&dropoff=2026-11-18&pickup=2026-11-20&boarding=1&daycare=2&total=318.75
// Choices only, never personal information. Anything missing or invalid is ignored.

// Names and units only. No prices here: the estimated total comes from the services page.
var SERVICE_LIST = [
  { key: 'boarding', name: 'Boarding' },
  { key: 'webcam',   name: 'Webcam access' },
  { key: 'grooming', name: 'Grooming', unit: ['grooming', 'groomings'] },
  { key: 'daycare',  name: 'Daycare',  unit: ['day', 'days'] },
  { key: 'training', name: 'Training', unit: ['session', 'sessions'] },
  { key: 'taxi',     name: 'Pet taxi', unit: ['trip', 'trips'] }
];
var SIZE_NAMES = { small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'Extra large' };

var carried = readCarriedChoices();

function readCarriedChoices() {
  var params = new URLSearchParams(window.location.search);
  var result = { size: '', services: [], dropoff: '', pickup: '', total: '' };

  var size = params.get('size');
  if (SIZE_NAMES.hasOwnProperty(size)) result.size = size;

  SERVICE_LIST.forEach(function (svc) {
    var qty = parseInt(params.get(svc.key), 10);
    if (qty > 0 && qty < 100) result.services.push({ key: svc.key, qty: qty });
  });

  var total = params.get('total');
  if (total && /^\d+(\.\d{1,2})?$/.test(total)) result.total = total;

  // Dates: only the YYYY-MM-DD format. A date input also refuses impossible dates
  // such as 2026-02-31 by leaving its value empty, so keep only what it accepted.
  [['dropoff', dropoffInput], ['pickup', pickupInput]].forEach(function (pair) {
    var value = params.get(pair[0]);
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      pair[1].value = value;
      if (pair[1].value === value) result[pair[0]] = value;
    }
  });

  return result;
}

// Carried-over dates get the same checks and messages as typed dates.
// Keyboard focus is NOT moved on page load.
function checkCarriedDates() {
  if (!carried.dropoff && !carried.pickup) return; // nothing came over: no errors

  if (dropoffInput.value) pickupInput.min = dropoffInput.value;

  // Only show errors for a date that arrived; a missing one is not an error until submit
  checkDates();
  if (!dropoffInput.value) clearError(dropoffInput);
  if (!pickupInput.value) clearError(pickupInput);
}

/* ---------- "Your selections" summary ---------- */

var selSize = document.getElementById('sel-size');
var selServices = document.getElementById('sel-services');
var selDropoff = document.getElementById('sel-dropoff');
var selPickup = document.getElementById('sel-pickup');
var selTotal = document.getElementById('sel-total');
var editLink = document.getElementById('edit-link');

// "2026-11-18" -> "Wednesday, November 18, 2026"
function formatDate(value) {
  var parts = value.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

// For example "Daycare: 2 days", or just "Boarding" for an on/off service
function serviceText(choice) {
  var svc = SERVICE_LIST.filter(function (s) { return s.key === choice.key; })[0];
  if (!svc.unit) return svc.name;
  return svc.name + ': ' + choice.qty + ' ' + (choice.qty === 1 ? svc.unit[0] : svc.unit[1]);
}

// Text is always set with textContent, never innerHTML, because it comes from the URL
function renderSummary() {
  var drop = dropoffInput.value;
  var pick = pickupInput.value;
  var hasChoices = carried.size || carried.services.length;

  selSize.textContent = carried.size ? SIZE_NAMES[carried.size] : 'Not chosen yet';

  selServices.textContent = '';
  if (carried.services.length) {
    var ul = document.createElement('ul');
    carried.services.forEach(function (choice) {
      var li = document.createElement('li');
      li.textContent = serviceText(choice);
      ul.appendChild(li);
    });
    selServices.appendChild(ul);
  } else {
    selServices.textContent = "You haven't chosen any services yet.";
  }

  // Dates always show what is in the form right now, so they stay accurate after edits
  selDropoff.textContent = drop ? formatDate(drop) : 'Not chosen yet';
  selPickup.textContent = pick ? formatDate(pick) : 'Not chosen yet';

  // The total was worked out on the services page for the dates sent from there.
  // If the dates here are different, that total is out of date, so say so instead of showing it.
  if (!carried.total) {
    selTotal.textContent = 'Not worked out yet. Choose services on the services page to see an estimate.';
  } else if (drop !== carried.dropoff || pick !== carried.pickup) {
    selTotal.textContent = 'Your dates changed, so this estimate is out of date. Use the link below to see a new estimate.';
  } else {
    selTotal.textContent = '$' + Number(carried.total).toFixed(2);
  }

  // The edit link returns every choice, with the dates currently in this form
  var params = new URLSearchParams();
  if (carried.size) params.set('size', carried.size);
  if (drop) params.set('dropoff', drop);
  if (pick) params.set('pickup', pick);
  carried.services.forEach(function (choice) { params.set(choice.key, choice.qty); });
  var query = params.toString();
  editLink.href = 'services.html' + (query ? '?' + query : '');
  editLink.textContent = hasChoices
    ? 'Edit your choices on the services page'
    : 'Choose services on the services page';
}

// Keep the summary's dates in step with the date fields
[dropoffInput, pickupInput].forEach(function (input) {
  input.addEventListener('input', renderSummary);
  input.addEventListener('change', renderSummary);
});

checkCarriedDates();
renderSummary();

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
    pickupDate: pickupInput.value,
    // Choices from the services page. The total is left out on purpose:
    // the server should work out the price itself rather than trust the browser.
    dogSize: carried.size,
    services: carried.services
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
