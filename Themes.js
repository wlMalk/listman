import * as chroma from 'chroma-js'
import { limits } from './helpers'

class Theme {
  constructor(mainColor, todayColor, tomorrowColor, mainAccent, todayAccent, tomorrowAccent){
    this.todayColor = todayColor

    if(typeof tomorrowColor !== "undefined" && tomorrowColor != null){
      this.tomorrowColor = tomorrowColor
    }else{
      this.tomorrowColor = new chroma.Color(this.todayColor).set('hsv.h', '+180').darken(3.5).hex()
    }


    this.todayContrast = '#fff'
    this.tomorrowContrast = '#fff'

    this.mainColor = mainColor
    if(typeof mainAccent !== "undefined" && mainAccent != null){
      this.mainAccent = mainAccent
    }else{
      this.mainAccent = new chroma.Color(this.mainColor).brighten(.5).hex()
    }
    // this.completedHighlight = new chroma.Color(this.mainColor).brighten(.5).hex()
    // this.completedText = new chroma.Color(this.mainColor).darken(2.25).saturate(.3).hex()
    // this.completedSeparator = new chroma.Color(this.mainColor).darken(.5).saturate(.3).hex()

    this.todaySecondary = new chroma.Color(this.todayColor).darken(1.5).saturate(.5).hex()
    this.tomorrowSecondary = new chroma.Color(this.tomorrowColor).brighten(1.5).saturate(.5).hex()

    if(typeof todayAccent !== "undefined" && todayAccent != null){
      this.todayAccent = todayAccent
    }else{
      this.todayAccent = new chroma.Color(this.todayColor).set('hsl.h', '-15').set('hsl.l', '+.2').saturate(.4).brighten(1.5).hex()
    }

    if(typeof tomorrowAccent !== "undefined" && tomorrowAccent != null){
      this.tomorrowAccent = tomorrowAccent
    }else{
      this.tomorrowAccent = new chroma.Color(this.tomorrowColor).set('hsl.h', '-15').set('hsl.l', '+.2').saturate(.4).brighten(1.5).hex()
    }

    var todayBaseColor = new chroma.Color(this.todayAccent).saturate(5).set('hsl.h', '-13').brighten(.45).hex()
    if(typeof todayAccent !== "undefined" && todayAccent != null){
      todayBaseColor = new chroma.Color(this.todayAccent).saturate(5).set('hsl.h', '+13').brighten(.45).hex()
    }
    this.todayTasks = chroma.scale([
        todayBaseColor,
      new chroma.Color(this.todayColor).saturate(.3).darken(.1).hex()]).mode('lch').colors(limits.todayTasks-1)
    this.todayTasks.unshift(todayBaseColor)

    var tomorrowBaseColor = new chroma.Color(this.tomorrowAccent).saturate(5).set('hsl.h', '-13').brighten(.45).hex()
    this.tomorrowTasks = chroma.scale([
        tomorrowBaseColor,
      new chroma.Color(this.tomorrowColor).saturate(.3).darken(.1).hex()]).mode('lch').colors(limits.tomorrowTasks-1)
    this.tomorrowTasks.unshift(tomorrowBaseColor)

    this.todayTasksText = this.todayTasks.map((n,i)=>new chroma.Color(n).darken(3-i*.2).hex())
    this.tomorrowTasksText = this.tomorrowTasks.map((n,i)=>new chroma.Color(n).darken(3-i*.2).hex())

    this.todayTasksHighlight = this.todayTasks.map((n,i)=>new chroma.Color(n).brighten(.5).hex())
    this.tomorrowTasksHighlight = this.tomorrowTasks.map((n,i)=>new chroma.Color(n).darken(.5).hex())

    this.taskTodayIndicator = new chroma.Color(this.todayColor).brighten(2).saturate(.5).hex()
    this.taskTomorrowIndicator = new chroma.Color(this.tomorrowColor).brighten(2).saturate(.5).hex()

    this.mainTitles = new chroma.Color(this.mainColor).darken(2).desaturate(.2).hex()

    this.goalHighlight = new chroma.Color(this.mainColor).brighten(.5).hex()
    this.goal = new chroma.Color(this.mainColor).darken(.3).hex()
    this.goalName = new chroma.Color(this.mainColor).darken(3).desaturate(.3).hex()
    this.goalProgressBar = new chroma.Color(this.mainColor).darken(1.5).desaturate(.2).hex()
    this.goalProgressBarIndicator = new chroma.Color(this.mainColor).darken(3).desaturate(.2).hex()
    this.goalTodayIndicator = new chroma.Color(this.todayColor).brighten(2).saturate(.5).hex()
    this.goalTomorrowIndicator = new chroma.Color(this.tomorrowColor).brighten(2).saturate(.5).hex()

    this.counterName = new chroma.Color(this.mainColor).darken(1.5).saturate(.3).hex()
    this.counterCount = new chroma.Color(this.mainColor).darken(2.5).desaturate(.3).hex()
    this.counterSeparator = new chroma.Color(this.mainColor).darken(.3).saturate(.2).hex()

    this.mainTasksColor = new chroma.Color(this.mainColor).brighten(.1).hex()
    this.mainTasksHighlightColor = new chroma.Color(this.mainColor).brighten(.5).hex()
    this.mainTasksBorderColor = new chroma.Color(this.mainColor).darken(.2).saturate(.2).hex()
    this.mainTasksTextColor = new chroma.Color(this.mainColor).darken(2.5).desaturate(.3).hex()
  }
}

// export const themes = [new Theme('#CD4331','#FFEEC9','#15222E','#FFFFFF','#FFA758','#37C3C8')]
export const themes = [new Theme('#FFEEC9','#CD4331', null, null,'#FFA758','#37C3C8')]
// export const themes = [new Theme('#FFEEC9','#CD4331','#15222E','#FFFFFF','#FFA758','#37C3C8')]
