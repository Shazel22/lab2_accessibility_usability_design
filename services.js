// MPLS Dog Boarding: services page (estimate and availability check)

/* ---------- Prices and rules ---------- */

var WEEKLY_RATE = 425; // 7 nights
var NIGHTLY_RATE = 75;

// "unit" is used in the estimate line, for example "2 days"
var services = {
  boarding: { name: 'Boarding',      price: 75, sizeBased: true },
  webcam:   { name: 'Webcam access', price: 10, sizeBased: false },
  grooming: { name: 'Grooming',      price: 60, sizeBased: true,  unit: ['grooming', 'groomings'] },
  daycare:  { name: 'Daycare',       price: 45, sizeBased: false, unit: ['day', 'days'] },
  training: { name: 'Training',      price: 50, sizeBased: false, unit: ['session', 'sessions'] },
  taxi:     { name: 'Pet taxi',      price: 25, sizeBased: false, unit: ['trip', 'trips'] }
};

// Size only changes boarding and grooming (see the size chart on the page)
var sizeFactor = { small: 1, medium: 1.05, large: 1.1, xlarge: 1.2 };
var sizeName = { small: 'small', medium: 'medium', large: 'large', xlarge: 'extra large' };

// Services with a check box (on or off) and services with a quantity
var checkKeys = ['boarding', 'webcam'];
var qtyKeys = ['grooming', 'daycare', 'training', 'taxi'];

// Most of each service allowed. A "day" is 24 hours from drop off, so days = nights.
function maxFor(key) {
  var days = countNights();
  if (key === 'daycare' || key === 'training') return days;     // one per day of the stay
  if (key === 'grooming') return days ? Math.ceil(days / 7) : 0; // one per week of the stay
  if (key === 'taxi') return 2;                                  // to us and back home
  return 1;
}

// Plain-language explanation of each limit, shown under the service
function limitText(key) {
  var max = maxFor(key);
  if (key === 'taxi') return 'Up to 2 trips: to us and back home.';
  if (countNights() === 0) return 'Choose your dates in step 2 first.';
  var days = countNights() + '-day';
  if (key === 'grooming') return 'Up to ' + max + ' (one per week of your ' + days + ' stay).';
  return 'Up to ' + max + ' (one per day of your ' + days + ' stay).';
}

/* ---------- Page elements ---------- */

var sizeSelect = document.getElementById('size');
var dropoffInput = document.getElementById('dropoff');
var pickupInput = document.getElementById('pickup');
var list = document.getElementById('estimate-list');
var emptyNote = document.getElementById('empty-note');
var sizeNote = document.getElementById('size-note');
var totalEl = document.getElementById('total');
var estimateStatus = document.getElementById('estimate-status');
var estimateHeading = document.getElementById('estimate-heading');
var availabilityStatus = document.getElementById('availability-status');
var clearButton = document.getElementById('clear');
var checkButton = document.getElementById('check');

function checkbox(key) { return document.getElementById('svc-' + key); }
function qtyInput(key) { return document.getElementById('qty-' + key); }

/* ---------- Date helpers ---------- */

// Today as YYYY-MM-DD in the visitor's local time
function todayString() {
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}

