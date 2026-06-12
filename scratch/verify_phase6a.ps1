$baseUrl = "http://localhost:5000"

Write-Host "=================== PHASE 6A: ORDER SYSTEM FOUNDATION VERIFICATION ==================="

# 1. Login as Administrator to get Admin Auth JWT
Write-Host "`n[POST /api/auth/login] - Authenticating admin user..."
$adminLoginBody = @{
  email = "admin@tiffintrack.com"
  password = "Admin@123"
} | ConvertTo-Json

try {
  $adminLoginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json" -ErrorAction Stop
  $adminToken = $adminLoginRes.data.token
  Write-Host "Admin Authentication SUCCESS. Token retrieved."
} catch {
  Write-Error "Admin login failed: $_"
  exit
}

$adminHeaders = @{
  Authorization = "Bearer $adminToken"
}

# 2. Register a new Vendor dynamically
$randomId = Get-Random
$vendorEmail = "phase6a-vendor-$randomId@example.com"
$vendorPassword = "VendorPassword123!"

Write-Host "`n[POST /api/v1/auth/register] - Registering a test vendor ($vendorEmail)..."
$registerBody = @{
  name = "Chef Phase 6A ($randomId)"
  email = $vendorEmail
  password = $vendorPassword
  role = "vendor"
  phone = "9876543210"
  businessName = "Phase 6A Royal Kitchen $randomId"
  kitchenAddress = "101 Phase 6A Street"
  city = "Anand"
  description = "A wonderful test kitchen for Phase 6A verification."
} | ConvertTo-Json

try {
  $regRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction Stop
  Write-Host "Vendor Registration SUCCESS."
} catch {
  Write-Error "Vendor registration failed: $_"
  exit
}

# 3. Fetch all vendors as Admin to find the ID
Write-Host "`n[GET /api/v1/vendors/all] - Listing all registered vendors as Admin..."
try {
  $vendorsRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/vendors/all" -Method Get -Headers $adminHeaders -ErrorAction Stop
  
  # Find our newly registered vendor
  $targetVendor = $vendorsRes.data | Where-Object { $_.email -eq $vendorEmail }
  
  if ($null -eq $targetVendor) {
    Write-Error "Could not find the registered vendor in the list."
    exit
  }
  
  $vendorId = $targetVendor._id
  Write-Host "Found Vendor ID: $vendorId"
  Write-Host "Initial Verification Status: $($targetVendor.verificationStatus)"
} catch {
  Write-Error "Failed to fetch vendors list: $_"
  exit
}

# 4. Approve Vendor
Write-Host "`n[PATCH /api/v1/vendors/$vendorId/verify] - Approving vendor..."
$bodyApprove = @{ status = "approved" } | ConvertTo-Json
try {
  $resUpdate2 = Invoke-RestMethod -Uri "$baseUrl/api/v1/vendors/$vendorId/verify" -Method Patch -Headers $adminHeaders -Body $bodyApprove -ContentType "application/json" -ErrorAction Stop
  Write-Host "Response message: $($resUpdate2.message)"
} catch {
  Write-Error "Failed approving vendor: $_"
  exit
}

# 5. Authenticate vendor to add a meal
Write-Host "`nAuthenticating vendor..."
$vendorLoginBody = @{
  email = $vendorEmail
  password = $vendorPassword
} | ConvertTo-Json

try {
  $vendorLoginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $vendorLoginBody -ContentType "application/json" -ErrorAction Stop
  $vendorToken = $vendorLoginRes.data.token
} catch {
  Write-Error "Vendor login failed: $_"
  exit
}

$vendorHeaders = @{
  Authorization = "Bearer $vendorToken"
}

# 6. Add a test meal for this vendor
Write-Host "`n[POST /api/v1/meals] - Adding a test meal..."
$mealBody = @{
  mealName = "Special Veg Thali 6A"
  description = "A complete traditional thali for Phase 6A."
  price = 150
  mealType = "Veg"
  availability = $true
} | ConvertTo-Json

try {
  $mealRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/meals" -Method Post -Headers $vendorHeaders -Body $mealBody -ContentType "application/json" -ErrorAction Stop
  $mealId = $mealRes.data._id
  Write-Host "Meal added: $($mealRes.data.mealName) (ID: $mealId)"
} catch {
  Write-Error "Failed to add meal: $_"
  exit
}

# 7. Register a new Customer dynamically
$customerEmail = "phase6a-customer-$randomId@example.com"
$customerPassword = "CustomerPassword123!"

Write-Host "`n[POST /api/v1/auth/register] - Registering a test customer ($customerEmail)..."
$customerRegisterBody = @{
  name = "Customer Phase 6A ($randomId)"
  email = $customerEmail
  password = $customerPassword
  role = "customer"
  phone = "9876543211"
  city = "Anand"
} | ConvertTo-Json

try {
  $custRegRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" -Method Post -Body $customerRegisterBody -ContentType "application/json" -ErrorAction Stop
  $customerId = $custRegRes.data.user.id
  Write-Host "Customer Registered SUCCESS. ID: $customerId"
} catch {
  Write-Error "Customer registration failed: $_"
  exit
}

