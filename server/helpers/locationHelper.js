const UserModel = require("../models/user");

function calculateDistance(from, to, unit = "m") {
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
  if (unit === "km") {
    d = d * 0.001;
  } else if (unit === "mile") {
    d = d * 0.000621371;
  }

  return d;
}

function distanceOffset(radius) {
  let offset = 0.1;
  const log = Math.ceil(Math.log10(radius));
  offset = offset * log;
  return offset;
}

const helper = { calculateDistance, distanceOffset };
module.exports = helper;