// Turn YYYY-MM-DD into a local Date (avoids time zone shifts)
function toDate(value) {
  var parts = value.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function formatDate(value) {
  return toDate(value).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

function isSunday(value) { return toDate(value).getDay() === 0; }
function isSaturday(value) { return toDate(value).getDay() === 6; }

// Number of nights, or 0 if the dates are missing or out of order
function countNights() {
  if (!dropoffInput.value || !pickupInput.value) return 0;
  var ms = toDate(pickupInput.value) - toDate(dropoffInput.value);
  var nights = Math.round(ms / (24 * 60 * 60 * 1000));
  return nights > 0 ? nights : 0;
}

function money(amount) {
  return '$' + amount.toFixed(2);
}

function plural(key, n) {
  var u = services[key].unit;
  return n + ' ' + (n === 1 ? u[0] : u[1]);
}

/* ---------- Quantities ---------- */

function getQty(key) {
  if (checkKeys.indexOf(key) !== -1) return checkbox(key).checked ? 1 : 0;
  var n = parseInt(qtyInput(key).value, 10);
  return isNaN(n) ? 0 : n;
}

// Keep a quantity between 0 and its limit. Returns a message if it had to change.
function setQty(key, n) {
  var max = maxFor(key);
  var message = '';
  if (isNaN(n) || n < 0) n = 0;
  if (n > max) {
    n = max;
    message = max === 0
      ? 'Choose your dates in step 2 before adding ' + services[key].name.toLowerCase() + '.'
      : services[key].name + ' is at its limit of ' + plural(key, max) + '. ' + limitText(key);
  }
  qtyInput(key).value = n;
  return message;
}

// After the dates change, lower any quantity that is now over its limit
function enforceLimits() {
  var messages = [];
  qtyKeys.forEach(function (key) {
    var before = getQty(key);
    if (before > maxFor(key)) {
      setQty(key, maxFor(key));
      messages.push(services[key].name + ' lowered to ' + plural(key, maxFor(key)) + ' to fit your dates.');
    }
  });
  return messages.join(' ');
}

function chosenKeys() {
  return checkKeys.concat(qtyKeys).filter(function (key) { return getQty(key) > 0; });
}

/* ---------- Estimate ---------- */

// Boarding: $425 for each full week, plus $75 for each extra night
function boardingBase(nights) {
  return Math.floor(nights / 7) * WEEKLY_RATE + (nights % 7) * NIGHTLY_RATE;
}

function render() {
  var size = sizeSelect.value;
  var factor = size ? sizeFactor[size] : 1;
  var nights = countNights();
  var keys = chosenKeys();
  var sum = 0;
  var needsSize = false;

  // Limits shown under each quantity, and the input's max for arrow keys
  qtyKeys.forEach(function (key) {
    document.getElementById('limit-' + key).textContent = limitText(key);
    qtyInput(key).max = maxFor(key);
    qtyInput(key).closest('li').classList.toggle('is-selected', getQty(key) > 0);
  });

  list.innerHTML = '';

  keys.forEach(function (key) {
    var svc = services[key];
    var qty = getQty(key);
    var parts = [];
    var cost = 0;
    var priced = true;

    if (key === 'boarding') {
      if (nights === 0) {
        priced = false;
        parts.push('Choose your dates in step 2 to see this price');
      } else {
        cost = boardingBase(nights) * factor;
        parts.push(nights + (nights === 1 ? ' night' : ' nights') + (nights >= 7 ? ', weekly rate applied' : ''));
      }
    } else {
      cost = svc.price * qty * (svc.sizeBased ? factor : 1);
      if (svc.unit) parts.push(plural(key, qty) + ' × ' + money(svc.price * (svc.sizeBased ? factor : 1)));
    }

    if (svc.sizeBased) {
      if (!size) needsSize = true;
      else if (factor !== 1) parts.push(sizeName[size] + ' dog price');
    }

    sum += cost;

    var li = document.createElement('li');
    li.innerHTML =
      '<span class="line-text"><span class="line-name">' + svc.name + '</span>' +
      (parts.length ? '<span class="line-detail">' + parts.join(', ') + '</span>' : '') + '</span>' +
      '<span class="line-amount">' + (priced ? money(cost) : 'Not yet priced') + '</span>';

    // Remove only this one service. Hidden text gives the button a full name for screen readers.
    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove';
    remove.innerHTML = 'Remove<span class="visually-hidden"> ' + svc.name + '</span>';
    remove.addEventListener('click', function () { removeService(key); });
    li.appendChild(remove);
    list.appendChild(li);
  });

  emptyNote.hidden = keys.length > 0;
  sizeNote.hidden = !needsSize;
  clearButton.hidden = keys.length === 0;
  totalEl.textContent = money(sum);
}

function announce(message) {
  estimateStatus.textContent = message + ' Estimated total is now ' + totalEl.textContent + '.';
}

function removeService(key) {
  if (checkKeys.indexOf(key) !== -1) checkbox(key).checked = false;
  else qtyInput(key).value = 0;
  render();
  announce(services[key].name + ' removed.');
  // The Remove button is gone, so put focus somewhere sensible instead of losing it
  estimateHeading.focus();
}

/* ---------- Events that update the estimate ---------- */

// Check boxes: Space toggles natively; also let Enter toggle, which many people expect
checkKeys.forEach(function (key) {
  var box = checkbox(key);
  box.addEventListener('change', function () {
    render();
    announce(services[key].name + (box.checked ? ' added.' : ' removed.'));
  });
  box.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      box.click();
    }
  });
});

// Quantity rows: minus button, number field, plus button
qtyKeys.forEach(function (key) {
  var row = qtyInput(key).closest('li');
  var input = qtyInput(key);

  function update(newQty) {
    var limitMessage = setQty(key, newQty);
    render();
    var qty = getQty(key);
    announce(limitMessage || (services[key].name + ': ' + plural(key, qty) + '.'));
  }

  row.querySelector('.minus').addEventListener('click', function () { update(getQty(key) - 1); });
  row.querySelector('.plus').addEventListener('click', function () { update(getQty(key) + 1); });
  input.addEventListener('change', function () { update(parseInt(input.value, 10)); });
});

