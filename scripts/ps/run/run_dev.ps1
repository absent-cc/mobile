$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "development"

expo start --dev-client

$Env:APP_VARIANT = $oldValue
