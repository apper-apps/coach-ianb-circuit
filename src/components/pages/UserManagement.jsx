import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { userService } from '@/services/api/userService';

const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    role: 'sme',
    credits: 100
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await userService.getAll();
      setUsers(userData);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.Name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setCreateLoading(true);
    try {
      const newUser = await userService.create({
        Name: formData.Name,
        email: formData.email,
        role: formData.role,
        credits: parseInt(formData.credits) || 0,
        createdAt: new Date().toISOString()
      });

      if (newUser) {
        toast.success('User created successfully');
        setUsers(prev => [...prev, newUser]);
        setShowCreateForm(false);
        setFormData({ Name: '', email: '', role: 'sme', credits: 100 });
      }
    } catch (err) {
      toast.error('Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    setUpdateLoading(true);
    try {
      const updatedUser = await userService.update(userId, updates);
      
      if (updatedUser) {
        toast.success('User updated successfully');
        setUsers(prev => prev.map(user => 
          user.Id === userId ? { ...user, ...updatedUser } : user
        ));
        setEditingUser(null);
      }
    } catch (err) {
      toast.error('Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      const success = await userService.delete(userId);
      
      if (success) {
        toast.success('User deleted successfully');
        setUsers(prev => prev.filter(user => user.Id !== userId));
      }
    } catch (err) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin': return 'error';
      case 'sme': return 'primary';
      case 'client': return 'secondary';
      default: return 'surface';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'sme': return 'SME';
      case 'client': return 'Client';
      default: return role;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUsers} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all user accounts and permissions</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'sme', label: 'SME' },
                { value: 'client', label: 'Client' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Create User Form */}
      {showCreateForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Create New User</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCreateForm(false);
                setFormData({ Name: '', email: '', role: 'sme', credits: 100 });
              }}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
          
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <Input
                  value={formData.Name}
                  onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  options={[
                    { value: 'sme', label: 'Subject Matter Expert (SME)' },
                    { value: 'client', label: 'Client' },
                    { value: 'super_admin', label: 'Super Admin' }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Credits
                </label>
                <Input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
                  placeholder="Enter initial credits"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                loading={createLoading}
                disabled={createLoading}
              >
                Create User
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ Name: '', email: '', role: 'sme', credits: 100 });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Users ({filteredUsers.length})
          </h3>
        </div>

        {filteredUsers.length === 0 ? (
          <Empty 
            message={searchTerm || roleFilter ? "No users match your filters" : "No users found"}
            description={searchTerm || roleFilter ? "Try adjusting your search or filter criteria" : "Create your first user to get started"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Credits</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.Id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {user.Name || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600">
                        {user.email || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge color={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600">
                        {user.credits || 0}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        {user.Id !== currentUser.Id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.Id, user.Name)}
                            disabled={deleteLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingUser(null)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleUpdateUser(editingUser.Id, {
                  Name: formData.get('name'),
                  email: formData.get('email'),
                  role: formData.get('role'),
                  credits: parseInt(formData.get('credits')) || 0
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  name="name"
                  defaultValue={editingUser.Name || ''}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editingUser.email || ''}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Select
                  name="role"
                  defaultValue={editingUser.role || 'sme'}
                  options={[
                    { value: 'sme', label: 'Subject Matter Expert (SME)' },
                    { value: 'client', label: 'Client' },
                    { value: 'super_admin', label: 'Super Admin' }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits
                </label>
                <Input
                  name="credits"
                  type="number"
                  defaultValue={editingUser.credits || 0}
                  placeholder="Enter credits"
                  min="0"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  loading={updateLoading}
                  disabled={updateLoading}
                >
                  Update User
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;