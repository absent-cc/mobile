$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "production"

yarn expo publish --release-channel "production-v2"

$Env:APP_VARIANT = $oldValue
