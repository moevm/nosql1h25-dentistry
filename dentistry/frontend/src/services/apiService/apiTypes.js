/**
 * @typedef {Object} CustomUser
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {number} role_id
 */

/**
 * @typedef {Object} Avatar
 * @property {string} avatar_url
 */

/**
 * @typedef {Object} Record
 * @property {number} id
 * @property {CustomUser} dentist
 * @property {CustomUser} patient
 * @property {"scheduled" | "completed" | "canceled"} status
 * @property {string} appointment_date
 * @property {number} duration
 * @property {string} notes
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string|null} actual_date
 */

/**
 * @typedef {Object} RecordInput
 * @property {string} dentist
 * @property {string} [patient]
 * @property {"scheduled" | "completed" | "canceled"} status
 * @property {string} appointment_date
 * @property {number} duration
 * @property {string} notes
 * @property {string} [actual_date]
 */
