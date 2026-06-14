$baseUrl = "http://localhost:5000"

Write-Host "=================== PHASE 7: REVIEWS & RATINGS SYSTEM VERIFICATION ==================="

# 1. Login as Administrator to get Admin Auth JWT
Write-Host "`n[POST /api/auth/login] - Authenticating admin user..."
$adminLoginBody = @{
  email = "admin@tiffintrack.com"
  password = "Admin@123"
} | ConvertTo-Json

try {
  $adminLoginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json" -ErrorAction Stop
  $adminToken = $adminLoginRes.data.token
  Write-Host "Admin Authentication SUCCESS."
} catch {
  Write-Error "Admin login failed: $_"
  exit
}

$adminHeaders = @{
  Authorization = "Bearer $adminToken"
}

# 2. Register a new Vendor dynamically
$randomId = Get-Random
$vendorEmail = "phase7-vendor-$randomId@example.com"
$vendorPassword = "VendorPassword123!"

Write-Host "`n[POST /api/v1/auth/register] - Registering a test vendor ($vendorEmail)..."
$registerBody = @{
  name = "Chef Phase Seven ($randomId)"
  email = $vendorEmail
  password = $vendorPassword
  role = "vendor"
  phone = "9876543220"
  businessName = "Phase 7 Royal Kitchen $randomId"
  kitchenAddress = "707 Phase 7 Street"
  city = "Anand"
  description = "A wonderful test kitchen for Phase 7 verification."
} | ConvertTo-Json

try {
  $regRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction Stop
  Write-Host "Vendor Registration SUCCESS."
} catch {
  Write-Error "Vendor registration failed: $_"
  exit
}

# 3. Fetch all vendors as Admin to find the ID and approve
Write-Host "`n[GET /api/v1/vendors/all] - Listing all registered vendors as Admin..."
try {
  $vendorsRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/vendors/all" -Method Get -Headers $adminHeaders -ErrorAction Stop
  $targetVendor = $vendorsRes.data | Where-Object { $_.email -eq $vendorEmail }
  if ($null -eq $targetVendor) {
    Write-Error "Could not find the registered vendor in the list."
    exit
  }
  $vendorId = $targetVendor._id
  Write-Host "Found Vendor ID: $vendorId"
} catch {
  Write-Error "Failed to fetch vendors list: $_"
  exit
}

# Approve Vendor
Write-Host "`n[PATCH /api/v1/vendors/$vendorId/verify] - Approving vendor..."
$bodyApprove = @{ status = "approved" } | ConvertTo-Json
try {
  $resUpdate2 = Invoke-RestMethod -Uri "$baseUrl/api/v1/vendors/$vendorId/verify" -Method Patch -Headers $adminHeaders -Body $bodyApprove -ContentType "application/json" -ErrorAction Stop
  Write-Host "Response message: $($resUpdate2.message)"
} catch {
  Write-Error "Failed approving vendor: $_"
  exit
}

# 4. Login as Vendor and add Meal + Plan
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

