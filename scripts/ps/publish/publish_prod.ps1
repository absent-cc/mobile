$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "production"

expo publish --release-channel default

$Env:APP_VARIANT = $oldValue
