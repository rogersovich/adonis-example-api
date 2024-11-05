import RowNotFoundException from "#exceptions/row_not_found_exception"
import db from "@adonisjs/lucid/services/db"
import { inject } from "@adonisjs/core"
import ResultHelper from "#helpers/result_helper"

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

    return ResultHelper.successMessage({
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
    const offset = (page - 1) * limit;

    const qs_full_name = filter?.qs_full_name || null
    const qs_status = filter?.qs_status || null
    const qs_age = filter?.qs_age || null
    const qs_gender = filter?.qs_gender || null


    const whereClauses = [];
    if (qs_full_name) whereClauses.push(`LOWER(full_name) LIKE LOWER('%${qs_full_name}%')`);
    if (qs_status) whereClauses.push(`LOWER(status::text) LIKE LOWER('%{qs_status}%')`);
    if (qs_age) whereClauses.push(`LOWER(age::text) LIKE LOWER('%${qs_age}%')`);
    if (qs_gender) whereClauses.push(`LOWER(gender) LIKE LOWER('%${qs_gender}%')`);

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' OR ')}` : '';

    const persons = await db.rawQuery(`
      SELECT id, full_name, age, status, gender, image FROM ${table}
      ${whereClause}
      ORDER BY ${order_by} ${sort_by}
      LIMIT ${limit} OFFSET ${offset}
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
      return ResultHelper.successMessage({
        data: null,
      })
    }

    return ResultHelper.successMessage({
      data: {
        data: persons.rows,
        meta: total_pages.rows[0]
      },
    })
  }

  async fetchInfiniteQuery(body: {page: number, limit: number, order_by: string, sort_by: string}) {
    const table = 'people';
    const page = body.page || 1;
    const limit = body.limit || 10;
    const offset = (page - 1) * limit;

    const order_by = body.order_by  || 'id'
    const sort_by = body.sort_by || 'ASC'

    const persons = await db.rawQuery(`
      SELECT id, full_name, age, status, gender, image FROM ${table}
      ORDER BY ${order_by} ${sort_by}
      LIMIT ${limit} OFFSET ${offset}
    `)

    if(persons.rows.length === 0) {
      return ResultHelper.successMessage({
        data: [],
      })
    }

    return ResultHelper.successMessage({
      data: persons.rows,
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