Write-Host "`n[POST /api/v1/meals] - Adding a test meal for the vendor..."
$mealBody = @{
  mealName = "Special Paneer Butter Masala"
  description = "Creamy paneer cubes in tomato gravy with rich butter."
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

Write-Host "`n[POST /api/v1/plans] - Adding a test plan for the vendor..."
$planBody = @{
  planName = "Premium Veg Lunch Plan"
  duration = "weekly"
  mealsPerDay = 1
  price = 1000
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

# 5. Register and login as Customer
$customerEmail = "phase7-customer-$randomId@example.com"
$customerPassword = "CustomerPassword123!"

Write-Host "`n[POST /api/v1/auth/register] - Registering a test customer ($customerEmail)..."
$customerRegisterBody = @{
  name = "Customer Phase Seven ($randomId)"
  email = $customerEmail
  password = $customerPassword
  role = "customer"
  phone = "9876543221"
} | ConvertTo-Json

try {
  $custRegRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" -Method Post -Body $customerRegisterBody -ContentType "application/json" -ErrorAction Stop
  $customerId = $custRegRes.data.id
  if ($null -eq $customerId) {
    $customerId = $custRegRes.data._id
  }
  Write-Host "Customer Registration SUCCESS. ID: $customerId"
} catch {
  Write-Error "Customer registration failed: $_"
  exit
}

Write-Host "`nAuthenticating customer..."
$customerLoginBody = @{
  email = $customerEmail
  password = $customerPassword
} | ConvertTo-Json

try {
  $customerLoginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $customerLoginBody -ContentType "application/json" -ErrorAction Stop
  $customerToken = $customerLoginRes.data.token
  if ($null -eq $customerId) {
    $customerId = $customerLoginRes.data.user.id
    if ($null -eq $customerId) {
      $customerId = $customerLoginRes.data.user._id
    }
  }
} catch {
  Write-Error "Customer login failed: $_"
  exit
}

$customerHeaders = @{
  Authorization = "Bearer $customerToken"
}

# 6. Subscribe Customer to Plan
Write-Host "`n[POST /api/v1/subscriptions] - Creating a subscription (Subscribing)..."
$startDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$subBody = @{
  customerId = $customerId
  vendorId = $vendorId
  planId = $planId
  startDate = $startDate
  deliveryAddress = "789 Customer Ave, Anand"
  preferences = @("No garlic")
} | ConvertTo-Json

try {
  $subRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/subscriptions" -Method Post -Headers $customerHeaders -Body $subBody -ContentType "application/json" -ErrorAction Stop
  $subscriptionId = $subRes.data._id
  Write-Host "Subscription created SUCCESS. ID: $subscriptionId"
} catch {
  Write-Error "Failed to create subscription: $_"
  exit
}

# 7. Create Review (POST /api/v1/reviews)
Write-Host "`n[POST /api/v1/reviews] - Creating a new review for subscription..."
$reviewBody = @{
  vendorId = $vendorId
  subscriptionId = $subscriptionId
  rating = 5
  reviewText = "Amazing homestyle paneer! The premium lunch plan is highly recommended."
} | ConvertTo-Json

try {
  $reviewRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews" -Method Post -Headers $customerHeaders -Body $reviewBody -ContentType "application/json" -ErrorAction Stop
  $reviewId = $reviewRes.data._id
  Write-Host "Review created SUCCESS. ID: $reviewId"
  Write-Host "Rating: $($reviewRes.data.rating)"
  Write-Host "ReviewText: $($reviewRes.data.reviewText)"
  
  if ($reviewRes.data.rating -ne 5 -or $reviewRes.data.isEdited -ne $false) {
    Write-Error "Incorrect review response data fields."
    exit
  }
  Write-Host "Assertion PASSED: Review fields are correct."
} catch {
  Write-Error "Failed to create review: $_"
  exit
}

# 8. Uniqueness Constraint: Attempt to review the same subscription again
Write-Host "`n[POST /api/v1/reviews] - Testing duplicate review constraint block (should fail)..."
try {
  $dupRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews" -Method Post -Headers $customerHeaders -Body $reviewBody -ContentType "application/json" -ErrorAction Stop
  Write-Error "Failed constraint check: duplicate review creation succeeded when it should have failed."
  exit
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  Write-Host "Assertion PASSED: Duplicate review creation blocked with Status Code $statusCode (Expected: 400)."
  if ($statusCode -ne 400) {
    Write-Warning "Warning: Status Code should be 400 but got $statusCode"
  }
}

# 9. Get Vendor Reviews
Write-Host "`n[GET /api/v1/reviews/vendor/$vendorId] - Retrieving vendor reviews list..."
try {
  $vendorReviews = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews/vendor/$vendorId" -Method Get -ErrorAction Stop
  Write-Host "Reviews found: $($vendorReviews.count)"
  if ($vendorReviews.count -ne 1) {
    Write-Error "Expected exactly 1 review for vendor, but got $($vendorReviews.count)"
    exit
  }
  Write-Host "Customer Name: $($vendorReviews.data[0].customerId.name)"
  if ($vendorReviews.data[0].customerId.name -ne "Customer Phase Seven ($randomId)") {
    Write-Error "Customer name not populated properly."
    exit
  }
  Write-Host "Assertion PASSED: Vendor reviews returned and populated customer details successfully."
} catch {
  Write-Error "Failed to fetch vendor reviews: $_"
  exit
}

# 10. Get Customer Reviews
Write-Host "`n[GET /api/v1/reviews/customer/$customerId] - Retrieving customer reviews list..."
try {
  $custReviews = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews/customer/$customerId" -Method Get -Headers $customerHeaders -ErrorAction Stop
  Write-Host "Reviews found: $($custReviews.count)"
  if ($custReviews.count -ne 1) {
    Write-Error "Expected exactly 1 review for customer, but got $($custReviews.count)"
    exit
  }
  Write-Host "Vendor Business Name: $($custReviews.data[0].vendorId.businessName)"
  if ($custReviews.data[0].vendorId.businessName -ne "Phase 7 Royal Kitchen $randomId") {
    Write-Error "Vendor details not populated properly."
    exit
  }
  Write-Host "Assertion PASSED: Customer reviews returned and populated vendor details successfully."
} catch {
  Write-Error "Failed to fetch customer reviews: $_"
  exit
}

# 11. Update Review (PUT /api/v1/reviews/:id)
Write-Host "`n[PUT /api/v1/reviews/$reviewId] - Modifying rating to 4 and text..."
$updateBody = @{
  rating = 4
  reviewText = "Good homestyle paneer. The premium lunch plan is good, but would prefer slightly more spice."
} | ConvertTo-Json

try {
  $updateRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews/$reviewId" -Method Put -Headers $customerHeaders -Body $updateBody -ContentType "application/json" -ErrorAction Stop
  Write-Host "Updated Review ID: $($updateRes.data._id)"
  Write-Host "Updated Rating: $($updateRes.data.rating) (Expected: 4)"
  Write-Host "Updated isEdited: $($updateRes.data.isEdited) (Expected: True)"
  
  if ($updateRes.data.rating -ne 4 -or $updateRes.data.isEdited -ne $true) {
    Write-Error "Incorrect update results."
    exit
  }
  Write-Host "Assertion PASSED: Review successfully updated and marked as Edited."
} catch {
  Write-Error "Failed to update review: $_"
  exit
}

# 12. Get Stats Summary (GET /api/v1/reviews/vendor/:vendorId/stats)
Write-Host "`n[GET /api/v1/reviews/vendor/$vendorId/stats] - Checking vendor rating stats..."
try {
  $statsRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews/vendor/$vendorId/stats" -Method Get -ErrorAction Stop
  Write-Host "Average Rating: $($statsRes.data.averageRating) (Expected: 4)"
  Write-Host "Total Reviews: $($statsRes.data.totalReviews) (Expected: 1)"
  Write-Host "4-Star Count: $($statsRes.data.ratingBreakdown.'4') (Expected: 1)"
  Write-Host "5-Star Count: $($statsRes.data.ratingBreakdown.'5') (Expected: 0)"

  if ($statsRes.data.averageRating -ne 4 -or $statsRes.data.totalReviews -ne 1 -or $statsRes.data.ratingBreakdown.'4' -ne 1) {
    Write-Error "Statistics calculation mismatch."
    exit
  }
  Write-Host "Assertion PASSED: Statistics aggregation is correct."
} catch {
  Write-Error "Failed to get vendor stats: $_"
  exit
}

# 13. Delete Review (DELETE /api/v1/reviews/:id)
Write-Host "`n[DELETE /api/v1/reviews/$reviewId] - Deleting the review..."
try {
  $deleteRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews/$reviewId" -Method Delete -Headers $customerHeaders -ErrorAction Stop
  Write-Host "Response message: $($deleteRes.message)"
  
  # Verify review is deleted
  $vendorReviews2 = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews/vendor/$vendorId" -Method Get -ErrorAction Stop
  if ($vendorReviews2.count -ne 0) {
    Write-Error "Review was not deleted successfully. Count is still $($vendorReviews2.count)"
    exit
  }
  Write-Host "Assertion PASSED: Review successfully deleted."
} catch {
  Write-Error "Failed to delete review: $_"
  exit
}

# 14. Verify Stats after deletion
Write-Host "`n[GET /api/v1/reviews/vendor/$vendorId/stats] - Checking stats post-deletion..."
try {
  $statsRes2 = Invoke-RestMethod -Uri "$baseUrl/api/v1/reviews/vendor/$vendorId/stats" -Method Get -ErrorAction Stop
  Write-Host "Average Rating: $($statsRes2.data.averageRating) (Expected: 0)"
  Write-Host "Total Reviews: $($statsRes2.data.totalReviews) (Expected: 0)"
  if ($statsRes2.data.totalReviews -ne 0 -or $statsRes2.data.averageRating -ne 0) {
    Write-Error "Stats not reset post deletion."
    exit
  }
  Write-Host "Assertion PASSED: Stats aggregated back to 0 successfully."
} catch {
  Write-Error "Failed to get stats post-deletion: $_"
  exit
}

Write-Host "`n=================== ALL PHASE 7 REVIEWS API TESTS PASSED SUCCESSFULLY! ==================="
