import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import User from '../src/models/User.js';
import Equipment from '../src/models/Equipment.js';
import Maintenance from '../src/models/Maintenance.js';
import Inventory from '../src/models/Inventory.js';
import Supplier from '../src/models/Supplier.js';
import Team from '../src/models/Team.js';

dotenv.config();

async function seedITCompanyData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Equipment.deleteMany({});
    await Maintenance.deleteMany({});
    await Inventory.deleteMany({});
    await Supplier.deleteMany({});
    console.log('🗑️  Cleared existing data\n');

    // ==================== USERS ====================
    const hashedPassword = await bcryptjs.hash('TechCorp@2024', 10);
    const users = await User.insertMany([
      // Admins
      {
        fullName: 'Rajesh Kumar',
        email: 'rajesh.kumar@techcorp.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        fullName: 'Priya Sharma',
        email: 'priya.sharma@techcorp.com',
        password: hashedPassword,
        role: 'admin'
      },
      // Technicians - Infrastructure Team
      {
        fullName: 'Amit Patel',
        email: 'amit.patel@techcorp.com',
        password: hashedPassword,
        role: 'technician'
      },
      {
        fullName: 'Neha Singh',
        email: 'neha.singh@techcorp.com',
        password: hashedPassword,
        role: 'technician'
      },
      {
        fullName: 'Vikram Reddy',
        email: 'vikram.reddy@techcorp.com',
        password: hashedPassword,
        role: 'technician'
      },
      // Technicians - Network Team
      {
        fullName: 'Deepak Verma',
        email: 'deepak.verma@techcorp.com',
        password: hashedPassword,
        role: 'technician'
      },
      {
        fullName: 'Anjali Desai',
        email: 'anjali.desai@techcorp.com',
        password: hashedPassword,
        role: 'technician'
      },
      // Technicians - Security Team
      {
        fullName: 'Rohan Gupta',
        email: 'rohan.gupta@techcorp.com',
        password: hashedPassword,
        role: 'technician'
      },
      {
        fullName: 'Divya Nair',
        email: 'divya.nair@techcorp.com',
        password: hashedPassword,
        role: 'technician'
      },
      // Viewers
      {
        fullName: 'Suresh Mishra',
        email: 'suresh.mishra@techcorp.com',
        password: hashedPassword,
        role: 'viewer'
      },
      {
        fullName: 'Kavya Iyer',
        email: 'kavya.iyer@techcorp.com',
        password: hashedPassword,
        role: 'viewer'
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // ==================== TEAMS ====================
    const teams = await Team.insertMany([
      {
        teamName: 'Infrastructure & Servers',
        company: 'TechCorp Solutions',
        teamMembers: [users[2]._id, users[3]._id, users[4]._id] // Amit, Neha, Vikram
      },
      {
        teamName: 'Network & Connectivity',
        company: 'TechCorp Solutions',
        teamMembers: [users[5]._id, users[6]._id] // Deepak, Anjali
      },
      {
        teamName: 'Security & Backup',
        company: 'TechCorp Solutions',
        teamMembers: [users[7]._id, users[8]._id] // Rohan, Divya
      },
      {
        teamName: 'On-site Support',
        company: 'TechCorp Solutions',
        teamMembers: [users[2]._id, users[5]._id] // Amit, Deepak
      }
    ]);
    console.log(`✅ Created ${teams.length} teams\n`);

    // ==================== SUPPLIERS ====================
    const suppliers = await Supplier.insertMany([
      {
        supplierName: 'Dell Technologies India',
        contactPerson: 'Arjun Khanna',
        email: 'arjun.khanna@dell.com',
        phone: '+91-11-4000-0001',
        address: '123 Tech Park, Bangalore, Karnataka 560001'
      },
      {
        supplierName: 'Cisco Systems India',
        contactPerson: 'Meera Chatterjee',
        email: 'meera.chatterjee@cisco.com',
        phone: '+91-22-5500-0001',
        address: '456 Network Avenue, Mumbai, Maharashtra 400001'
      },
      {
        supplierName: 'HPE (Hewlett Packard Enterprise)',
        contactPerson: 'Sanjay Kumar',
        email: 'sanjay.kumar@hpe.com',
        phone: '+91-80-6700-0001',
        address: '789 Enterprise Road, Bangalore, Karnataka 560102'
      },
      {
        supplierName: 'Fortinet Security Solutions',
        contactPerson: 'Riya Banerjee',
        email: 'riya.banerjee@fortinet.com',
        phone: '+91-124-6700-0001',
        address: '321 Security Lane, Gurugram, Haryana 122001'
      },
      {
        supplierName: 'Palo Alto Networks India',
        contactPerson: 'Vikram Singh',
        email: 'vikram.singh@paloaltonetworks.com',
        phone: '+91-80-6000-0001',
        address: '654 Cyber Park, Bangalore, Karnataka 560103'
      },
      {
        supplierName: 'TechSupply Solutions',
        contactPerson: 'Ashok Malhotra',
        email: 'ashok.malhotra@techsupply.in',
        phone: '+91-11-2700-0001',
        address: '999 Components Road, New Delhi, Delhi 110001'
      }
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers\n`);

    // ==================== EQUIPMENT ====================
    const equipment = await Equipment.insertMany([
      // Servers
      {
        assetName: 'Dell PowerEdge R750 - Server 1',
        category: 'Server',
        manufacturer: 'Dell Technologies',
        model: 'PowerEdge R750',
        serialNumber: 'SN-2024-001-PWR750',
        purchaseDate: new Date('2023-03-15'),
        condition: 'Good',
        status: 'Active',
        maintenanceTeam: [users[2]._id, users[3]._id],
        suppliers: [suppliers[0]._id],
        notes: '2-socket Xeon server with 128GB RAM',
        createdBy: users[0]._id
      },
      {
        assetName: 'HPE ProLiant DL380 Gen11 - Server 2',
        category: 'Server',
        manufacturer: 'HPE',
        model: 'ProLiant DL380 Gen11',
        serialNumber: 'SN-2024-002-HPE380',
        purchaseDate: new Date('2023-06-20'),
        condition: 'Excellent',
        status: 'Active',
        maintenanceTeam: [users[2]._id],
        suppliers: [suppliers[2]._id],
        notes: 'Database server with 256GB RAM',
        createdBy: users[0]._id
      },
      {
        assetName: 'Dell PowerEdge R740 - Server 3',
        category: 'Server',
        manufacturer: 'Dell Technologies',
        model: 'PowerEdge R740',
        serialNumber: 'SN-2024-003-PWR740',
        purchaseDate: new Date('2022-01-10'),
        condition: 'Fair',
        status: 'Under Maintenance',
        maintenanceTeam: [users[3]._id, users[4]._id],
        suppliers: [suppliers[0]._id],
        notes: 'Legacy application server',
        createdBy: users[0]._id
      },
      // Network Equipment
      {
        assetName: 'Cisco Catalyst 9300X - Core Switch',
        category: 'Network Switch',
        manufacturer: 'Cisco Systems',
        model: 'Catalyst 9300X',
        serialNumber: 'SN-2024-004-CAT9300X',
        purchaseDate: new Date('2023-09-12'),
        condition: 'Excellent',
        status: 'Active',
        maintenanceTeam: [users[5]._id, users[6]._id],
        suppliers: [suppliers[1]._id],
        notes: 'Core network switch with 48 ports',
        createdBy: users[0]._id
      },
      {
        assetName: 'Cisco Nexus 5596UP - Storage Switch',
        category: 'Network Switch',
        manufacturer: 'Cisco Systems',
        model: 'Nexus 5596UP',
        serialNumber: 'SN-2024-005-NEX5596',
        purchaseDate: new Date('2023-04-08'),
        condition: 'Good',
        status: 'Active',
        maintenanceTeam: [users[5]._id],
        suppliers: [suppliers[1]._id],
        notes: 'SAN storage switch',
        createdBy: users[0]._id
      },
      // Security Appliances
      {
        assetName: 'Fortinet FortiGate 3500F - Firewall',
        category: 'Security Appliance',
        manufacturer: 'Fortinet',
        model: 'FortiGate 3500F',
        serialNumber: 'SN-2024-006-FG3500F',
        purchaseDate: new Date('2023-11-05'),
        condition: 'Excellent',
        status: 'Active',
        maintenanceTeam: [users[7]._id, users[8]._id],
        suppliers: [suppliers[3]._id],
        notes: 'Enterprise firewall with IPS/IDS',
        createdBy: users[0]._id
      },
      {
        assetName: 'Palo Alto Networks PA-5220 - Firewall',
        category: 'Security Appliance',
        manufacturer: 'Palo Alto Networks',
        model: 'PA-5220',
        serialNumber: 'SN-2024-007-PA5220',
        purchaseDate: new Date('2023-08-20'),
        condition: 'Good',
        status: 'Active',
        maintenanceTeam: [users[7]._id],
        suppliers: [suppliers[4]._id],
        notes: 'Advanced threat protection',
        createdBy: users[0]._id
      },
      // Storage
      {
        assetName: 'Dell EMC Unity 550F - Storage Array',
        category: 'Storage',
        manufacturer: 'Dell EMC',
        model: 'Unity 550F',
        serialNumber: 'SN-2024-008-EMC550F',
        purchaseDate: new Date('2023-02-14'),
        condition: 'Good',
        status: 'Active',
        maintenanceTeam: [users[2]._id, users[3]._id, users[4]._id],
        suppliers: [suppliers[0]._id],
        notes: 'SAN storage with 200TB capacity',
        createdBy: users[0]._id
      },
      {
        assetName: 'NetApp AFF A300 - NAS Storage',
        category: 'Storage',
        manufacturer: 'NetApp',
        model: 'AFF A300',
        serialNumber: 'SN-2024-009-AFF300',
        purchaseDate: new Date('2023-05-22'),
        condition: 'Excellent',
        status: 'Active',
        maintenanceTeam: [users[2]._id],
        suppliers: [suppliers[2]._id],
        notes: 'All-flash NAS system',
        createdBy: users[0]._id
      },
      // UPS & Power
      {
        assetName: 'APC Smart-UPS SRT192XLBP - UPS',
        category: 'Power Management',
        manufacturer: 'APC by Schneider Electric',
        model: 'Smart-UPS SRT192XLBP',
        serialNumber: 'SN-2024-010-APCUPS',
        purchaseDate: new Date('2022-08-11'),
        condition: 'Good',
        status: 'Active',
        maintenanceTeam: [users[3]._id],
        suppliers: [suppliers[5]._id],
        notes: '192V UPS system for critical infrastructure',
        createdBy: users[0]._id
      },
      // Backup & Recovery
      {
        assetName: 'Commvault Data Platform - Backup Appliance',
        category: 'Backup & Recovery',
        manufacturer: 'Commvault',
        model: 'CommServe v14',
        serialNumber: 'SN-2024-011-COMMVAULT',
        purchaseDate: new Date('2023-07-19'),
        condition: 'Excellent',
        status: 'Active',
        maintenanceTeam: [users[4]._id],
        suppliers: [suppliers[5]._id],
        notes: 'Enterprise backup and recovery system',
        createdBy: users[0]._id
      }
    ]);
    console.log(`✅ Created ${equipment.length} equipment items\n`);

    // ==================== INVENTORY ====================
    const inventory = await Inventory.insertMany([
      // Server Components
      {
        itemName: 'Intel Xeon Platinum 8380 Processor',
        category: 'Parts',
        quantityOnHand: 8,
        minimumThreshold: 4,
        status: 'In Stock',
        costPerUnit: 8500,
        supplier: suppliers[0]._id,
        linkedEquipment: [equipment[0]._id, equipment[1]._id],
        lastRestockDate: new Date('2024-12-15'),
        notes: 'High-performance server CPU'
      },
      {
        itemName: 'RAM 32GB DDR4-3200 RDIMM',
        category: 'Parts',
        quantityOnHand: 24,
        minimumThreshold: 12,
        status: 'In Stock',
        costPerUnit: 3500,
        supplier: suppliers[0]._id,
        linkedEquipment: [equipment[0]._id, equipment[1]._id, equipment[2]._id],
        lastRestockDate: new Date('2024-12-10'),
        notes: 'Server memory modules'
      },
      {
        itemName: 'SSD 2.4TB SAS Enterprise',
        category: 'Parts',
        quantityOnHand: 15,
        minimumThreshold: 8,
        status: 'In Stock',
        costPerUnit: 25000,
        supplier: suppliers[0]._id,
        linkedEquipment: [equipment[0]._id, equipment[1]._id],
        lastRestockDate: new Date('2024-12-12'),
        notes: 'Enterprise-grade SSD drives'
      },
      // Network Components
      {
        itemName: 'Cisco QSFP-40G-SR4 Transceiver',
        category: 'Parts',
        quantityOnHand: 12,
        minimumThreshold: 6,
        status: 'In Stock',
        costPerUnit: 4200,
        supplier: suppliers[1]._id,
        linkedEquipment: [equipment[3]._id, equipment[4]._id],
        lastRestockDate: new Date('2024-12-14'),
        notes: 'Fiber optic transceivers'
      },
      {
        itemName: 'Cat6A Shielded Network Cable (100m)',
        category: 'Consumables',
        quantityOnHand: 5,
        minimumThreshold: 3,
        status: 'In Stock',
        costPerUnit: 12000,
        supplier: suppliers[5]._id,
        linkedEquipment: [equipment[3]._id],
        lastRestockDate: new Date('2024-12-13'),
        notes: 'Network cabling'
      },
      // Security Components
      {
        itemName: 'VPN License (1000 users/year)',
        category: 'Consumables',
        quantityOnHand: 2,
        minimumThreshold: 1,
        status: 'Low Stock',
        costPerUnit: 75000,
        supplier: suppliers[3]._id,
        linkedEquipment: [equipment[5]._id],
        lastRestockDate: new Date('2024-11-20'),
        notes: 'Fortinet VPN licensing'
      },
      {
        itemName: 'Threat Prevention License (1yr)',
        category: 'Consumables',
        quantityOnHand: 0,
        minimumThreshold: 1,
        status: 'Out of Stock',
        costPerUnit: 125000,
        supplier: suppliers[4]._id,
        linkedEquipment: [equipment[6]._id],
        lastRestockDate: new Date('2024-10-15'),
        notes: 'Palo Alto threat prevention update'
      },
      // Storage Consumables
      {
        itemName: 'Backup Tape LTO-9 (18TB)',
        category: 'Consumables',
        quantityOnHand: 45,
        minimumThreshold: 20,
        status: 'In Stock',
        costPerUnit: 8500,
        supplier: suppliers[5]._id,
        linkedEquipment: [equipment[7]._id],
        lastRestockDate: new Date('2024-12-18'),
        notes: 'Tape cartridges for backup'
      },
      {
        itemName: 'Power Distribution Unit (PDU) Cable',
        category: 'Parts',
        quantityOnHand: 8,
        minimumThreshold: 4,
        status: 'In Stock',
        costPerUnit: 6500,
        supplier: suppliers[5]._id,
        linkedEquipment: [equipment[9]._id],
        lastRestockDate: new Date('2024-12-16'),
        notes: 'PDU power cables'
      },
      // Tools & Utilities
      {
        itemName: 'Network Diagnostic Tool Kit',
        category: 'Tools',
        quantityOnHand: 3,
        minimumThreshold: 2,
        status: 'In Stock',
        costPerUnit: 45000,
        supplier: suppliers[1]._id,
        linkedEquipment: [equipment[3]._id, equipment[4]._id],
        lastRestockDate: new Date('2024-12-01'),
        notes: 'Professional network testing equipment'
      }
    ]);
    // Link inventory to suppliers
    for (let inv of inventory) {
      await Supplier.findByIdAndUpdate(inv.supplier, {
        $addToSet: { itemsSupplied: inv._id }
      });
    }
    console.log(`✅ Created ${inventory.length} inventory items\n`);

    // ==================== MAINTENANCE ACTIVITIES ====================
    const today = new Date();
    const past = (days) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    const future = (days) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const maintenance = await Maintenance.insertMany([
      // Recent & Scheduled Maintenance
      {
        equipment: equipment[0]._id,
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'High',
        status: 'In Progress',
        requestDate: past(3),
        scheduledDate: today,
        description: 'Quarterly server health check and firmware update',
        notes: 'Check CPU temperature, fan health, and apply latest patches',
        team: teams[0]._id,
        technician: users[2]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 15000
      },
      {
        equipment: equipment[3]._id,
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'Moderate',
        status: 'New',
        requestDate: past(1),
        scheduledDate: future(2),
        description: 'Network switch port inspection and cable verification',
        notes: 'Inspect all 48 ports for physical damage and verify connections',
        team: teams[1]._id,
        technician: users[5]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 8500
      },
      {
        equipment: equipment[5]._id,
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'High',
        status: 'New',
        requestDate: past(2),
        scheduledDate: future(1),
        description: 'Firewall security patches and threat definition updates',
        notes: 'Apply latest security patches and update threat database',
        team: teams[2]._id,
        technician: users[7]._id,
        company: 'TechCorp Solutions',
        createdBy: users[1]._id,
        cost: 12000
      },
      {
        equipment: equipment[7]._id,
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'Moderate',
        status: 'New',
        requestDate: past(5),
        scheduledDate: future(3),
        description: 'Storage array performance optimization and defragmentation',
        notes: 'Run performance analysis and optimize RAID configuration',
        team: teams[0]._id,
        technician: users[3]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 25000
      },
      // Corrective Maintenance
      {
        equipment: equipment[2]._id,
        maintenanceCategory: 'Equipment',
        type: 'Corrective',
        priority: 'High',
        status: 'In Progress',
        requestDate: past(7),
        scheduledDate: past(4),
        description: 'Server temperature anomaly - cooling system inspection required',
        notes: 'Thermal paste replacement and fan replacement may be needed',
        team: teams[0]._id,
        technician: users[4]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 18500
      },
      {
        equipment: equipment[6]._id,
        maintenanceCategory: 'Equipment',
        type: 'Corrective',
        priority: 'High',
        status: 'In Progress',
        requestDate: past(6),
        scheduledDate: past(3),
        description: 'Firewall connection drops - network interface module replacement',
        notes: 'Replace faulty network module and verify connectivity',
        team: teams[2]._id,
        technician: users[8]._id,
        company: 'TechCorp Solutions',
        createdBy: users[1]._id,
        cost: 22000
      },
      // Completed Maintenance
      {
        equipment: equipment[1]._id,
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'Moderate',
        status: 'Repaired',
        requestDate: past(30),
        scheduledDate: past(25),
        completionDate: past(23),
        description: 'Annual server maintenance and component replacement',
        notes: 'Replaced cooling fans, updated BIOS, and verified all components',
        team: teams[0]._id,
        technician: users[2]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 28000
      },
      {
        equipment: equipment[4]._id,
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'Low',
        status: 'Repaired',
        requestDate: past(45),
        scheduledDate: past(42),
        completionDate: past(40),
        description: 'Network switch software upgrade and configuration backup',
        notes: 'Upgraded switch OS and validated all configurations',
        team: teams[1]._id,
        technician: users[6]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 12500
      },
      {
        equipment: equipment[8]._id,
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'Moderate',
        status: 'Repaired',
        requestDate: past(60),
        scheduledDate: past(55),
        completionDate: past(53),
        description: 'NAS storage system performance tuning',
        notes: 'Optimized RAID groups and updated firmware',
        team: teams[0]._id,
        technician: users[3]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 16500
      },
      {
        equipment: equipment[9]._id,
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'High',
        status: 'Repaired',
        requestDate: past(14),
        scheduledDate: past(11),
        completionDate: past(10),
        description: 'UPS battery health test and replacement',
        notes: 'Completed battery runtime test, all batteries performing well',
        team: teams[0]._id,
        technician: users[3]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 35000
      },
      // Workspace Maintenance
      {
        workspace: 'Data Center - Room A',
        maintenanceCategory: 'Workspace',
        type: 'Preventive',
        priority: 'Moderate',
        status: 'New',
        requestDate: past(4),
        scheduledDate: future(4),
        description: 'Data center cooling system inspection and filter replacement',
        notes: 'Check CRAC unit filters and clean vents',
        team: teams[0]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 9500
      },
      {
        workspace: 'Network Server Room - Level 3',
        maintenanceCategory: 'Workspace',
        type: 'Preventive',
        priority: 'Moderate',
        status: 'New',
        requestDate: past(2),
        scheduledDate: future(5),
        description: 'Server room cable management and safety inspection',
        notes: 'Reorganize cables and verify emergency shutdown systems',
        team: teams[1]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 7500
      },
      {
        workspace: 'Office - IT Department Area',
        maintenanceCategory: 'Workspace',
        type: 'Preventive',
        priority: 'Low',
        status: 'Repaired',
        requestDate: past(21),
        scheduledDate: past(18),
        completionDate: past(16),
        description: 'Office electrical outlet inspection and safety check',
        notes: 'Tested all outlets and updated safety documentation',
        team: teams[2]._id,
        company: 'TechCorp Solutions',
        createdBy: users[0]._id,
        cost: 5000
      }
    ]);
    console.log(`✅ Created ${maintenance.length} maintenance activities\n`);

    // ==================== SUMMARY ====================
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🎉 IT COMPANY SEED DATA SUCCESSFULLY CREATED!');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('📊 DATA SUMMARY:');
    console.log(`   👥 Users: ${users.length} (2 Admins, 7 Technicians, 2 Viewers)`);
    console.log(`   👨‍💼 Teams: ${teams.length} (Infrastructure, Network, Security, On-site Support)`);
    console.log(`   🏢 Suppliers: ${suppliers.length} (Dell, Cisco, HPE, Fortinet, Palo Alto, TechSupply)`);
    console.log(`   💻 Equipment: ${equipment.length} (Servers, Network, Security, Storage, Power, Backup)`);
    console.log(`   📦 Inventory: ${inventory.length} (Components, Consumables, Tools)`);
    console.log(`   🔧 Maintenance: ${maintenance.length} (Preventive & Corrective)\n`);

    console.log('🔐 TEST LOGIN CREDENTIALS:');
    console.log('   Email: rajesh.kumar@techcorp.com');
    console.log('   Password: TechCorp@2024\n');
    console.log('   OR\n');
    console.log('   Email: amit.patel@techcorp.com');
    console.log('   Password: TechCorp@2024\n');

    console.log('✨ All data is ready for dashboard testing!');
    console.log('═══════════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedITCompanyData();
