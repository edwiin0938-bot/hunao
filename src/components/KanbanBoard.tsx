'use client';

import { useState, useEffect } from 'react';
import { Experiment } from '@/lib/db';

const COLUMNS = [
  { id: 'todo', label: '待辦', color: 'bg-gray-100' },
  { id: 'in-progress', label: '進行中', color: 'bg-blue-50' },
  { id: 'review', label: '審核中', color: 'bg-yellow-50' },
  { id: 'done', label: '完成', color: 'bg-green-50' },
] as const;

type ColumnId = typeof COLUMNS[number]['id'];

export default function KanbanBoard() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    description: '',
    owner: '',
    status: 'todo' as ColumnId,
    start_date: '',
    end_date: '',
    revenue_signal: '',
  });

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const res = await fetch('/api/experiments');
      const data = await res.json();
      setExperiments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch:', error);
      setExperiments([]);
    } finally {
      setLoading(false);
    }
  };

  const createExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExperiment),
      });
      if (res.ok) {
        setNewExperiment({
          name: '',
          description: '',
          owner: '',
          status: 'todo',
          start_date: '',
          end_date: '',
          revenue_signal: '',
        });
        setShowForm(false);
        fetchExperiments();
      }
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  const updateStatus = async (id: number, status: ColumnId) => {
    try {
      const res = await fetch(`/api/experiments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchExperiments();
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const deleteExperiment = async (id: number) => {
    if (!confirm('確定要刪除這個實驗嗎？')) return;
    try {
      const res = await fetch(`/api/experiments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchExperiments();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const getColumnExperiments = (status: ColumnId) => 
    experiments.filter(e => e.status === status);

  if (loading) return <div className="p-8">載入中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">實驗看板</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? '取消' : '+ 新增實驗'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={createExperiment} className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="實驗名稱 *"
                value={newExperiment.name}
                onChange={e => setNewExperiment({...newExperiment, name: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <select
                value={newExperiment.status}
                onChange={e => setNewExperiment({...newExperiment, status: e.target.value as ColumnId})}
                className="border p-2 rounded"
              >
                {COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="負責人"
                value={newExperiment.owner}
                onChange={e => setNewExperiment({...newExperiment, owner: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="開始日期"
                value={newExperiment.start_date}
                onChange={e => setNewExperiment({...newExperiment, start_date: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="結束日期"
                value={newExperiment.end_date}
                onChange={e => setNewExperiment({...newExperiment, end_date: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="收入訊號"
                value={newExperiment.revenue_signal}
                onChange={e => setNewExperiment({...newExperiment, revenue_signal: e.target.value})}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="描述"
                value={newExperiment.description}
                onChange={e => setNewExperiment({...newExperiment, description: e.target.value})}
                className="border p-2 rounded col-span-2"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              建立實驗
            </button>
          </form>
        )}

        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(column => (
            <div key={column.id} className={`${column.color} rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-700">{column.label}</h2>
                <span className="bg-white px-2 py-1 rounded-full text-sm text-gray-600">
                  {getColumnExperiments(column.id).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {getColumnExperiments(column.id).map(exp => (
                  <div key={exp.id} className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{exp.name}</h3>
                      <button
                        onClick={() => deleteExperiment(exp.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                    
                    {exp.description && (
                      <p className="text-sm text-gray-600 mb-2">{exp.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {exp.owner && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{exp.owner}</span>
                      )}
                      {exp.revenue_signal && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">💰 {exp.revenue_signal}</span>
                      )}
                    </div>
                    
                    <select
                      value={exp.status}
                      onChange={e => updateStatus(exp.id, e.target.value as ColumnId)}
                      className="text-sm border rounded px-2 py-1 w-full"
                    >
                      {COLUMNS.map(col => (
                        <option key={col.id} value={col.id}>{col.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
