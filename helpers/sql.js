const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/**
 * Generates a SQL query for a partial update based on the given data and mapping.
 *
 * @param {Map<string, any>} dataToUpdate - The data to be updated.
 * @param {Map<string, string>} jsToSql - The mapping of JavaScript keys to SQL column names.
 * @throws {BadRequestError} If no data is provided.
 * @typedef {Object} Result
 * @property {string} setCols - The SQL set columns.
 * @property {Array} values - The values to be inserted into the SQL query.
 * @returns {Result} result - An object containing the SQL set columns and values.
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
