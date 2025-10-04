import { Sequelize } from 'sequelize';
import { config } from './env';

export const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: config.nodeEnv === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('✅ Database synced');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};