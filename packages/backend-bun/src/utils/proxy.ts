import { Pool, QueryArrayConfig, QueryArrayResult, QueryConfig, QueryConfigValues, QueryResult, QueryResultRow, Submittable } from "pg";
import { logger } from "./logger";


export function createProxy(pool: Pool): Pool {
  return new Proxy(pool, {
    get(target, prop, receiver) {
       const origin = Reflect.get(target, prop, receiver);
      if (prop === 'query'  ) {
        return function(){
            const query = arguments[0];
            if (typeof query === 'string') {
                logger.info(`Executing query: ${query}`);
            } else if (query && typeof query === 'object' && 'text' in query) {
                logger.info(`Executing query: ${query.text}`);
            }
            return origin.apply(target, arguments);
        };
      } else {
        return origin;
      }
    }
  });
}
