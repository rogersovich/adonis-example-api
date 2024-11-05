export default class GeneralHelper {

  public static async executeTimedQuery(queryFunction: any) {
    const start = Date.now();

    await queryFunction;

    const executionTime = Date.now() - start;
    const executionTimeString = `Execution Time: ${executionTime} ms`

    console.log(`Execution Time: ${executionTime} ms`);

    return executionTimeString;
  }
}
