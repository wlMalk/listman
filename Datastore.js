import { uuid, limits } from './helpers'

const goals = [
  {
    id: "055e7529-da9b-458d-9591-c0a3adac2cf7",
    name: "Get a job",
    start: new Date(new Date().getFullYear()-1, 0, 1),
    deadline: new Date(new Date().getFullYear(), 3, 28),
    completedTasks: 4,
    totalTasks: 15,
    inToday: true,
    inTomorrow: true,
    paused: true,
  },
  {
    id: "055e7529-da9b-458d-9591-c0a3adac2cjf7",
    name: "Lose weight",
    start: new Date(new Date().getFullYear(), 0, 1),
    deadline: new Date(new Date().getFullYear(), 1, 19),
    completedTasks: 5,
    totalTasks: 15,
    inToday: true,
    inTomorrow: true,
  },
  {
    id: "055e7529-da9b-458d-9591-c0a3adac25cf7",
    name: "learn something",
    start: new Date(new Date().getFullYear(), 0, 1),
    deadline: new Date(new Date().getFullYear(), 1, 20),
    completedTasks: 5,
    totalTasks: 15,
    inToday: true,
    inTomorrow: true,
  },
  {
    id: "055e7529-da9b-458d-9591-c0a3adbac2cf7",
    name: "find a thing",
    start: new Date(new Date().getFullYear(), 0, 1),
    deadline: new Date(new Date().getFullYear(), 1, 20),
    completedTasks: 5,
    totalTasks: 15,
    inToday: true,
    inTomorrow: true,
  },
  {
    id: "055e7529-da9b-458d-9591-c0a3aadac2cf7",
    name: "acheive a big thing",
    start: new Date(new Date().getFullYear(), 0, 1),
    deadline: new Date(new Date().getFullYear(), 1, 20),
    completedTasks: 5,
    totalTasks: 15,
    inToday: true,
    inTomorrow: true,
  },
  {
    id: "055e7529-da9b-458d-9591-c0a3dadac2cf7",
    name: "fix lots of things",
    start: new Date(new Date().getFullYear(), 0, 1),
    deadline: new Date(new Date().getFullYear(), 1, 20),
    completedTasks: 5,
    totalTasks: 15,
    inToday: true,
    inTomorrow: true,
  }
]

