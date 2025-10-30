# ================================
# Configurações iniciais
# ================================
$baseUrl = "http://localhost:8080/api"
$loginUrl = "$baseUrl/auth/login"
$storeUrl = "$baseUrl/store"

# Credenciais do Admin
$loginBody = @{
    email = "admin@example.com"
    password = "MyStrongPassword123!"
} | ConvertTo-Json

# ================================
# 1️⃣ Login e captura do token
# ================================
Write-Host "🔐 Efetuando login..."

$response = Invoke-RestMethod -Uri $loginUrl -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.token

if (-not $token) {
    Write-Host "❌ Erro: não foi possível obter o token de autenticação!"
    exit 1
}

Write-Host "✅ Login bem-sucedido!"
Write-Host "Token JWT obtido com sucesso.`n"

# Cabeçalhos de autorização
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

# ================================
# 2️⃣ Criar nova loja
# ================================
Write-Host "🏪 Criando nova loja..."

$storeBody = @{
    name = "Loja Central"
    address = "Rua das Flores, 123"
    phone = "1133224455"
    description = "Loja principal da rede"
} | ConvertTo-Json

$createResponse = Invoke-RestMethod -Uri $storeUrl -Method POST -Headers $headers -Body $storeBody
$storeId = $createResponse.id

if (-not $storeId) {
    Write-Host "❌ Erro: não foi possível criar a loja!"
    exit 1
}

Write-Host "✅ Loja criada com sucesso! ID: $storeId`n"

# ================================
# 3️⃣ Listar todas as lojas
# ================================
Write-Host "📋 Listando lojas..."
$listResponse = Invoke-RestMethod -Uri $storeUrl -Method GET -Headers $headers
$listResponse | ConvertTo-Json -Depth 5 | Write-Output

# ================================
# 4️⃣ Atualizar loja criada
# ================================
Write-Host "`n✏️ Atualizando loja ID: $storeId..."

$updateBody = @{
    name = "Loja Central Atualizada"
    address = "Avenida Paulista, 1000"
    phone = "11999998888"
    description = "Loja reformada com novo layout"
} | ConvertTo-Json

$updateUrl = "$storeUrl/$storeId"
$updateResponse = Invoke-RestMethod -Uri $updateUrl -Method PUT -Headers $headers -Body $updateBody

Write-Host "✅ Loja atualizada com sucesso!"
$updateResponse | ConvertTo-Json -Depth 5 | Write-Output

# ================================
# 5️⃣ Excluir loja
# ================================
Write-Host "`n🗑️ Excluindo loja ID: $storeId..."
Invoke-RestMethod -Uri $updateUrl -Method DELETE -Headers $headers
Write-Host "✅ Loja excluída com sucesso!"

# ================================
# Fim do script
# ================================
Write-Host "`n🎯 CRUD de loja concluído com sucesso!"
