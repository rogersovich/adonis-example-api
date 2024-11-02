import RowNotFoundException from "#exceptions/row_not_found_exception"
import db from "@adonisjs/lucid/services/db"

export default class PersonService {
  fetchAll() {
    const queryPeople = db.from('people')

    const persons = queryPeople.select('id', 'full_name', 'age', 'status', 'gender', 'image').orderBy('id', 'asc')

    return persons
  }

  async fetchSingle(id: number) {
    try {
      const queryPerson = db.from('people').where('id', id)
      const person = await queryPerson.select('id', 'full_name', 'age', 'status', 'gender', 'image').firstOrFail()

      return person
    } catch (error) {
      throw new RowNotFoundException()
    }
  }
}
