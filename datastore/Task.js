import { uuid } from '../helpers'

export default class Task {
  constructor(bucket) {
    return {
      id: uuid(),
      text: "",
      parentRecurringTask: null,
      parentCompletedTask: null,
      bucket: bucket,
      dayScheduledFor: null,
      importance: 2,
      time: null,
      duration: null,
      scheduledAt: new Date(),
      recurrance: null,
      completedAt: null,
      isNew: true,
      scheduleHistory: [{
        bucket: bucket,
        scheduledAt: new Date(),
        scheduledForDate: null,
        schedulingType: null,
        userAction: true,
        rejection: false,
      }],
      goals: []
    }
  }

  new() {
    var task = new Task(this.bucket)
    task.text = this.text
    task.time = this.time
    task.importance = this.importance
    task.duration = this.duration
    task.isNew = false
    task.goals = this.goals.slice(0)
    return task
  }

  scheduledFor(date) {

  }

  scheduledForToday() {

  }
  scheduledForTomorrow() {

  }
}
