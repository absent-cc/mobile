$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "development"

yarn expo publish --release-channel "preview-v2"

$Env:APP_VARIANT = $oldValue
