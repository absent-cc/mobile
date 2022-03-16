$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "development"

expo publish --release-channel preview

$Env:APP_VARIANT = $oldValue
