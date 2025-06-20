export const MOCK_USERS = [
  { id: 1, username: 'user1', password: 'pass123', role: 'user', permissions: ['view_profile'] },
  { id: 2, username: 'admin1', password: 'admin123', role: 'admin', permissions: ['manage_users', 'edit_profile'] }
];

export const MOCK_PERMISSIONS = {
  user: ['view_profile', 'edit_profile'],
  admin: ['manage_users', 'edit_profile', 'delete_users']
};