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
      fromTime: null,
      duration: null,
      scheduledAt: new Date(),
      recurrance: false,
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

  scheduledFor(date) {

  }

  scheduledForToday() {

  }
  scheduledForTomorrow() {

  }
}
