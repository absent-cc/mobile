$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "production"

expo publish --release-channel "production-v2"

$Env:APP_VARIANT = $oldValue
