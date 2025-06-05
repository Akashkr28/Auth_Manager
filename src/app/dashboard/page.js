'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = async url => {
  const res = await fetch(url);
  
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json().catch(() => ({}));
    error.status = res.status;
    throw error;
  }
  
  return res.json();
};

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const { data, error, mutate, isLoading } = useSWR(`/api/users?page=${page}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 3 times
      if (retryCount >= 3) return;
      // Retry after 3 seconds
      setTimeout(() => revalidate({ retryCount }), 3000);
    }
  });

  const handleEdit = async (user) => {
    const res = await fetch(`/api/users/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (res.ok) mutate();
  };

  const handleCreate = async () => {
    const res = await fetch(`/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', phoneNumber: '', password: 'default' })
    });
    if (res.ok) mutate();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">+ Add User</button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <div className="text-red-700 font-medium">Error loading users</div>
          <div className="text-red-600 text-sm mt-1">{error.info?.message || error.message}</div>
          <button 
            onClick={() => mutate()} 
            className="mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading users...</div>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.map(user => (
                <tr key={user._id} className="border-t">
                  <td className="p-2 border">
                    <input className="w-full" type="text" value={user.phoneNumber} onChange={e => user.phoneNumber = e.target.value} />
                  </td>
                  <td className="p-2 border">
                    <input className="w-full" type="text" value={user.email} onChange={e => user.email = e.target.value} />
                  </td>
                  <td className="p-2 border">
                    <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-2 py-1">Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button 
          disabled={page <= 1 || isLoading} 
          onClick={() => setPage(p => p - 1)} 
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Previous
        </button>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={isLoading}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}