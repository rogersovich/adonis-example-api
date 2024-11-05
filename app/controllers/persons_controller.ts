// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from "@adonisjs/core"
import PersonService from "#services/person_service"
import { HttpContext } from "@adonisjs/core/http"
import GeneralHelper from "#helpers/general_helper"

@inject()
export default class PersonsController {
  constructor(
    private personService: PersonService
  ) {}

  all({request}: HttpContext) {
    const qs = request.qs()
    const persons = this.personService.fetchAll(qs)

    return persons
  }

  async allPost({request}: HttpContext) {
    const body = request.body() as any

    const persons = this.personService.fetchAllPost(body)

    await GeneralHelper.executeTimedQuery(persons)

    return persons
  }

  allPostInfinited({request}: HttpContext) {
    const body = request.body() as any

    const persons = this.personService.fetchInfiniteQuery(body)

    return persons
  }

  show({ params }: HttpContext) {
    const {id}  = params
    const person = this.personService.fetchSingle(+id)

    return person
  }
}
