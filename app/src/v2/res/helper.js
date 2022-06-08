import moment from 'moment';

function computePetAge(bday) {
  const now = moment();
  const d = moment(bday);

  const diffDay = now.diff(d, 'day');
  const diffWeek = now.diff(d, 'week');
  const diffMonth = now.diff(d, 'month');
  const diffYear = now.diff(d, 'year');

  let res = '';

  if (diffDay < 1) {
    res = '1 day old';
  } else if (diffDay > 1 && diffDay < 7) {
    const rounded = Math.floor(diffDay);
    res = `${rounded} ${rounded > 1 ? 'days' : day} old`;
  } else if (diffWeek >= 1 && diffWeek < 4) {
    const rounded = Math.floor(diffWeek);
    res = `${rounded} ${rounded > 1 ? 'weeks' : 'week'} old`;
  } else if (diffMonth >= 1 && diffMonth < 12) {
    const rounded = Math.floor(diffMonth);
    res = `${rounded} ${rounded > 1 ? 'months' : 'month'} old`;
  } else if (diffYear >= 1) {
    const rounded = Math.floor(diffYear);
    res = `${rounded} ${rounded > 1 ? 'years' : 'year'} old`;
  }

  return res;
}

function getAge(bday) {
  const now = moment();
  const d = moment(bday);
  const diffYear = now.diff(d, 'year');
  const res = `${diffYear} years old`;
  return res;
}

function calculateDistance(from, to, unit = 'm') {
  const M = 6371e3; // metres
  const φ1 = (from.latitude * Math.PI) / 180; // φ, λ in radians
  const φ2 = (to.latitude * Math.PI) / 180;
  const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
  const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  let d = M * c;
  if (unit === 'km') {
    d = d * 0.001;
  } else if (unit === 'mile') {
    d = d * 0.000621371;
  }

  return d;
}

const dateFromNow = date => {
  const now = moment();
  const d = moment(date);

  const diffSec = now.diff(d, 'second');
  const diffMin = now.diff(d, 'minute');
  const diffHour = now.diff(d, 'hour');
  const diffDay = now.diff(d, 'day');

  let res = '';

  if (diffDay >= 7 || diffHour >= 150) {
    res = `${d.format('MMM D')} at ${d.format('h:mm A')}`;
  } else if (diffDay >= 2 && diffDay <= 6) {
    res = `${d.format('dddd')} at ${d.format('h:mm A')}`;
  } else if (diffDay < 2 && diffDay >= 1) {
    res = `Yesterday at ${d.format('h:mm A')}`;
  } else if (diffHour < 24 && diffHour >= 1) {
    const hourText = diffHour >= 2 ? 'hours' : 'hour';
    res = d.format('h:mm A');
  } else if (diffMin < 60 && diffMin >= 1) {
    const minText = diffMin >= 2 ? 'minutes' : 'minute';
    res = d.format('h:mm A');
  } else if (diffSec < 60) {
    res = d.format('h:mm A');
  }

  return res;
};

function filterMessages(messages) {
  const filtered = {};
  if (!messages) {
    return filtered;
  }

  messages.forEach(msg => {
    if (msg.receiverId) {
      if (!filtered[msg.receiverId]) {
        filtered[msg.receiverId] = [];
      }
      filtered[msg.receiverId].push(msg);
    } else if (msg.senderId) {
      if (!filtered[msg.senderId]) {
        filtered[msg.senderId] = [];
      }
      filtered[msg.senderId].push(msg);
    }
  });

  return filtered;
}

function getCity(components) {
  let city = '';
  components.forEach(addr => {
    if (addr.types.includes('locality')) {
      city = addr.long_name;
    } else if (addr.types.includes('postal_town')) {
      city = addr.long_name;
    } else if (addr.types.includes('sublocality_level_1')) {
      city = addr.long_name;
    }
  });

  return city;
}

function getState(components) {
  let state = '';
  components.forEach(addr => {
    if (addr.types.includes('administrative_area_level_1')) {
      state = addr.long_name;
    }
  });

  return state;
}

const helper = {
  computePetAge,
  getAge,
  calculateDistance,
  dateFromNow,
  filterMessages,
  getCity,
  getState,
};
export default helper;
