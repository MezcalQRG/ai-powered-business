import { getDb } from '../config/firebase'
import type { User, Student, Lead } from '../types'

export class CRMService {
  private db = getDb()

  async identifyUser(phone: string): Promise<User | null> {
    const normalizedPhone = this.normalizePhone(phone)
    
    const usersRef = this.db.collection('users')
    const snapshot = await usersRef.where('phone', '==', normalizedPhone).limit(1).get()

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
    } as User
  }

  async getStudentProfile(userId: string): Promise<Student | null> {
    const docRef = this.db.collection('users').doc(userId)
    const doc = await docRef.get()

    if (!doc.exists) {
      return null
    }

    const data = doc.data()
    
    if (data?.type !== 'active_student' && data?.type !== 'former_student') {
      return null
    }

    return {
      id: doc.id,
      ...data,
    } as Student
  }

  async createLead(data: {
    phone: string
    name?: string
    email?: string
    source: Lead['source']
    interest?: string
  }): Promise<string> {
    const normalizedPhone = this.normalizePhone(data.phone)
    
    const existing = await this.identifyUser(normalizedPhone)
    if (existing) {
      return existing.id
    }

    const lead: Omit<Lead, 'id'> = {
      phone: normalizedPhone,
      name: data.name,
      email: data.email,
      type: 'lead',
      source: data.source,
      interest: data.interest,
      qualificationStatus: 'unqualified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await this.db.collection('users').add(lead)
    return docRef.id
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    await this.db.collection('users').doc(userId).update({
      ...data,
      updatedAt: new Date().toISOString(),
    })
  }

  async getAbsenteeStudents(daysSinceLastAttendance: number = 14): Promise<Student[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastAttendance)
    const cutoffISO = cutoffDate.toISOString()

    const snapshot = await this.db
      .collection('users')
      .where('type', '==', 'active_student')
      .where('lastAttendanceDate', '<', cutoffISO)
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Student))
  }

  async getDelinquentStudents(): Promise<Student[]> {
    const snapshot = await this.db
      .collection('users')
      .where('type', '==', 'active_student')
      .where('paymentStatus', '==', 'overdue')
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Student))
  }

  async getLeadsByStatus(status: Lead['qualificationStatus']): Promise<Lead[]> {
    const snapshot = await this.db
      .collection('users')
      .where('type', '==', 'lead')
      .where('qualificationStatus', '==', status)
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Lead))
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '')
  }
}

export const crmService = new CRMService()
