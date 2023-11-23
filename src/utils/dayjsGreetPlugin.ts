import dayjs from 'dayjs'

declare module 'dayjs' {
  interface Dayjs {
    greet(): string
  }
}

export default (option: any, dayjsClass: any, dayjsFactory: any) => {
  function getGreet(date: dayjs.Dayjs) {
    const hour = Number(date.format('H'))

    const splitAfternoon = 12 //24hr time to split the afternoon
    const splitEvening = 18 //24hr time to split the evening

    const isMorning = 5 <= hour && hour < splitAfternoon
    const isAfternoon = splitAfternoon <= hour && hour < splitEvening

    if (isMorning) {
      return 'Godmorgen'
    } else if (isAfternoon) {
      return 'Hej'
    }

    return 'Godaften'
  }

  dayjsClass.prototype.greet = function () {
    return getGreet(this)
  }
  dayjsFactory.greet = function() {
    return getGreet(dayjs.local())
  }
}