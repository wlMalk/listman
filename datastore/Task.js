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
      importance: null,
      time: null,
      duration: null,
      scheduledAt: new Date(),
      recurrance: null,
      completedAt: null,
      isNew: false,
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

  scheduledFor(date) {

  }

  scheduledForToday() {

  }
  scheduledForTomorrow() {

  }
}
