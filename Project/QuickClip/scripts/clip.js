const DataBase = require("./database"),
  SQLiteCore = new DataBase.SQLiteCore(DataBase.SQLITE_DIR + "clip.db"),
  $ = require("$"),
  DATABASE_KEY = {
    CLIP_LIST_DATA: "clip_list_data"
  },
  Config = require("./config"),
  ClipConfig = new Config.Clip();
class ClipListDataItem {
  constructor({ id, create_time, text, data }) {
    this.id = id;
    this.create_time = create_time;
    this.text = text;
    if ($.hasString(data)) {
      try {
        this.data = JSON.parse(data);
      } catch (error) {
        $console.error(error);
      }
    }
  }
  getJson() {
    return {
      id: this.id,
      create_time: this.create_time,
      text: this.text,
      data: JSON.stringify(this.data)
    };
  }
}

function init() {
  try {
    $console.info("init");
    createTable();
  } catch (error) {
    $console.error(error);
  } finally {
    $console.info("finifh");
  }
}

function createTable() {
  const sql = `CREATE TABLE IF NOT EXISTS ${DATABASE_KEY.CLIP_LIST_DATA}(id TEXT PRIMARY KEY NOT NULL, create_time INTEGER NOT NULL, text TEXT NOT NULL,data TEXT)`,
    SQLITE = SQLiteCore.open(),
    result = SQLITE.update(sql);
  SQLITE.close();
  $console.info({
    sql,
    createTable: result
  });
  return SQLiteCore.getError(result);
}

function getClipTextList() {
  return getClipList().map(item => item.text);
}

function getClipList() {
  const clipList = SQLiteCore.getAllData(DATABASE_KEY.CLIP_LIST_DATA).result;
  $console.info({
    clipList
  });
  if (ClipConfig.getNewToOld() === true) {
    clipList.reverse();
  }
  return clipList || [];
}

function addText(text) {
  const uuid = $.getUUID(),
    create_time = $.getUnixTime(),
    data = {};
  return addItem(uuid, create_time, text, JSON.stringify(data));
}

function addItem(id, create_time, text, data = "{}") {
  // id,create_time,text,data
  const sql = `INSERT INTO ${DATABASE_KEY.CLIP_LIST_DATA} (id, create_time, text, data) VALUES (?, ?, ?, ?)`,
    args = [id, create_time, text, data];
  const addResult = SQLiteCore.update(sql, args);
  $console.info({
    addResult,
    sql,
    args
  });
  return SQLiteCore.getError(addResult);
}

function removeItem({ id }) {
  const sql = `DELETE FROM ${DATABASE_KEY.CLIP_LIST_DATA} WHERE id = ?;`,
    args = [id];
  const removeResult = SQLiteCore.update(sql, args);
  $console.info({
    removeResult,
    sql,
    args
  });
  return SQLiteCore.getError(removeResult);
}
function importList(clipList) {
  if ($.hasArray(clipList)) {
    let success = true;
    clipList.map(item => {
      const { id, create_time, text, data } = item;
      const addResult = addItem(id, create_time, text, JSON.stringify(data));
      const isError =
        addResult.result == undefined || addResult.error != undefined;
      $console.info({
        addResult,
        isError
      });
      if (isError) {
        success = false;
      }
    });
    $console.info({
      success
    });
    return success;
  } else {
    return false;
  }
}
module.exports = {
  init,
  addText,
  getClipList,
  getClipTextList,
  removeItem
};
