const $ = require("$");
const DB_FILE_NAME = "config.db",
  DATABASE_KEY = {
    clip: "clip"
  },
  DataBase = require("./database"),
  SQLiteCore = new DataBase.SQLiteCore(DataBase.SQLITE_DIR + DB_FILE_NAME);
class ConfigCore {
  constructor(tableId) {
    this.TABLE_ID = tableId;
  }
  parseQueryResult(result) {
    try {
      if (result) {
        if (result.error !== null) {
          $console.error(result.error);
          return undefined;
        }
        const sqlResult = result.result,
          data = [];
        while (sqlResult.next()) {
          data.push(sqlResult.values);
        }
        sqlResult.close();
        return data;
      } else {
        return undefined;
      }
    } catch (error) {
      $console.error(`parseQueryResult:${error.message}`);
      return undefined;
    }
  }
  createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS ${this.TABLE_ID}(id TEXT PRIMARY KEY NOT NULL, type TEXT NOT NULL, update_time INTEGER NOT NULL, text_value TEXT, number_value INTEGER, boolean_value BLOB, data TEXT)`,
      SQLITE = SQLiteCore.open(),
      result = SQLITE.update(sql);
    SQLITE.close();
    $console.info({
      sql,
      createTable: result
    });
    return SQLiteCore.getError(result);
  }
  getConfig(key) {
    const sql = `SELECT * FROM ${this.TABLE_ID} WHERE id = ?;`,
      args = [key],
      SQLITE = SQLiteCore.open(),
      result = SQLITE.query({
        sql,
        args
      }),
      sqlResult = this.parseQueryResult(result);
    SQLITE.close();
    $console.info({
      sql,
      args,
      getConfig: result
    });
    $console.info(sqlResult);
    let queryResult = {};
    sqlResult.map(item => {
      const { id, type, update_time } = item;
      if (id === key) {
        queryResult = {
          id,
          type,
          update_time
        };
        switch (type.toLowerCase()) {
          case "text":
            queryResult["value"] = item.text_value;

            break;
          case "number":
            queryResult["value"] = item.number_value;

            break;
          case "boolean":
            queryResult["value"] =
              item.boolean_value === true || item.boolean_value === 1;
            break;
          case "data":
            queryResult["value"] = item.data;
            break;
          default:
            $console.error("出现未知类型的数据");
        }
      }
    });
    $console.info(queryResult);
    return queryResult;
  }
  getConfigList() {
    const dbResult = SQLiteCore.getAllData(this.TABLE_ID),
      result = {};
    dbResult.result.map(item => {
      const {
        id,
        type,
        update_time,
        text_value,
        number_value,
        boolean_value,
        data
      } = item;
      $console.info({
        id,
        type,
        update_time,
        text_value,
        number_value,
        boolean_value,
        data
      });
      if (item && $.hasString(id)) {
        switch (type.toLowerCase()) {
          case "text":
            result[id] = {
              value: text_value,
              update_time
            };
            break;
          case "number":
            result[id] = {
              value: number_value,
              update_time
            };
            break;
          case "boolean":
            result[id] = {
              value: boolean_value,
              update_time
            };
            break;
          case "data":
            result[id] = {
              value: data,
              update_time
            };
            break;
          default:
            $console.error("出现未知类型的数据");
        }
      }
    });
    $console.info({
      dbResult,
      result
    });
    return result;
  }
  geyTypeSql(key, type, value) {}
  initConfigIfEmpty(key, type, value) {
    const args = [key, type, value, $.getUnixTime(), key],
      dataType = {
        text: "text_value",
        number: "number_value",
        boolean: "boolean_value",
        data: "data"
      },
      typeName = dataType[type.toLowerCase()],
      sql = `INSERT INTO ${this.TABLE_ID} (id, type,${typeName} ,update_time)  SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT id FROM ${this.TABLE_ID} WHERE id = ?);`,
      SQLITE = SQLiteCore.open(),
      result = SQLITE.update({
        sql,
        args
      });
    SQLITE.close();
    $console.info({
      sql,
      args,
      initConfigIfEmpty: result
    });
    if (result.result === false) {
      $console.error(result.error);
    }
    return SQLiteCore.getError(result);
  }
  updateConfig(type, key, value) {
    switch (type.toLowerCase()) {
      case "text":
        return this.updateTextConfig(key, value);
        break;
      case "boolean":
        return this.updateBooleanConfig(key, value);
      default:
        return undefined;
    }
  }
  updateTextConfig(key, value) {
    const args = [value, $.getUnixTime(), key],
      sql = `UPDATE ${this.TABLE_ID} SET text_value=?,update_time=? WHERE id=?;`,
      SQLITE = SQLiteCore.open(),
      result = SQLITE.update({ sql, args });
    SQLITE.close();
    $console.info({
      sql,
      args,
      updateTextConfig: result
    });
    return SQLiteCore.getError(result);
  }
  updateBooleanConfig(key, value) {
    const args = [value, $.getUnixTime(), key],
      sql = `UPDATE ${this.TABLE_ID} SET boolean_value=?,update_time=? WHERE id=?;`,
      SQLITE = SQLiteCore.open(),
      result = SQLITE.update({ sql, args });
    SQLITE.close();
    $console.info({
      sql,
      args,
      updateTextConfig: result
    });
    return SQLiteCore.getError(result);
  }
}
class Clip {
  constructor() {
    this.DATABASE_KEY = DATABASE_KEY.clip;
    this.Core = new ConfigCore(this.DATABASE_KEY);
    this.init();
    this.CONFIG_ID = {
      new2old: "new2old"
    };
  }

  init() {
    this.Core.createTable();
    this.Core.initConfigIfEmpty("new2old", "boolean", false);
  }
  getNewToOld() {
    return this.Core.getConfig("new2old").value === true;
  }
  setNewToOld(on = false) {
    return this.Core.updateBooleanConfig("new2old", on === true);
  }
}
module.exports = {
  Clip
};
