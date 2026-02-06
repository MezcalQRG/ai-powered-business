import { initializeApp, cert, getApps, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let app: App
let db: Firestore

export function initializeFirebase() {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    
    if (!projectId) {
      throw new Error('FIREBASE_PROJECT_ID environment variable is required')
    }

    app = initializeApp({
      projectId,
    })
  } else {
    app = getApps()[0]
  }

  db = getFirestore(app)
  db.settings({ ignoreUndefinedProperties: true })

  return { app, db }
}

export function getDb(): Firestore {
  if (!db) {
    const initialized = initializeFirebase()
    return initialized.db
  }
  return db
}

export { app, db }
