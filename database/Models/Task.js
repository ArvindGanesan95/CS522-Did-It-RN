import * as  SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class Task extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('didits.db')
  }

  static get tableName() {
    return 'TasksTable'
  }

  static get columnMapping() {
    return {
      id:            {type: types.INTEGER, primary_key: true },
      name:          {type: types.TEXT, not_null: true },
      category:      {type: types.TEXT },
      isCompleted:   {type: types.BOOLEAN},
      isRecurring:   {type: types.BOOLEAN},
      taskFinishBy : {type: types.DATETIME},
      createdDate:   {type: types.DATE}
    }
  }

  // Function to fetch tasks thats that are to be completed in the future from current time
  static getUpComingTasks(category='%') {
    // tasks whose end date is farther than current date
    var table_Name = Task.tableName
    category = '\''+category+'\''
    const sql = `SELECT * FROM  ${table_Name} WHERE category like ${category} AND taskFinishBy >=datetime(\'now\') AND isCompleted=0` 
    const params = []
    return this.repository.databaseLayer.executeSql(sql, params)
  }

  // Function to fetch tasks that were completed
  static getCompletedTasks(category='%') {
    // tasks whose end date is farther than current date
    var table_Name = Task.tableName
    category = '\''+category+'\''
    const sql = `SELECT * FROM  ${table_Name} WHERE category like ${category} AND isCompleted = 1`
    console.log(sql)
    const params = []
    return this.repository.databaseLayer.executeSql(sql, params)
  }

  // Function to mark a task as done
  static markTaskAsDone(taskId='0'){
    var updateQueryClause = `UPDATE ${Task.tableName} SET isCompleted = ? WHERE id = ? `;
    const params = [1, taskId]
    console.log("Query "+updateQueryClause)
    return this.repository.databaseLayer.executeSql(updateQueryClause, params)
  }

  // Function to reschedule a task finish date
  static reScheduleTask(taskId='0', taskFinishBy=''){
    var updateQueryClause = `UPDATE ${Task.tableName} SET taskFinishBy = ? WHERE id = ? `;
    console.log("Update query "+updateQueryClause)
    const params = [taskFinishBy, taskId]
    return this.repository.databaseLayer.executeSql(updateQueryClause, params)
  }

  // Function to update the task name
  static updateTaskName(taskId, name='') {
    var updateQueryClause = `UPDATE ${Task.tableName} SET name = ? WHERE id = ? `;
    const params = [name, taskId]
    return this.repository.databaseLayer.executeSql(updateQueryClause, params)
  }


  // Function to delete a task
  static deleteTask(taskId = 0){
    var table_Name = Task.tableName
    const sql = `delete from  ${table_Name}  WHERE id = ?`
    const params = [taskId]
    console.log("Task id "+taskId)
    return this.repository.databaseLayer.executeSql(sql, params)
  }

  // could be rewritten like other functions above that uses executeSql function
  static createTask(task={}){
    
    return new Promise(async (resolve, reject) => {
      try {
        const person = new Task(task)
        await person.save()
        resolve("Success")
      }
      catch {
        reject("Error creating a record")
      }
    });

  }

}