import React from 'react';
import { Trash2, Plus, CheckCircle, Circle } from 'lucide-react';
import { Task, Course } from '../types';

interface CourseTableProps {
  course: Course;
  onDeleteCourse: (id: string) => void;
  onAddTask: (courseId: string) => void;
  onUpdateTask: (courseId: string, taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (courseId: string, taskId: string) => void;
}

export default function CourseTable({
  course,
  onDeleteCourse,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: CourseTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="bg-indigo-600 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">{course.name}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onAddTask(course.id)}
            className="p-2 text-white hover:bg-indigo-500 rounded-full transition-colors"
            title="Add task"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => onDeleteCourse(course.id)}
            className="p-2 text-white hover:bg-indigo-500 rounded-full transition-colors"
            title="Delete course"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {course.tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => onUpdateTask(course.id, task.id, { name: e.target.value })}
                    className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onUpdateTask(course.id, task.id, { completed: !task.completed })}
                    className={`flex items-center gap-2 ${task.completed ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                    {task.completed ? 'Complete' : 'Incomplete'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => onUpdateTask(course.id, task.id, { progress: Number(e.target.value) })}
                    className="w-16 bg-gray-50 border rounded px-2 py-1"
                  />
                  <span className="ml-1">%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onDeleteTask(course.id, task.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}