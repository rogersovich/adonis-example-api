export default class ResultHelper {
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

  public static errorMessage({
    data,
    message = 'Error',
    status = 200,
  }: {
    data: any
    message?: string
    status?: number
  }) {
    return {
      status: status || 404,
      message: message || 'Data Not Found',
      data: data || null,
    }
  }
}
