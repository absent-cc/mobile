$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "production"

expo publish

$Env:APP_VARIANT = $oldValue
