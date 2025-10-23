// Test script to check storage import locally
console.log('Testing storage import...');

async function testStorageImport() {
  try {
    console.log('Attempting to import storage...');
    const { storage } = await import('./lib/storage-cloud.ts');
    console.log('✅ Storage import successful!');
    console.log('Storage type:', typeof storage);
    console.log('Storage constructor:', storage.constructor.name);
    
    // Test basic storage methods
    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(storage)));
    
  } catch (error) {
    console.log('❌ Storage import failed!');
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

testStorageImport();