# 8. Create an order (MongoDB persistence test)
Write-Host "`n[POST /api/v1/orders] - Creating a test order..."
$orderBody = @{
  customerId = $customerId
  vendorId = $vendorId
  mealId = $mealId
  deliveryDate = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  mealType = "Veg"
  notes = "Extra spicy, low oil"
} | ConvertTo-Json

try {
  $orderRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders" -Method Post -Body $orderBody -ContentType "application/json" -ErrorAction Stop
  $orderId = $orderRes.data._id
  Write-Host "Order Created SUCCESS. ID: $orderId"
  Write-Host "Status: $($orderRes.data.status)"
  Write-Host "Notes: $($orderRes.data.notes)"
} catch {
  Write-Error "Order creation failed: $_"
  exit
}

# 9. Fetch specific order by ID
Write-Host "`n[GET /api/v1/orders/$orderId] - Fetching specific order by ID..."
try {
  $fetchedOrder = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders/$orderId" -Method Get -ErrorAction Stop
  Write-Host "Successfully fetched order. ID: $($fetchedOrder.data._id)"
  Write-Host "Customer Name (Populated): $($fetchedOrder.data.customerId.name)"
  Write-Host "Vendor Business Name (Populated): $($fetchedOrder.data.vendorId.businessName)"
  Write-Host "Meal Name (Populated): $($fetchedOrder.data.mealId.mealName)"
} catch {
  Write-Error "Failed to fetch specific order: $_"
  exit
}

# 10. Fetch orders by customer
Write-Host "`n[GET /api/v1/orders/customer/$customerId] - Fetching orders by customer..."
try {
  $custOrders = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders/customer/$customerId" -Method Get -ErrorAction Stop
  Write-Host "Total Customer Orders: $($custOrders.count)"
  if ($custOrders.count -eq 0) {
    Write-Error "Expected at least 1 order for customer but got 0"
    exit
  }
} catch {
  Write-Error "Failed to fetch customer orders: $_"
  exit
}

# 11. Fetch orders by vendor
Write-Host "`n[GET /api/v1/orders/vendor/$vendorId] - Fetching orders by vendor..."
try {
  $vendOrders = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders/vendor/$vendorId" -Method Get -ErrorAction Stop
  Write-Host "Total Vendor Orders: $($vendOrders.count)"
  if ($vendOrders.count -eq 0) {
    Write-Error "Expected at least 1 order for vendor but got 0"
    exit
  }
} catch {
  Write-Error "Failed to fetch vendor orders: $_"
  exit
}

# 12. Update order status to Preparing
Write-Host "`n[PUT /api/v1/orders/$orderId] - Updating order status to 'Preparing'..."
$updateBody1 = @{ status = "Preparing" } | ConvertTo-Json
try {
  $updateRes1 = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders/$orderId" -Method Put -Body $updateBody1 -ContentType "application/json" -ErrorAction Stop
  Write-Host "Updated Status: $($updateRes1.data.status)"
  if ($updateRes1.data.status -ne "Preparing") {
    Write-Error "Expected status to be Preparing but got $($updateRes1.data.status)"
    exit
  }
} catch {
  Write-Error "Failed to update order to Preparing: $_"
  exit
}

# 13. Update order status to Delivered
Write-Host "`n[PUT /api/v1/orders/$orderId] - Updating order status to 'Delivered'..."
$updateBody2 = @{ status = "Delivered" } | ConvertTo-Json
try {
  $updateRes2 = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders/$orderId" -Method Put -Body $updateBody2 -ContentType "application/json" -ErrorAction Stop
  Write-Host "Updated Status: $($updateRes2.data.status)"
  if ($updateRes2.data.status -ne "Delivered") {
    Write-Error "Expected status to be Delivered but got $($updateRes2.data.status)"
    exit
  }
} catch {
  Write-Error "Failed to update order to Delivered: $_"
  exit
}

# 14. Delete order
Write-Host "`n[DELETE /api/v1/orders/$orderId] - Deleting test order..."
try {
  $deleteRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders/$orderId" -Method Delete -ErrorAction Stop
  Write-Host "Response message: $($deleteRes.message)"
} catch {
  Write-Error "Failed to delete order: $_"
  exit
}

# 15. Verify order deletion (Fetch should return 404)
Write-Host "`nVerifying order deletion (expecting 404 error)..."
try {
  $verifyFetch = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders/$orderId" -Method Get -ErrorAction Stop
  Write-Error "Expected fetch to fail after deletion but it succeeded!"
  exit
} catch {
  if ($_.Exception.Response.StatusCode -eq "NotFound") {
    Write-Host "Correct. Fetch returned 404 Not Found as expected after deletion."
  } else {
    Write-Error "Unexpected error during deletion verify: $_"
    exit
  }
}

Write-Host "`n=================== ALL E2E ORDER SYSTEM API TESTS PASSED! ==================="
