/**
 * @file bloodCompatibility.js
 * @description Core blood-group compatibility and donor eligibility rules.
 * This module is the single source of truth for "who can donate to whom"
 * and "is a donor currently eligible". Never duplicate this logic elsewhere.
 */

/** All 8 standard blood groups, in display order. */
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Compatibility map: recipient group -> array of donor groups that can give to them.
 * Key = the patient's blood group. Value = who can safely donate to that patient.
 * @type {Object<string, string[]>}
 */
const COMPATIBILITY_MAP = {
  'A+':  ['A+', 'A-', 'O+', 'O-'],
  'A-':  ['A-', 'O-'],
  'B+':  ['B+', 'B-', 'O+', 'O-'],
  'B-':  ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+':  ['O+', 'O-'],
  'O-':  ['O-'],
};

/**
 * Can a donor with `donorGroup` safely donate to a recipient with `recipientGroup`?
 * @param {string} donorGroup - e.g. 'O-'
 * @param {string} recipientGroup - e.g. 'A+'
 * @returns {boolean}
 */
function canDonate(donorGroup, recipientGroup) {
  if (!BLOOD_GROUPS.includes(donorGroup) || !BLOOD_GROUPS.includes(recipientGroup)) {
    return false;
  }
  return COMPATIBILITY_MAP[recipientGroup].includes(donorGroup);
}

/**
 * Given a recipient's blood group, return every donor group that can donate to them.
 * Used by the matching engine to build the Firestore `in` query.
 * @param {string} recipientGroup
 * @returns {string[]} compatible donor groups (empty if invalid input)
 */
function getCompatibleDonors(recipientGroup) {
  return COMPATIBILITY_MAP[recipientGroup] || [];
}

/**
 * Is a donor eligible based on the minimum days since their last donation?
 * A donor with no prior donation date is treated as eligible.
 * @param {string|Date|null} lastDonationDate - ISO string or Date, or null
 * @param {number} [minDays=90] - minimum gap between donations
 * @returns {boolean}
 */
function isEligibleByDate(lastDonationDate, minDays = 90) {
  if (!lastDonationDate) return true;
  const last = new Date(lastDonationDate);
  if (Number.isNaN(last.getTime())) return false; // invalid date = not eligible
  const diffMs = Date.now() - last.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= minDays;
}

module.exports = {
  BLOOD_GROUPS,
  COMPATIBILITY_MAP,
  canDonate,
  getCompatibleDonors,
  isEligibleByDate,
};
