if($args.count -eq 0) {
    Write-Host "Please provide an update message."
    Exit 1
}

$oldValue = $Env:APP_VARIANT
$Env:APP_VARIANT = "development"

eas update --branch "preview-v3" --message $args[0]

$Env:APP_VARIANT = $oldValue
