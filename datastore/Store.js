import Task from './Task'
import { limits } from '../helpers'

export const ALL = "ALL"
export const GOALS = "GOALS"

export const BUCKETS = {
  TODAY: "TODAY",
  TOMORROW: "TOMORROW",
  LATER: "LATER",
  COMPLETED: "COMPLETED",
  RECURRING: "RECURRING",
}

export const SCHEDULE_TYPES = {
  ADDITION: 1,
  TOMORROW_AUTO_SUGGESTION: 2,
  TOMORROW_AUTO_SUGGESTION_REJECTION: 3,
  AUTO_FILLING_TODAY: 4,
  AUTO_FILLING_TODAY_REJECTION: 5,
  CARRIED_OVER: 6,
  RECURRANCE: 7,
  RESCHEDULED_FROM_TODAY: 8,
  RESCHEDULED_FROM_TOMORROW: 9,
  RESCHEDULED_FROM_LATER: 10,
  REDOING: 11,
}

export class Store {
  constructor(todayDate, tomorrowDate, setter) {
    this.setter = setter

    this.allTasksCache = null
    this.remainingTasksCache = null

    this.todayDate = todayDate
    this.tomorrowDate = tomorrowDate

    this.tasks = {}
    this.tasks[BUCKETS.TODAY] = []
    this.tasks[BUCKETS.TOMORROW] = []
    this.tasks[BUCKETS.LATER] = []
    this.tasks[BUCKETS.COMPLETED] = []
    this.tasks[BUCKETS.RECURRING] = []

    this.goals = {
      count: 0,
      total: 0,
      goals: [{
        id: "055e7529-da9b-458d-9591-c0a3adac2cf7",
        name: "Get a job",
        start: new Date(new Date().getFullYear()-1, 0, 1),
        deadline: new Date(new Date().getFullYear(), 3, 28),
        completedTasks: 4,
        totalTasks: 15,
        inToday: true,
        inTomorrow: true,
        paused: true,
      },{
        id: "055e7529-da9b-458d-9591-c0a3adgc2cf7",
        name: "Get a job",
        start: new Date(new Date().getFullYear()-1, 0, 1),
        deadline: new Date(new Date().getFullYear(), 3, 28),
        completedTasks: 4,
        totalTasks: 15,
        inToday: true,
        inTomorrow: true,
        paused: true,
      },{
        id: "055e7529-da9b-458d-9591-c0a3adac2df7",
        name: "Get a job",
        start: new Date(new Date().getFullYear()-1, 0, 1),
        deadline: new Date(new Date().getFullYear(), 3, 28),
        completedTasks: 4,
        totalTasks: 15,
        inToday: true,
        inTomorrow: true,
        paused: true,
      },],
    }

    this.totals = {}
    this.totals[BUCKETS.TODAY]     = 0
    this.totals[BUCKETS.TOMORROW]  = 0
    this.totals[BUCKETS.LATER]     = 0
    this.totals[BUCKETS.COMPLETED] = 0
    this.totals[BUCKETS.RECURRING] = 0

    this.counts = {}
    this.counts[BUCKETS.TODAY] = 0
    this.counts[BUCKETS.TOMORROW] = 0

    this.settings = {
      theme: 0,
    }

    this.createTodayTask = this.createTodayTask.bind(this)
    this.createTomorrowTask = this.createTomorrowTask.bind(this)
    this.createLaterTask = this.createLaterTask.bind(this)

    this.completeTask = this.completeTask.bind(this)
    this.redoCompletedTaskToday = this.redoCompletedTaskToday.bind(this)
    this.redoCompletedTaskTomorrow = this.redoCompletedTaskTomorrow.bind(this)
    this.scheduleTaskForTomorrow = this.scheduleTaskForTomorrow.bind(this)
    this.scheduleTaskForToday = this.scheduleTaskForToday.bind(this)
    this.scheduleTaskForLater = this.scheduleTaskForLater.bind(this)

    this.setTaskText = this.setTaskText.bind(this)
    this.setTaskImportance = this.setTaskImportance.bind(this)
    this.setTaskDuration = this.setTaskDuration.bind(this)
    this.setTaskRecurring = this.setTaskRecurring.bind(this)
    this.setTaskGoals = this.setTaskGoals.bind(this)


    this.onCreateTodayTask = null
    this.onCreateTomorrowTask = null
    this.onCreateLaterTask = null
  }

  newTask(bucket) {
    return new Task(bucket)
  }

