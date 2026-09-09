# ============================================================
#  start-server.ps1 —— 交我吃 ver0.2 本地服务器启动脚本
#  本文件为 UTF-8（含 BOM），请勿改成 ANSI 编码。
#
#  行为：
#    1) 自动寻找空闲端口（默认 8000，被占用则依次尝试到 8099）
#    2) 优先使用 Node.js（最稳定），其次 py / python（跳过
#       Windows 应用商店的 python 别名，因为它常常静默失败）
#    3) 服务器就绪后自动打开浏览器 http://127.0.0.1:端口/
#    4) 服务器在本窗口前台运行；关闭本窗口即停止服务；
#       启动失败时窗口保留并给出原因。
#  手动替代：直接执行  node server.js
# ============================================================

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host '============================================================'
Write-Host '  交我吃 ver0.2 · 本地服务器启动器'
Write-Host '============================================================'
Write-Host ''

# ---------- 1. 寻找空闲端口 ----------
function Test-PortFree([int]$Port) {
    $l = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
    try {
        $l.Start()
        return $true
    } catch {
        return $false
    } finally {
        $l.Stop()
    }
}

$port = 8000
while ($port -lt 8100 -and -not (Test-PortFree $port)) { $port++ }
if ($port -ge 8100) {
    Write-Host '[错误] 8000~8099 端口全部被占用，无法启动。' -ForegroundColor Red
    Read-Host '按回车退出'
    exit 1
}
Write-Host "使用端口: $port"
Write-Host "访问地址: http://127.0.0.1:$port/"
Write-Host ''

# ---------- 2. 挑选可用的运行环境（Node.js 优先） ----------
$runner = $null   # node | py | python | <本地 python 完整路径>

if (Get-Command node -ErrorAction SilentlyContinue) {
    $runner = 'node'
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $runner = 'py'
} else {
    $pyCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($pyCmd) {
        if ($pyCmd.Source -notlike '*\WindowsApps\*') {
            $runner = 'python'
        } else {
            # 商店别名：先测一下能不能真的运行
            & $pyCmd.Source -c 'pass' 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) { $runner = 'python' }
        }
    }
    if (-not $runner -and (Test-Path "$env:LOCALAPPDATA\Python\bin\python.exe")) {
        $runner = "$env:LOCALAPPDATA\Python\bin\python.exe"
    }
}

if (-not $runner) {
    Write-Host '[错误] 未找到可用的 Node.js 或 Python。' -ForegroundColor Red
    Write-Host '请安装 Node.js 后重试，或直接双击项目里的其它说明文件。'
    Read-Host '按回车退出'
    exit 1
}

# ---------- 3. 延迟 2 秒自动打开浏览器（等服务真正就绪） ----------
# 打开浏览器失败不影响服务器运行（可直接手动访问上方地址）
try {
    $browserCmd = "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:$port/'"
    $encoded = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($browserCmd))
    Start-Process powershell -WindowStyle Hidden -ArgumentList @('-NoProfile', '-EncodedCommand', $encoded) | Out-Null
} catch {
    Write-Host '（提示：无法自动打开浏览器，请手动访问上方地址）' -ForegroundColor DarkGray
}

# ---------- 4. 前台运行服务器 ----------
Write-Host '服务正在启动……'
Write-Host '本窗口需保持开启（关闭本窗口即停止服务）；浏览器将自动打开。' -ForegroundColor Cyan
Write-Host ''

try {
    if ($runner -eq 'node') {
        Write-Host "[方式] Node.js:  node server.js   (端口 $port)"
        $env:PORT = "$port"
        & node server.js
    } elseif ($runner -eq 'py') {
        Write-Host "[方式] Python:  py -3 -m http.server $port"
        & py -3 -m http.server $port
    } elseif ($runner -eq 'python') {
        Write-Host "[方式] Python:  python -m http.server $port"
        & python -m http.server $port
    } else {
        Write-Host "[方式] Python:  $runner -m http.server $port"
        & $runner -m http.server $port
    }
} catch {
    Write-Host "[错误] 启动失败：$($_.Exception.Message)" -ForegroundColor Red
}

$code = $LASTEXITCODE
if ($code -ne 0) {
    Write-Host ''
    Write-Host '[错误] 服务器异常退出（退出码：' + $code + '）。' -ForegroundColor Red
    Write-Host '常见原因与解决办法：'
    Write-Host '  1) 端口被其它程序占用 —— 本脚本已自动换端口，若仍失败请手动执行:  node server.js'
    Write-Host '  2) 防火墙拦截 —— 首次运行时请允许 node.exe/python 访问网络（本地访问一般无影响）'
    Write-Host '  3) 若你只有“Windows 应用商店版 Python”，其 python 命令可能无法运行，请改用 Node'
    Read-Host '按回车退出'
    exit 1
}
