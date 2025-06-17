import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';

// Get tasks with real-time updates
export const getTasks = (userId, callback) => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Handle both old and new field names for backward compatibility
      tasks.push({
        id: doc.id,
        userId: data.userId,
        dayOfMaking: data.dayOfMaking,
        task: data.task,
        isCompleted: data.isCompleted ?? data.status ?? false, // Handle both field names
        markedForDelete: data.markedForDelete ?? false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    callback(tasks);
  });
};

// Add a new task
export const addTask = async (userId, dayOfMaking, task) => {
  try {
    // Ensure dayOfMaking is in YYYY-MM-DD format
    const formattedDate = typeof dayOfMaking === 'string' ? dayOfMaking : dayOfMaking.toISOString().slice(0, 10);
    
    const docRef = await addDoc(collection(db, 'tasks'), {
      userId,
      dayOfMaking: formattedDate,
      task,
      isCompleted: false,
      markedForDelete: false,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a single task
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Delete all tasks for a specific date
export const deleteTasksByDate = async (userId, date) => {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      where('dayOfMaking', '==', date)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error('Error deleting tasks by date:', error);
    throw error;
  }
};