import User from './User';

export const setupAssociations = () => {
  // Self-referencing association for nested users
  User.hasMany(User, {
    as: 'children',
    foreignKey: 'parentId',
    onDelete: 'CASCADE',
  });

  User.belongsTo(User, {
    as: 'parent',
    foreignKey: 'parentId',
  });
};