  addTaskToBucket(bucket, task){
    this.tasks[bucket].unshift(task)
    this.counts[bucket] = this.counts[bucket] + 1
    this.totals[bucket] = this.totals[bucket] + 1
    this.allTasksCache = null
    this.remainingTasksCache = null
    this.setter(this)
  }
  createTodayTask(){
    var task = this.newTask(BUCKETS.TODAY)
    if(this.onCreateTodayTask){
      this.onCreateTodayTask(task)
    }
    this.addTaskToBucket(BUCKETS.TODAY, task)
  }
  createTomorrowTask(){
    var task = this.newTask(BUCKETS.TOMORROW)
    if(this.onCreateTomorrowTask){
      this.onCreateTomorrowTask(task)
    }
    this.addTaskToBucket(BUCKETS.TOMORROW, task)
  }
  createLaterTask(){
    var task = this.newTask(BUCKETS.LATER)
    if(this.onCreateLaterTask){
      this.onCreateLaterTask(task)
    }
    this.addTaskToBucket(BUCKETS.LATER, task)
  }

  // swipe actions
  completeTask(task){
    var now = new Date()
    task.completedAt = now
    this.tasks[BUCKETS.TODAY].splice(this.tasks[BUCKETS.TODAY].findIndex((t)=>t.id==task.id),1);
    this.tasks[BUCKETS.COMPLETED].unshift(task)
    this.counts[BUCKETS.TODAY] = this.counts[BUCKETS.TODAY] - 1
    this.totals[BUCKETS.COMPLETED] = this.totals[BUCKETS.COMPLETED] + 1
    this.remainingTasksCache = null
    this.setter(this)
  }
  redoCompletedTaskToday(task){
    if(this.canAddTaskForToday()){
      var now = new Date()
      t.completed = true
      t.completedAt = now
      this.today.splice(this.today.findIndex((t)=>t.id==task.id),1);
      this.completed.unshift(task)
      this.counts.today = this.counts.today - 1
      this.counts.remaining = this.counts.remaining - 1
      this.totals.completed = this.totals.completed + 1
      this.setter(this)
    }
  }
  redoCompletedTaskTomorrow(task){

  }
  scheduleTaskForTomorrow(task){

  }
  scheduleTaskForToday(task){

  }
  scheduleTaskForLater(task){

  }

  // edit task
  setTaskText(task, text){

  }
  setTaskImportance(task, importance){
    task.importance = importance
    this.sort()
    this.setter(this)
  }
  setTaskDuration(task, duration){
    task.duration = duration
    this.sort()
    this.setter(this)
  }
  setTaskRecurring(task, recurring){

  }
  setTaskGoals(task, goals){

  }

  deleteTask(task){

  }

  canAddTask(forTomorrow){

  }
  canChange(id){

  }

  // tasks getters
  getAllTasks(){
    if(!this.allTasksCache){
      this.allTasksCache = this.tasks[BUCKETS.TODAY].concat(this.tasks[BUCKETS.TOMORROW]).concat(this.tasks[BUCKETS.LATER]).concat(this.tasks[BUCKETS.COMPLETED])
    }
    return this.allTasksCache
  }
  getRemainingTasks(){
    if(!this.remainingTasksCache){
      this.remainingTasksCache = this.tasks[BUCKETS.TODAY].concat(this.tasks[BUCKETS.TOMORROW]).concat(this.tasks[BUCKETS.LATER])
    }
    return this.remainingTasksCache
  }
  getCompletedTasks(){
    return this.tasks[BUCKETS.COMPLETED]
  }
  getRecurringTasks(){
    return this.tasks[BUCKETS.RECURRING]
  }
  getGoalTasks(goal){
  }
  getTodayTasks(){
    return this.tasks[BUCKETS.TODAY]
  }
  getTomorrowTasks(){
    return this.tasks[BUCKETS.TOMORROW]
  }
  getNowTask(){
    if(!this.tasks[BUCKETS.TODAY][0].isNew){
      return this.tasks[BUCKETS.TODAY][0]
    }
    return null
  }

  getBucketTasks(bucket) {
    return this.tasks[bucket]
  }

  getBucketTasksTotal(bucket) {
    return this.totals[bucket]
  }

  getGoals(){
    return this.goals.goals
  }

  //
  getTodayTasksCount(){
    return this.counts[BUCKETS.TODAY]
  }
  getTomorrowTasksCount(){
    return this.counts[BUCKETS.TOMORROW]
  }

  getAllTasksTotal(){
    return this.totals[BUCKETS.COMPLETED]+this.counts[BUCKETS.TODAY]+this.totals[BUCKETS.TOMORROW]+this.totals[BUCKETS.LATER]
  }
  getRemainingTasksTotal(){
    return this.counts[BUCKETS.TODAY]+this.totals[BUCKETS.TOMORROW]+this.totals[BUCKETS.LATER]
  }
  getCompletedTasksTotal(){
    return this.totals[BUCKETS.COMPLETED]
  }
  getRecurringTasksTotal(){
    return this.totals[BUCKETS.RECURRING]
  }
  getTodayTasksTotal(){
    return this.totals[BUCKETS.TODAY]
  }
  getTomorrowTasksTotal(){
    return this.totals[BUCKETS.TOMORROW]
  }

  getTodayDate(){
    return this.todayDate
  }
  getTomorrowDate(){
    return this.tomorrowDate
  }

  sort(){

  }

  save(){

  }
  saveTask(){

  }

  load(){
    this.sort()
  }
}