sizeSelect.addEventListener('change', function () {
  render();
  if (chosenKeys().length) {
    announce('Prices updated for a ' + (sizeName[sizeSelect.value] || 'unselected size') + ' dog.');
  }
});

function onDatesChanged() {
  var message = enforceLimits();
  render();
  if (message) announce(message);
}

dropoffInput.addEventListener('change', onDatesChanged);
pickupInput.addEventListener('change', onDatesChanged);

// Protect against wiping out every choice by mistake
clearButton.addEventListener('click', function () {
  var count = chosenKeys().length;
  var ok = window.confirm('Clear all ' + count + ' services from your estimate? Your dog size and dates will stay.');
  if (!ok) return;
  checkKeys.forEach(function (key) { checkbox(key).checked = false; });
  qtyKeys.forEach(function (key) { qtyInput(key).value = 0; });
  render();
  announce('All services cleared.');
  estimateHeading.focus();
});

/* ---------- Availability check (the primary action) ---------- */

function showError(input, message) {
  var error = document.getElementById(input.id + '-error');
  error.textContent = 'Error: ' + message;
  error.hidden = false;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  var error = document.getElementById(input.id + '-error');
  error.textContent = '';
  error.hidden = true;
  input.removeAttribute('aria-invalid');
}

// Returns true when both dates are valid; shows a message next to each problem
function validateDates() {
  var today = todayString();
  var drop = dropoffInput.value;
  var pick = pickupInput.value;
  var firstBad = null;

  clearError(dropoffInput);
  clearError(pickupInput);

  if (!drop) {
    showError(dropoffInput, 'Choose the date you will drop off your dog.');
    firstBad = firstBad || dropoffInput;
  } else if (drop < today) {
    showError(dropoffInput, 'This date has already passed. Choose today or a later date.');
    firstBad = firstBad || dropoffInput;
  } else if (isSunday(drop)) {
    showError(dropoffInput, 'We are closed on Sunday. Choose a drop off date from Monday to Saturday.');
    firstBad = firstBad || dropoffInput;
  }

  if (!pick) {
    showError(pickupInput, 'Choose the date you will pick up your dog.');
    firstBad = firstBad || pickupInput;
  } else if (drop && pick <= drop) {
    showError(pickupInput, 'Choose a pick up date that is after your drop off date.');
    firstBad = firstBad || pickupInput;
  } else if (isSunday(pick)) {
    showError(pickupInput, 'We are closed on Sunday. Choose a pick up date from Monday to Saturday.');
    firstBad = firstBad || pickupInput;
  }

  if (firstBad) {
    firstBad.focus();
    return false;
  }
  return true;
}

// A flag instead of disabling the button: a disabled button drops keyboard focus
var checking = false;

checkButton.addEventListener('click', function () {
  if (checking) return;
  availabilityStatus.className = 'status availability';

  if (!validateDates()) {
    availabilityStatus.classList.add('is-error');
    availabilityStatus.textContent = 'Please fix the highlighted dates in step 2, then check again.';
    return;
  }

  checking = true;
  availabilityStatus.textContent = 'Checking your dates...';

  // Simulated check. In the Node.js module, replace this timeout with a request to the server.
  setTimeout(function () {
    var nights = countNights();
    var drop = dropoffInput.value;
    var pick = pickupInput.value;
    var notes = '';
    if (isSaturday(drop)) notes += ' Saturday drop off is between 8:00 am and 4:00 pm.';
    if (isSaturday(pick)) notes += ' Saturday pick up is between 8:00 am and 4:00 pm.';

    availabilityStatus.classList.add('is-success');
    availabilityStatus.innerHTML =
      '<p><strong>Good news: your dates are available.</strong></p>' +
      '<p>' + formatDate(drop) + ' to ' + formatDate(pick) + ' (' + nights +
      (nights === 1 ? ' night' : ' nights') + ').' + notes + '</p>' +
      '<p><a href="book.html">Request this stay</a></p>';
    checking = false;
  }, 600);
});

// Clear a date error as soon as the visitor changes that field
dropoffInput.addEventListener('input', function () { clearError(dropoffInput); });
pickupInput.addEventListener('input', function () { clearError(pickupInput); });

// Do not offer past dates in the date picker
dropoffInput.min = todayString();
pickupInput.min = todayString();

render();
