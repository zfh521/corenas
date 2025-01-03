import { sequelize, DataTypes } from '../config/mockDatabase';
import type { Role } from '../types/index';

const RoleModel = sequelize.define<Role>('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  permissions: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

export default RoleModel; 