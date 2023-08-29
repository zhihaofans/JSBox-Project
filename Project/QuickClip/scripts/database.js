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
    return $sqlite.open(this.SQLITE_FILE);
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
}
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
class Clip {
  constructor() {
    this.SQLITE_FILE = "clip.db";
    this.SQLITE = new SQLiteCore(SQLITE_DIR + this.SQLITE_FILE);
    this.Keychain = new Next.Storage.Keychain("zhihaofans.quickcilp.clip");
    this.DATABASE_KEY = {
      CLIP_LIST_DATA: "clip_list_data"
    };
    this.createTable();
  }
  createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS ${this.DATABASE_KEY.CLIP_LIST_DATA}(id TEXT PRIMARY KEY NOT NULL, create_time INTEGER NOT NULL, text TEXT NOT NULL,data TEXT)`,
      SQLITE = this.SQLITE.open(),
      result = SQLITE.update(sql);
    SQLITE.close();
    $console.info({
      sql,
      createTable: result
    });
    return result;
  }
  getList() {
    try {
      const result = this.Keychain.get(this.DATABASE_KEY.CLIP_LIST_DATA),
        data = JSON.parse(result);
      $console.info({
        result,
        data
      });
      const listData =
        data == undefined ? [] : data.map(item => new ClipListDataItem(item));
      $console.info({
        getList: listData
      });
      return listData;
    } catch (error) {
      $console.error(error);
      this.setList([]);
      $console.warn("发生错误，已清空剪切板");
    }
  }
  setList(listData) {
    const  this.Keychain.set(
      this.DATABASE_KEY.CLIP_LIST_DATA,
      JSON.stringify(listData)
    );
  }
  addItem({ text, data = {} }) {
    const oldList = this.getList() || [];
    const id = $.getUUID(),
      create_time = $.dateTime.getUnixTime();
    oldList.push(
      new ClipListDataItem({
        id,
        create_time,
        text,
        data: JSON.stringify(data)
      })
    );
    const setResult = this.setList(oldList);
    $console.info("addItem.setList", setResult);
    return setResult;
  }
}
module.exports = { SQLiteCore, Clip };
