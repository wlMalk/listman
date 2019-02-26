import { uuid, limits } from './helpers'

export const BUCKETS = {
  TODAY: "TODAY",
  TOMORROW: "TOMORROW",
  LATER: "LATER",
  COMPLETED: "COMPLETED",
  RECURRING: "RECURRING",
}

export class Store {
  constructor(setter){
    this.setter = setter

    this.theme = 0

    this.today = []
    this.tomorrow = []
    this.later = []
    this.completed = []
    this.recurring = []

    this.goals = []

    this.totals = {
      all: 0,
      remaining: 0,
      completed: 0,
      recurring: 0,
      today: 0,
      tomorrow: 0,
      goals: 0,
    }
    this.counts = {
      today: 0,
      tomorrow: 0,
      goals: 0,
    }

    this.settings = {
      theme: 0,
    }

    this.completeTask = this.completeTask.bind(this)
    this.redoCompletedTaskToday = this.redoCompletedTaskToday.bind(this)
    this.redoCompletedTaskTomorrow = this.redoCompletedTaskTomorrow.bind(this)
    this.scheduleTaskForTomorrow = this.scheduleTaskForTomorrow.bind(this)
    this.scheduleTaskForToday = this.scheduleTaskForToday.bind(this)
    this.scheduleTaskForLater = this.scheduleTaskForLater.bind(this)

  }

  createTask(bucket){

  }

  // swipe actions
  completeTask(task){
    var now = new Date()
    t.completed = true
    t.completedAt = now
    t.completionHistory.push({
      completed:true,
      recordedAt:now,
    })
    this.today.splice(this.today.findIndex((t)=>t.id==task.id),1);
    this.completed.unshift(task)
    this.counts.today = this.counts.today - 1
    this.counts.remaining = this.counts.remaining - 1
    this.totals.completed = this.totals.completed + 1
    this.setter(this)
  }
  redoCompletedTaskToday(task){

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

  }
  setTaskDuration(task, duration){

  }
  setTaskRecurring(task){

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
  }
  getRemainingTasks(){
  }
  getCompletedTasks(){
  }
  getRecurringTasks(){
  }
  getGoalTasks(goal){
  }
  getTodayTasks(){
  }
  getTomorrowTasks(){
  }
  getNowTask(){
  }

  getGoals(){
  }

  //
  getAllTasksCount(){
  }
  getRemainingCount(){
  }
  getCompletedCount(){
  }
  getRecurringCount(){
  }

  sort(){

  }

  save(){

  }
  saveTask(){

  }
  load(){
    this.tasks = [{
      id: uuid(),
      text:"jg",
      scheduledForToday: true,
      scheduledForTomorrow: true,
      importance: null,
      difficulty: null,
      addedAt:new Date(),
      recurring:false,
      timeSpecified: false,
      from:null,
      to:null,
      forTomorrow:false,
      completed: false,
      completedAt: null,
      isNew: false,
      scheduleHistory: [{
        forTomorrow: false,
        scheduledAt: new Date(),
      }],
      completionHistory: [],
      goals: [{
        id: "055e7529-da9b-458d-9591-c0a3aadac2cf7",
        name: "acheive a big thing",
      },]
    },{
      id: uuid(),
      text:"jg",
      scheduledForToday: true,
      scheduledForTomorrow: true,
      importance: null,
      difficulty: null,
      addedAt:new Date(),
      recurring:false,
      timeSpecified: false,
      from:null,
      to:null,
      forTomorrow:false,
      completed: false,
      completedAt: null,
      isNew: false,
      scheduleHistory: [{
        forTomorrow: false,
        scheduledAt: new Date(),
      }],
      completionHistory: [],
      goals: [{
        id: "055e7529-da9b-458d-9591-c0a3aadac2cf7",
        name: "acheive a big thing",
      },]
    }]
    this.goals = goals
    this.totals = {
      today: this.getTodayTasks().length,
      tomorrow: this.getTomorrowTasks().length,
      completed: this.getCompletedTasks().length
    }
    this.counts = {
      today: this.getTodayTasks().length,
      tomorrow: this.getTomorrowTasks().length
    }
    this.sort()
  }
}
