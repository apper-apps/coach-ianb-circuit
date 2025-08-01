import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { userService } from '@/services/api/userService';

function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    role: 'sme',
    credits: 100,
    password: ''
  });

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'client', label: 'Client' },
    { value: 'sme', label: 'Subject Matter Expert' },
    { value: 'super_admin', label: 'Super Admin' }
  ];

  const smeRoleOptions = [
    { value: 'client', label: 'Client' },
    { value: 'sme', label: 'Subject Matter Expert' },
    { value: 'super_admin', label: 'Super Admin' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getAll();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      email: '',
      role: 'sme',
      credits: 100,
      password: ''
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.Name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);
      await userService.create(formData);
      toast.success('User created successfully');
      setShowCreateForm(false);
      resetForm();
      loadUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      Name: user.Name || '',
      email: user.email || '',
      role: user.role || 'sme',
      credits: user.credits || 100,
      password: user.password || ''
    });
    setShowEditForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.Name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);
      await userService.update(selectedUser.Id, formData);
      toast.success('User updated successfully');
      setShowEditForm(false);
      setSelectedUser(null);
      resetForm();
      loadUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userService.delete(userId);
      toast.success('User deleted successfully');
      setDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const UserForm = ({ isEdit = false, onSubmit, onCancel }) => (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {isEdit ? 'Edit User' : 'Create New User'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            required
            placeholder="Enter full name"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter email address"
          />
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            options={smeRoleOptions}
            required
          />
          <Input
            label="Credits"
            name="credits"
            type="number"
            value={formData.credits}
            onChange={handleInputChange}
            placeholder="Enter credit amount"
            min="0"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required={!isEdit}
            placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={formLoading}
            className="flex items-center gap-2"
          >
            {formLoading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
            {isEdit ? 'Update User' : 'Create User'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={formLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );

  if (loading) {
    return <Loading className="flex justify-center items-center h-64" />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadUsers}
        className="flex justify-center items-center h-64"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage SME accounts and set up usernames and passwords
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="UserPlus" size={16} />
          Add New User
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => {
            setShowCreateForm(false);
            resetForm();
          }}
        />
      )}

      {/* Edit Form */}
      {showEditForm && (
        <UserForm
          isEdit={true}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedUser(null);
            resetForm();
          }}
        />
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={roleOptions}
            />
          </div>
        </div>
      </Card>

      {/* User List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Users ({filteredUsers.length})</h2>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <ApperIcon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first user'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.Name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'super_admin' 
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'sme'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'super_admin' ? 'Super Admin' : 
                         user.role === 'sme' ? 'SME' : 'Client'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.credits || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="flex items-center gap-1"
                        >
                          <ApperIcon name="Edit2" size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(user)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <ApperIcon name="Trash2" size={14} />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <strong>{deleteConfirm.Name}</strong>? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDeleteUser(deleteConfirm.Id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete User
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default UserManagement;