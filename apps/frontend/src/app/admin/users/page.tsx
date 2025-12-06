'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { adminApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'INTERN' | 'SUPERVISOR' | 'ADMIN';
  department: string | null;
  avatarUrl: string | null;
  supervisor: { id: string; name: string } | null;
  createdAt: string;
  _count: {
    activities: number;
    attendances: number;
    reports: number;
  };
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getUsers(page, 10, roleFilter || undefined);
        setUsers(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [page, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      await adminApi.updateUserRole(userId, newRole);
      const response = await adminApi.getUsers(page, 10, roleFilter || undefined);
      setUsers(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setUpdatingRole(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      SUPERVISOR: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      INTERN: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };
    return colors[role] || 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Role</option>
            <option value="INTERN">Intern</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card>
          <p className="text-gray-500 dark:text-slate-400 text-center py-8">Tidak ada user ditemukan</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
                      {user.department && (
                        <span className="inline-block mt-1 text-xs text-gray-600 dark:text-slate-400">
                          {user.department}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="font-bold text-blue-600 dark:text-blue-400">{user._count.activities}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Aktivitas</p>
                      </div>
                      <div>
                        <p className="font-bold text-green-600 dark:text-green-400">{user._count.attendances}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Kehadiran</p>
                      </div>
                      <div>
                        <p className="font-bold text-purple-600 dark:text-purple-400">{user._count.reports}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Report</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingRole === user.id}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getRoleColor(user.role)} border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="INTERN">Intern</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600 dark:text-slate-400">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
