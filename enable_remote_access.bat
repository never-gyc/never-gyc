@echo off
echo 正在添加防火墙规则，允许8000端口通过...
netsh advfirewall firewall add rule name="HTTP_Server_8000" dir=in action=allow protocol=TCP localport=8000
if %errorlevel% neq 0 (
    echo 添加防火墙规则失败，请以管理员身份运行此脚本！
    pause
    exit /b 1
)
echo 防火墙规则已添加完成！
echo.

for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0 ^| findstr /v 127.0.0.1') do set IP=%%a

echo 现在其他设备可以通过以下地址访问您的网站：
echo http://%IP%:8000
echo.
echo 请确保：
echo 1. 其他设备与您的电脑在同一个网络中
echo 2. 您的电脑防火墙已允许8000端口的访问
echo 3. 您的网站服务器正在运行
echo.
echo 按任意键退出...
pause > nul