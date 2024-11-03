import RowNotFoundException from "#exceptions/row_not_found_exception"
import db from "@adonisjs/lucid/services/db"
import { inject } from "@adonisjs/core"
import ResultService from "#helpers/result_helper"

@inject()
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

    return ResultService.successMessage({
      data: {
        data: persons.rows,
        meta: total_pages.rows[0]
      },
    })
  }

  async fetchAllPost(body: {page: number, limit: number, order_by: string, sort_by: string, filter: any}) {
    const table = 'people'
    const { filter } = body
    const page = body.page || 1
    const limit = body.limit || 10
    const order_by = body.order_by  || 'id'
    const sort_by = body.sort_by || 'ASC'

    const qs_full_name = filter?.qs_full_name || null
    const qs_status = filter?.qs_status || null
    const qs_age = filter?.qs_age || null
    const qs_gender = filter?.qs_gender || null

    const persons = await db.rawQuery(`
      SELECT id, full_name, age, status, gender, image FROM ${table}
      WHERE full_name LIKE '%${qs_full_name}%'
        OR status::text LIKE '%${qs_status}%'
        OR age::text LIKE '%${qs_age}%'
        OR gender LIKE '%${qs_gender}%'
      ORDER BY ${order_by} ${sort_by}
      LIMIT ${limit} OFFSET (${page} - 1) * ${limit}
    `)

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

    return ResultService.successMessage({
      data: {
        data: persons.rows,
        meta: total_pages.rows[0]
      },
    })
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
