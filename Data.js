import { uuid, limits } from './helpers'

export class Datastore {
  constructor(setter){
    this.setter = setter

    this.theme = 0

    this.todayTasks = []
    this.tomorrowTasks = []
    this.laterTasks = []
    this.completedTasks = []
    this.recurringTasks = []

    this.goals = []
    
    this.counts = {}
    this.totals = {}
  }
  sort(){

  }
  createTask(forTomorrow){

  }
  editTask(id, text){

  }
  deleteTask(id){

  }
  completeTask(id){

  }
  rescheduleCompletedTaskForToday(id){

  }
  rescheduleCompletedTaskForTomorrow(id){

  }
  scheduleTaskForTomorrow(id){

  }
  scheduleTaskForToday(id){

  }
  scheduleTaskForLater(id){

  }
  setTaskImportance(id, importance){

  }
  setTaskTimePeriod(){

  }
  setTaskRecurring(id){

  }
  canAddTask(forTomorrow){

  }
  canChange(id){

  }
  getTask(id){

  }

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
  getNowTask(){
  }
  getTodayTasks(){
  }
  getTomorrowTasks(){
  }

  getGoals(){
  }
  getTasksCount(){
  }
  getRemainingCount(){
  }
  getCompletedCount(){
  }
  getRecurringCount(){
  }
  save(){

  }
  saveTask(){

  }
  load(){

  }
}
