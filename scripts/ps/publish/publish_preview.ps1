$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "development"

expo publish --release-channel "preview-v2"

$Env:APP_VARIANT = $oldValue
