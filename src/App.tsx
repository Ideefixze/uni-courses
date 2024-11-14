import React, { useState } from 'react';
import { GraduationCap, Plus, Download, Upload } from 'lucide-react';
import CourseTable from './components/CourseTable';
import { Course, Task } from './types';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseName, setNewCourseName] = useState('');

  const addCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    
    const newCourse: Course = {
      id: crypto.randomUUID(),
      name: newCourseName,
      tasks: []
    };
    
    setCourses([...courses, newCourse]);
    setNewCourseName('');
  };

  const deleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const addTask = (courseId: string) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        const newTask: Task = {
          id: crypto.randomUUID(),
          name: 'New Task',
          completed: false,
          progress: 0
        };
        return {
          ...course,
          tasks: [...course.tasks, newTask]
        };
      }
      return course;
    }));
  };

  const updateTask = (courseId: string, taskId: string, updates: Partial<Task>) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          tasks: course.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      return course;
    }));
  };

  const deleteTask = (courseId: string, taskId: string) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          tasks: course.tasks.filter(task => task.id !== taskId)
        };
      }
      return course;
    }));
  };

  const exportProgress = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'course-progress.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        setCourses(importedData);
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Invalid file format. Please select a valid JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset the input value to allow importing the same file again
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap size={32} className="text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Course Task Tracker</h1>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <button
                onClick={exportProgress}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                title="Export Progress"
              >
                <Download size={20} />
                Export
              </button>
              <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload size={20} />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importProgress}
                  className="hidden"
                />
              </label>
            </div>
            <form onSubmit={addCourse} className="flex gap-2">
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Enter course name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
                Add Course
              </button>
            </form>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No courses yet. Add your first course to get started!</p>
          </div>
        ) : (
          courses.map(course => (
            <CourseTable
              key={course.id}
              course={course}
              onDeleteCourse={deleteCourse}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;