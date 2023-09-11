const $ = require("$"),
  Next = require("Next"),
  SQLITE_DIR = "/assets/.files/";
class SQLiteCore {
  constructor(SQLITE_FILE) {
    this.SQLITE_FILE = SQLITE_FILE;
    $console.info(SQLITE_FILE);
    $file.mkdir(SQLITE_DIR);
    this.SQLITE = new Next.Storage.SQLite(this.SQLITE_FILE);
  }
  open() {
    return this.SQLITE.init();
  }
  getAllData(tableId) {
    const queryResult = this.SQLITE.queryAll(tableId);
    $console.info({
      getAllData: tableId,
      queryResult
    });
    return queryResult;
  }
  createTable(tableId, args) {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableId}(${args})`,
      SQLITE = this.open(),
      result = SQLITE.update({
        sql
      });
    SQLITE.close();
    $console.info({
      tableId,
      args,
      createTable: result
    });
    return result;
  }
  insert(table, columnObject) {
    const columnKeys = Object.keys(columnObject);
    if (columnKeys.length == 0) {
      return undefined;
    } else {
      const columnValueList = [];
      var a = "";
      columnKeys.map(key => {
        columnValueList.push(columnObject[key]);
        if (a.length > 0) {
          a += ",";
        }
        a += "?";
      });
      const sql = `INSERT INTO ${table} (${columnKeys.toString()}) VALUES(${a})`,
        updateResult = this.SQLITE.update(sql, columnValueList);
      $console.info({
        sql,
        updateResult
      });
      return updateResult;
    }
  }
  query(sql, args = undefined) {
    return this.SQLITE.query(sql, args);
  }
  update(sql, args = undefined) {
    return this.SQLITE.update(sql, args);
  }
  getError(sqlResult) {
    $console.info({
      getError: sqlResult
    });
    const success = sqlResult.result === true;
    return {
      success,
      error: !success,
      code: success ? undefined : sqlResult.error.code,
      message: success ? "success" : sqlResult.error.localizedDescription
    };
  }
}
module.exports = { SQLITE_DIR, SQLiteCore };
