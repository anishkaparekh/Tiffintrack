import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Override default DNS servers in Node.js to resolve SRV records on Windows/local environments reliably
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {
  console.warn('Warning: Could not set custom DNS servers:', error);
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tiffintrackadmin:tiffintrack06@tiffintrack-cluster.o3unx2a.mongodb.net/tiffintrack?appName=tiffintrack-cluster';

// Import models and service
import { User } from './src/models/User';
import { Plan } from './src/models/Plan';
import { Subscription } from './src/models/Subscription';
import { Delivery } from './src/models/Delivery';
import { generateDeliveriesFromSubscription } from './src/services/delivery.service';

async function runTests() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to database.');

  // Clean up any stale test records from prior runs
  await User.deleteMany({ email: /test-.*-delivery@example\.com/ });
  
  console.log('Seeding mock users...');
  const customer = await User.create({
    name: 'Test Customer Partner',
    email: 'test-customer-delivery@example.com',
    password: 'password123',
    role: 'customer'
  });

  const vendor = await User.create({
    name: 'Test Vendor Partner',
    email: 'test-vendor-delivery@example.com',
    password: 'password123',
    role: 'vendor',
    businessName: 'Happy Home Test Kitchen',
    kitchenAddress: '123 Test Street, Anand',
    city: 'Anand',
    verificationStatus: 'approved'
  });

  console.log('Seeding mock plans...');
  const weeklyPlan = await Plan.create({
    vendorId: vendor._id,
    planName: 'Lunch Only Plan - 7 Days',
    duration: 'weekly',
    mealsPerDay: 1,
    price: 700,
    isActive: true,
    description: 'Wholesome weekly lunch box'
  });

  const monthlyPlan = await Plan.create({
    vendorId: vendor._id,
    planName: 'Lunch + Dinner plan - 30 Days',
    duration: 'monthly',
    mealsPerDay: 2,
    price: 5400,
    isActive: true,
    description: 'Wholesome monthly double meal plan'
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setDate(nextMonth.getDate() + 30);

  console.log('Creating subscriptions...');
  // Subscription 1: Weekly Lunch Only (7 days)
  const sub1 = await Subscription.create({
    customerId: customer._id,
    vendorId: vendor._id,
    planId: weeklyPlan._id,
    vendorName: vendor.businessName,
    planName: weeklyPlan.planName,
    status: 'Active',
    startDate: today,
    endDate: nextWeek,
    mealsRemaining: 7,
    deliveryAddress: 'Flat 101, Test Residency',
  });

  // Subscription 2: Monthly Lunch + Dinner (30 days)
  const sub2 = await Subscription.create({
    customerId: customer._id,
    vendorId: vendor._id,
    planId: monthlyPlan._id,
    vendorName: vendor.businessName,
    planName: monthlyPlan.planName,
    status: 'Active',
    startDate: today,
    endDate: nextMonth,
    mealsRemaining: 60,
    deliveryAddress: 'Flat 101, Test Residency',
  });

  console.log('Triggering Delivery Engine Service simulations...');

  // Test Case 1: Weekly single meal
  console.log('Running Test Case 1: 7-day single-meal subscription...');
  const deliveries1 = await generateDeliveriesFromSubscription(sub1._id);
  console.log(`Test Case 1 Result: Generated ${deliveries1.length} delivery records.`);
  if (deliveries1.length !== 7) {
    throw new Error(`Test Case 1 Failed: Expected 7 deliveries, got ${deliveries1.length}`);
  }

  // Test Case 2: Monthly double meal (Lunch + Dinner)
  console.log('Running Test Case 2: 30-day double-meal subscription...');
  const deliveries2 = await generateDeliveriesFromSubscription(sub2._id);
  console.log(`Test Case 2 Result: Generated ${deliveries2.length} delivery records.`);
  if (deliveries2.length !== 60) {
    throw new Error(`Test Case 2 Failed: Expected 60 deliveries, got ${deliveries2.length}`);
  }

  // Test Case 3: Idempotency / Duplicate Prevention check
  console.log('Running Test Case 3: Idempotency verification...');
  const deliveriesDuplicate = await generateDeliveriesFromSubscription(sub2._id);
  console.log(`Test Case 3 Result: Got ${deliveriesDuplicate.length} delivery records on duplicate call.`);
  const currentTotal = await Delivery.countDocuments({ subscriptionId: sub2._id });
  if (currentTotal !== 60) {
    throw new Error(`Test Case 3 Failed: Idempotency check failed, deliveries count grew to ${currentTotal}`);
  }
  console.log('Test Case 3 Passed: Successfully prevented duplicate delivery records.');

  // Clean up created records
  console.log('Cleaning up test data...');
  await Delivery.deleteMany({ subscriptionId: { $in: [sub1._id, sub2._id] } });
  await Subscription.deleteMany({ _id: { $in: [sub1._id, sub2._id] } });
  await Plan.deleteMany({ _id: { $in: [weeklyPlan._id, monthlyPlan._id] } });
  await User.deleteMany({ _id: { $in: [customer._id, vendor._id] } });

  console.log('ALL TESTS PASSED SUCCESSFULLY! ✅');
  await mongoose.disconnect();
}

runTests().catch(err => {
  console.error('Test script failed with error:', err);
  mongoose.disconnect();
  process.exit(1);
});
