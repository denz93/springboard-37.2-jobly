const {sqlForPartialUpdate} = require('./sql')
const {BadRequestError} = require('../expressError')

describe('SQL Helpers', () => {
  describe('sqlForPartialUpdate', () => {
    test('with valid input', () => {
      const dataToUpdate = {firstName: 'Aliya', age: 32}
      const jsToSql = {firstName: 'first_name', age: 'age'}
      const result = sqlForPartialUpdate(dataToUpdate, jsToSql)
      expect(result).toEqual({
        setCols: '"first_name"=$1, "age"=$2',
        values: ['Aliya', 32]
      })
      expect(sqlForPartialUpdate(dataToUpdate, {})).toEqual({
        setCols: '"firstName"=$1, "age"=$2',
        values: ['Aliya', 32]
      })

      expect(sqlForPartialUpdate(dataToUpdate, {firstName: 'first_name'})).toEqual({
        setCols: '"first_name"=$1, "age"=$2',
        values: ['Aliya', 32]
      })
    })
    test('with no data', () => {
      const dataToUpdate = {}
      const jsToSql = {firstName: 'first_name', age: 'age'}

      expect(() => {
        sqlForPartialUpdate(dataToUpdate, jsToSql)
      }).toThrow(BadRequestError)

      expect(() => {
        sqlForPartialUpdate(null, jsToSql)
      }).toThrow(TypeError)

      expect(() => {
        sqlForPartialUpdate({firstName: 'Aliya'}, null)
      }).toThrow(TypeError)

      expect(() => {
        sqlForPartialUpdate()
      }).toThrow(TypeError)
    })
  })
})