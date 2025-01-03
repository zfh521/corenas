import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User as UserType } from '../types/index';

interface UserCreationAttributes extends Optional<UserType, 'id' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserType, UserCreationAttributes> implements UserType {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'User'
  }
);

export default User; 