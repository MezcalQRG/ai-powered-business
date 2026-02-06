import { getDb } from '../config/firebase'
import type { Appointment, TimeSlot } from '../types'
import { addHours, addDays, format, parseISO, isBefore, isAfter } from 'date-fns'

export class CalendarService {
  private db = getDb()

  async checkAvailability(
    startDate: Date,
    endDate: Date,
    appointmentType: Appointment['type'] = 'intro_class'
  ): Promise<TimeSlot[]> {
    const businessHours = {
      weekday: { start: '06:00', end: '21:00' },
      saturday: { start: '08:00', end: '14:00' },
      sunday: { start: '10:00', end: '12:00' },
    }

    const bookedSlots = await this.getBookedAppointments(startDate, endDate)
    const availableSlots: TimeSlot[] = []

    let currentDate = new Date(startDate)
    while (isBefore(currentDate, endDate)) {
      const daySlots = this.generateDaySlots(currentDate, businessHours)
      
      for (const slot of daySlots) {
        const isBooked = bookedSlots.some(appointment => {
          const appointmentStart = parseISO(appointment.dateTime)
          const appointmentEnd = addHours(appointmentStart, appointment.duration / 60)
          const slotStart = parseISO(slot.start)
          const slotEnd = parseISO(slot.end)

          return (
            (isAfter(slotStart, appointmentStart) && isBefore(slotStart, appointmentEnd)) ||
            (isAfter(slotEnd, appointmentStart) && isBefore(slotEnd, appointmentEnd)) ||
            (isBefore(slotStart, appointmentStart) && isAfter(slotEnd, appointmentEnd))
          )
        })

        availableSlots.push({
          ...slot,
          available: !isBooked,
          type: appointmentType,
        })
      }

      currentDate = addDays(currentDate, 1)
    }

    return availableSlots.filter(slot => slot.available)
  }

  async bookAppointment(data: {
    userId: string
    dateTime: string
    type: Appointment['type']
    duration?: number
    notes?: string
  }): Promise<string> {
    const appointment: Omit<Appointment, 'id'> = {
      userId: data.userId,
      type: data.type,
      dateTime: data.dateTime,
      duration: data.duration || 60,
      status: 'scheduled',
      notes: data.notes,
      reminderSent: false,
      createdAt: new Date().toISOString(),
    }

    const docRef = await this.db.collection('appointments').add(appointment)
    return docRef.id
  }

  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    const doc = await this.db.collection('appointments').doc(appointmentId).get()
    
    if (!doc.exists) {
      return null
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Appointment
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status']
  ): Promise<void> {
    await this.db.collection('appointments').doc(appointmentId).update({ status })
  }

  async getUpcomingAppointments(userId?: string): Promise<Appointment[]> {
    const now = new Date().toISOString()
    let query = this.db
      .collection('appointments')
      .where('dateTime', '>', now)
      .where('status', 'in', ['scheduled', 'confirmed'])

    if (userId) {
      query = query.where('userId', '==', userId)
    }

    const snapshot = await query.get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Appointment))
  }

  async getAppointmentsForReminder(hoursAhead: number = 24): Promise<Appointment[]> {
    const now = new Date()
    const futureTime = addHours(now, hoursAhead)

    const snapshot = await this.db
      .collection('appointments')
      .where('dateTime', '>', now.toISOString())
      .where('dateTime', '<', futureTime.toISOString())
      .where('reminderSent', '==', false)
      .where('status', '==', 'scheduled')
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Appointment))
  }

  async markReminderSent(appointmentId: string): Promise<void> {
    await this.db.collection('appointments').doc(appointmentId).update({
      reminderSent: true,
    })
  }

  private async getBookedAppointments(startDate: Date, endDate: Date): Promise<Appointment[]> {
    const snapshot = await this.db
      .collection('appointments')
      .where('dateTime', '>=', startDate.toISOString())
      .where('dateTime', '<=', endDate.toISOString())
      .where('status', 'in', ['scheduled', 'confirmed'])
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Appointment))
  }

  private generateDaySlots(date: Date, businessHours: any): TimeSlot[] {
    const dayOfWeek = date.getDay()
    let hours: { start: string; end: string }

    if (dayOfWeek === 0) {
      hours = businessHours.sunday
    } else if (dayOfWeek === 6) {
      hours = businessHours.saturday
    } else {
      hours = businessHours.weekday
    }

    const slots: TimeSlot[] = []
    const [startHour] = hours.start.split(':').map(Number)
    const [endHour] = hours.end.split(':').map(Number)

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(date)
      slotStart.setHours(hour, 0, 0, 0)

      const slotEnd = new Date(date)
      slotEnd.setHours(hour + 1, 0, 0, 0)

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: true,
      })
    }

    return slots
  }
}

export const calendarService = new CalendarService()
