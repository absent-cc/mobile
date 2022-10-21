$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "development"

yarn expo start --dev-client --tunnel

$Env:APP_VARIANT = $oldValue
