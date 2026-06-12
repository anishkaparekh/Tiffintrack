$baseUrl = "http://localhost:5000"

Write-Host "=================== PHASE 5: SUBSCRIPTION SYSTEM FLOW VERIFICATION ==================="

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
$vendorEmail = "phase5-vendor-$randomId@example.com"
$vendorPassword = "VendorPassword123!"

Write-Host "`n[POST /api/v1/auth/register] - Registering a test vendor ($vendorEmail)..."
$registerBody = @{
  name = "Chef Phase Five ($randomId)"
  email = $vendorEmail
  password = $vendorPassword
  role = "vendor"
  phone = "9876543210"
  businessName = "Phase 5 Royal Kitchen $randomId"
  kitchenAddress = "101 Phase 5 Street"
  city = "Anand"
  description = "A wonderful test kitchen for Phase 5 verification."
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

# 5. Authenticate vendor to add a plan
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

# 6. Add a test plan for this vendor
Write-Host "`n[POST /api/v1/plans] - Adding a test plan..."
$planBody = @{
  planName = "Premium Veg Lunch Plan"
  duration = "monthly"
  mealsPerDay = 1
  price = 3500
  description = "Delicious homestyle veg lunch delivered daily."
} | ConvertTo-Json

try {
  $planRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/plans" -Method Post -Headers $vendorHeaders -Body $planBody -ContentType "application/json" -ErrorAction Stop
  $planId = $planRes.data._id
  Write-Host "Plan added: $($planRes.data.planName) (ID: $planId)"
} catch {
  Write-Error "Failed to add plan: $_"
  exit
}

# 7. Register a new Customer dynamically
$customerEmail = "phase5-customer-$randomId@example.com"
$customerPassword = "CustomerPassword123!"

Write-Host "`n[POST /api/v1/auth/register] - Registering a test customer ($customerEmail)..."
$customerRegisterBody = @{
  name = "Customer Phase Five ($randomId)"
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

# 8. Create a subscription (Checkout simulation)
Write-Host "`n[POST /api/v1/subscriptions] - Creating a subscription (Simulated Checkout)..."
$subscriptionBody = @{
  customerId = $customerId
  vendorId = $vendorId
  planId = $planId
  startDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  deliveryAddress = "Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar - 388120"
  preferences = @("Veg", "Low Oil")
} | ConvertTo-Json

try {
  $subRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/subscriptions" -Method Post -Body $subscriptionBody -ContentType "application/json" -ErrorAction Stop
  $subscriptionId = $subRes.data._id
  Write-Host "Subscription Created SUCCESS. ID: $subscriptionId"
  Write-Host "Status: $($subRes.data.status)"
  Write-Host "Meals Remaining: $($subRes.data.mealsRemaining)"
  Write-Host "End Date: $($subRes.data.endDate)"
} catch {
  Write-Error "Subscription creation failed: $_"
  exit
}

# 9. Fetch customer subscriptions to verify MongoDB record
Write-Host "`n[GET /api/v1/subscriptions/customer/$customerId] - Fetching customer subscriptions..."
try {
  $custSubs = Invoke-RestMethod -Uri "$baseUrl/api/v1/subscriptions/customer/$customerId" -Method Get -ErrorAction Stop
  Write-Host "Total Customer Subscriptions: $($custSubs.count)"
  if ($custSubs.count -eq 0) {
    Write-Error "Expected at least 1 subscription for customer but got 0"
    exit
  }
  $firstSub = $custSubs.data[0]
  Write-Host "Found Sub: $($firstSub.planName) from chef '$($firstSub.vendorName)'"
} catch {
  Write-Error "Failed to fetch customer subscriptions: $_"
  exit
}

# 10. Pause Subscription
Write-Host "`n[PUT /api/v1/subscriptions/$subscriptionId] - Pausing subscription..."
$pauseBody = @{ status = "Paused" } | ConvertTo-Json
try {
  $pauseRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/subscriptions/$subscriptionId" -Method Put -Body $pauseBody -ContentType "application/json" -ErrorAction Stop
  Write-Host "Pause Response status: $($pauseRes.data.status)"
  if ($pauseRes.data.status -ne "Paused") {
    Write-Error "Expected subscription status to be Paused but got $($pauseRes.data.status)"
    exit
  }
} catch {
  Write-Error "Failed to pause subscription: $_"
  exit
}

# 11. Resume Subscription
Write-Host "`n[PUT /api/v1/subscriptions/$subscriptionId] - Resuming subscription..."
$resumeBody = @{ status = "Active" } | ConvertTo-Json
try {
  $resumeRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/subscriptions/$subscriptionId" -Method Put -Body $resumeBody -ContentType "application/json" -ErrorAction Stop
  Write-Host "Resume Response status: $($resumeRes.data.status)"
  if ($resumeRes.data.status -ne "Active") {
    Write-Error "Expected subscription status to be Active but got $($resumeRes.data.status)"
    exit
  }
} catch {
  Write-Error "Failed to resume subscription: $_"
  exit
}

# 12. Fetch vendor subscriptions to verify
Write-Host "`n[GET /api/v1/subscriptions/vendor/$vendorId] - Fetching vendor subscriptions..."
try {
  $vendSubs = Invoke-RestMethod -Uri "$baseUrl/api/v1/subscriptions/vendor/$vendorId" -Method Get -ErrorAction Stop
  Write-Host "Total Vendor Subscriptions: $($vendSubs.count)"
  if ($vendSubs.count -eq 0) {
    Write-Error "Expected at least 1 subscription for vendor but got 0"
    exit
  }
  Write-Host "Subscribed Customer Name: $($vendSubs.data[0].customerId.name)"
} catch {
  Write-Error "Failed to fetch vendor subscriptions: $_"
  exit
}

# 13. Fetch active subscriptions count for Admin Dashboard
Write-Host "`n[GET /api/v1/subscriptions/count/active] - Fetching active subscription count..."
try {
  $activeCountRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/subscriptions/count/active" -Method Get -ErrorAction Stop
  Write-Host "Active Subscription Count: $($activeCountRes.count)"
} catch {
  Write-Error "Failed to fetch active subscription count: $_"
  exit
}

Write-Host "`n=================== ALL E2E SUBSCRIPTION FLOW API TESTS PASSED! ==================="
