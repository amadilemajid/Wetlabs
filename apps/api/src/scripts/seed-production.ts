import { db } from '../config/db';
import { logger } from '../config/logger';
import bcrypt from 'bcryptjs';

async function seedProduction() {
  try {
    logger.info('Starting production database seed...');

    // 1. Create sample wetlands
    const wetlands = [
      { name: 'Lake Nakuru', lat: -0.3031, lng: 36.0800, area_hectares: 18800 },
      { name: 'Lake Naivasha', lat: -0.7667, lng: 36.3500, area_hectares: 13900 },
      { name: 'Yala Swamp', lat: 0.0833, lng: 34.5167, area_hectares: 17500 },
      { name: 'Tana River Delta', lat: -2.5000, lng: 40.3333, area_hectares: 130000 },
      { name: 'Mara Wetlands', lat: -1.5000, lng: 35.1667, area_hectares: 8500 },
    ];

    logger.info('Inserting wetlands...');
    for (const w of wetlands) {
      await db.query(
        `INSERT INTO wetlands (name, geom, area_hectares, created_at)
         VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, NOW())
         ON CONFLICT (name) DO NOTHING`,
        [w.name, w.lng, w.lat, w.area_hectares]
      );
    }

    // 2. Create admin user
    logger.info('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await db.query(
      `INSERT INTO users (email, password_hash, role, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['admin@wetlabs.com', adminPassword, 'ADMIN']
    );

    // 3. Create sample reports
    logger.info('Creating sample reports...');
    const reportData = [
      { wetland: 'Lake Nakuru', severity: 'HIGH', observation: 'POLLUTION', description: 'Industrial waste discharge observed', lat: -0.3031, lng: 36.0800 },
      { wetland: 'Lake Nakuru', severity: 'MEDIUM', observation: 'VEGETATION_LOSS', description: 'Reduced vegetation cover', lat: -0.3100, lng: 36.0850 },
      { wetland: 'Lake Naivasha', severity: 'HIGH', observation: 'WATER_LEVEL_DROP', description: 'Significant water level decrease', lat: -0.7667, lng: 36.3500 },
      { wetland: 'Yala Swamp', severity: 'LOW', observation: 'WILDLIFE_DECLINE', description: 'Fewer bird species observed', lat: 0.0833, lng: 34.5167 },
      { wetland: 'Tana River Delta', severity: 'MEDIUM', observation: 'POLLUTION', description: 'Plastic waste accumulation', lat: -2.5000, lng: 40.3333 },
      { wetland: 'Mara Wetlands', severity: 'HIGH', observation: 'ENCROACHMENT', description: 'Agricultural expansion into wetland', lat: -1.5000, lng: 35.1667 },
      { wetland: 'Lake Nakuru', severity: 'LOW', observation: 'INVASIVE_SPECIES', description: 'Water hyacinth growth', lat: -0.3050, lng: 36.0820 },
      { wetland: 'Lake Naivasha', severity: 'MEDIUM', observation: 'WILDLIFE_DECLINE', description: 'Fish population decrease', lat: -0.7700, lng: 36.3550 },
    ];

    for (const report of reportData) {
      const wetlandResult = await db.query(
        'SELECT wetland_id FROM wetlands WHERE name = $1',
        [report.wetland]
      );

      if (wetlandResult.rows.length > 0) {
        const wetlandId = wetlandResult.rows[0].wetland_id;
        
        await db.query(
          `INSERT INTO reports (
            wetland_id, severity, observation_type, description, 
            geom, source, status, created_at
          ) VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, NOW())`,
          [
            wetlandId,
            report.severity,
            report.observation,
            report.description,
            report.lng,
            report.lat,
            'SMS',
            'PENDING'
          ]
        );
      }
    }

    logger.info('✅ Production seed completed successfully!');
    logger.info('📊 Summary:');
    logger.info(`   - ${wetlands.length} wetlands created`);
    logger.info(`   - 1 admin user created (admin@wetlabs.com / admin123)`);
    logger.info(`   - ${reportData.length} reports created`);
    
    await db.end();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedProduction();
