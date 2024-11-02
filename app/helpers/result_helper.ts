export default class ResultService {
  public static successMessage({
    data,
    message = 'Success',
    status = 200,
  }: {
    data: any
    message?: string
    status?: number
  }) {
    return {
      status: status,
      message: message,
      data: data,
    }
  }
}
