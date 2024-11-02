import RowNotFoundException from "#exceptions/row_not_found_exception"
import db from "@adonisjs/lucid/services/db"

export default class PersonService {
  async fetchAll(query_search: any) {
    const table = 'people'
    const page = query_search.page || 1
    const limit = query_search.limit || 10
    const order_by_key = 'id'
    const order_by_value = 'ASC'

    const persons = await db.rawQuery(`
      SELECT id, full_name FROM ${table}
      ORDER BY ${order_by_key} ${order_by_value}
      LIMIT :limit OFFSET (:page - 1) * :limit
    `, {
      page: page,
      limit: limit,
    })

    const total_pages = await db.rawQuery(`
      SELECT
        COUNT(*)::integer AS total_records,
        CEIL(COUNT(*) / :limit) AS total_pages
      FROM ${table}
    `, {
      limit: limit,
    })

    if(persons.rows.length === 0) {
      throw new RowNotFoundException()
    }

    return {
      status: 200,
      message: 'Success',
      data: {
        data: persons.rows,
        meta: total_pages.rows[0]
      },

    }
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