export class Datastore {
  constructor(setter){
    this.theme = 0
    this.setter = setter
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
  sort(){
    var now = new Date()
    this.tasks = this.tasks.sort((a,b)=>{
      if(a.completed&&b.completed){
        return a.completedAt<b.completedAt?1:-1
      }else if(a.completed&&!b.completed){
        return 1
      }else if(b.completed&&!a.completed){
        return -1
      }
      if(a.timeSpecified&&b.timeSpecified){
        if(a.from!=null&&b.from!=null){
          if(a.to!=null&&b.to!=null){

          }else if(a.to!=null&&b.to==null){

          }if(a.to==null&&b.to!=null){

          }
        }else if(a.from!=null&&b.from==null){

        }else if(a.from==null&&b.from!=null){

        }
      }else if(a.timeSpecified){
        if(
          (a.from!=null&&a.to==null&&a.from<=now)||
          (a.from==null&&a.to!=null&&a.to>=now)||
          (a.from!=null&&a.to!=null&&a.from<=now&&a.to>=now)){
          return 1
        }
      }else if(b.timeSpecified){
        if(
          (b.from!=null&&b.to==null&&b.from<=now)||
          (b.from==null&&b.to!=null&&b.to>=now)||
          (b.from!=null&&b.to!=null&&b.from<=now&&b.to>=now)){
          return -1
        }
      }
      if(a.recurring&&!b.recurring){
        return -1
      }else if(!a.recurring&&b.recurring){
        return 1
      }
      if(a.importance<b.importance){

      }
      return b.importance-a.importance
    })
  }
  createTask(forTomorrow){
    if(
      (typeof forTomorrow != 'undefined' || forTomorrow != null)||
      (typeof forTomorrow != 'undefined' && forTomorrow != null && this.canAddTask(forTomorrow))
    ){
      var now = new Date()
      var id = uuid()
      this.tasks.unshift({
        id: id,
        text:"",
        importance:null,
        difficulty:null,
        scheduledForToday: true,
        scheduledForTomorrow: true,
        addedAt:now,
        recurring:false,
        timeSpecified: false,
        from:null,
        to:null,
        forTomorrow:forTomorrow,
        completed: false,
        completedAt: null,
      	isNew: true,
        scheduleHistory: [{
          forTomorrow: forTomorrow,
          scheduledAt: now,
        }],
        completionHistory: [],
      })
      if(!forTomorrow){
        this.counts.today = this.counts.today + 1
        this.totals.today = this.totals.today + 1
      }else{
        this.counts.tomorrow = this.counts.tomorrow + 1
        this.totals.tomorrow = this.totals.tomorrow + 1
      }
      this.setter(this)
      return id
    }
    return null
  }
  editTask(id, text){
    var t=this.getTask(id);
    if(t!=null&&/\S/.test(text)&&text!==t.text&&text.length<=limits.textLength&&this.canChange(t.id)){
      t.text = text
      t.isNew = false
      this.setter(this)
      return true
    }
    return false
  }
  deleteTask(id){
    var i = this.tasks.findIndex(e => e.id === id)
    if(i>=0&&this.canChange(this.tasks[i].id)){
      if(!this.tasks[i].forTomorrow){
        this.counts.today = this.counts.today - 1
        this.totals.today = this.totals.today - 1
      }else{
        this.counts.tomorrow = this.counts.tomorrow - 1
        this.totals.tomorrow = this.totals.tomorrow - 1
      }
      this.tasks.splice(i,1);
      this.setter(this)
    }
  }
  completeTask(id){
    var i = this.tasks.findIndex(e => e.id === id)
    if(i>=0){
      var t = this.tasks[i]
      var now = new Date()
      t.completed = true
      t.completedAt = now
      t.completionHistory.push({
        completed:true,
        addedAt:now,
      })
      this.tasks.splice(i,1);
      this.tasks.unshift(t)
      if(!t.forTomorrow){
        this.counts.today = this.counts.today - 1
      }else{
        this.counts.tomorrow = this.counts.tomorrow - 1
      }
      this.totals.completed = this.totals.completed + 1
      this.setter(this)
    }
  }
  uncompleteTask(id,forTomorrow){
    if(this.canAddTask(forTomorrow)){
      var i = this.tasks.findIndex(e => e.id === id)
      if(i>=0){
        var t = this.tasks[i]
        var now = new Date()
        t.completed = false
        t.completedAt = null
        t.completionHistory.push({
          completed:false,
          addedAt:now,
        })
        this.tasks.splice(i,1);
        this.tasks.unshift(t)
        if(!forTomorrow){
          this.counts.today = this.counts.today + 1
          if(t.scheduleHistory.filter((h)=>{return !h.forTomorrow}).length==0){
            this.totals.today = this.totals.today + 1
            this.totals.tomorrow = this.totals.tomorrow - 1
          }else if(t.forTomorrow&&t.scheduleHistory.filter((h)=>{return h.forTomorrow}).length>0){
            this.totals.today = this.totals.today + 1
            this.totals.tomorrow = this.totals.tomorrow - 1
          }
        }else{
          this.counts.tomorrow = this.counts.tomorrow + 1
          if(t.scheduleHistory.filter((h)=>{return h.forTomorrow}).length==0){
            this.totals.tomorrow = this.totals.tomorrow + 1
            this.totals.today = this.totals.today - 1
          }else if(!t.forTomorrow&&t.scheduleHistory.filter((h)=>{return !h.forTomorrow}).length>0){
            this.totals.tomorrow = this.totals.tomorrow + 1
            this.totals.today = this.totals.today - 1
          }
        }
        t.forTomorrow=forTomorrow
        t.scheduleHistory.push({
          forTomorrow:forTomorrow,
          scheduledAt:now,
        })
        this.totals.completed = this.totals.completed - 1
        this.setter(this)
      }
    }
  }
  scheduleTaskForTomorrow(id){
    if(this.canAddTask(true)){
      var i = this.tasks.findIndex(e => e.id === id)
      if(i>=0){
        var t = this.tasks[i]
        if(t.completed){
          return
        }
        var now = new Date()
        t.scheduleHistory.push({
          forTomorrow:true,
          scheduledAt:now,
        })
        t.forTomorrow=!t.forTomorrow
        this.tasks.splice(i,1);
        this.tasks.unshift(t)
        this.counts.today = this.counts.today - 1
        this.totals.today = this.totals.today - 1
        this.counts.tomorrow = this.counts.tomorrow + 1
        this.totals.tomorrow = this.totals.tomorrow + 1
        this.setter(this)
      }
    }
  }
  scheduleTaskForToday(id){
    if(this.canAddTask(false)){
      var i = this.tasks.findIndex(e => e.id === id)
      if(i>=0){
        var t = this.tasks[i]
        if(t.completed){
          return
        }
        var now = new Date()
        t.scheduleHistory.push({
          forTomorrow:false,
          scheduledAt:now,
        })
        t.forTomorrow=!t.forTomorrow
        this.tasks.splice(i,1);
        this.tasks.unshift(t)
        this.counts.today = this.counts.today + 1
        this.totals.today = this.totals.today + 1
        this.counts.tomorrow = this.counts.tomorrow - 1
        this.totals.tomorrow = this.totals.tomorrow - 1
        this.setter(this)
      }
    }
  }
  setTaskImportance(id, importance){
    var t=this.getTask(id);
    if(t!=null){
      t.importance = importance
    }
    this.sort()
    this.setter(this)
  }
  setTaskDifficulty(id, difficulty){
    var t=this.getTask(id);
    if(t!=null){
      t.difficulty = difficulty
    }
    this.sort()
    this.setter(this)
  }
  setTaskTimePeriod(){

  }
  toggleTaskRecurring(id){
    var t=this.getTask(id);
    if(t!=null){
      t.recurring = !t.recurring
    }
    this.sort()
    this.setter(this)
  }
  canAddTask(forTomorrow){
    return (!forTomorrow&&this.counts.today<limits.todayTasks)||(forTomorrow&&this.counts.tomorrow<limits.tomorrowTasks)
  }
  canChange(id){
    var t = this.getTask(id)
    if(t!=null){
      return Math.floor((new Date() - t.addedAt)/60000) < limits.timeForChanges
    }
    return false
  }
  getTask(id){
    var i = this.tasks.findIndex(e => e.id === id)
    if(i<0){
      return null
    }else{
      return this.tasks[i]
    }
  }
  getTodayTasks(){
    return this.tasks.filter((t)=>!t.forTomorrow&&!t.completed).reverse()
  }
  getTomorrowTasks(){
    return this.tasks.filter((t)=>t.forTomorrow&&!t.completed)
  }
  getCompletedTasks(){
    return this.tasks.filter((t)=>t.completed)
  }
  getTasksWithTimePeriod(){

  }
  getGoals(){
    return this.goals
  }
  getTasksCount(){
    return 0
  }
  getRemainingCount(){
    return 0
  }
  getCompletedCount(){
    return 0
  }
  getRecurringCount(){
    return 0
  }
  save(){

  }
  saveTask(){

  }
  load(){

  }
}
