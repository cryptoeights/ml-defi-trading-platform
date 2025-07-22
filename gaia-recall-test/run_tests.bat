@echo off
echo GAIA-Recall Test Suite
echo =====================
echo.
echo Choose an option:
echo 1. Simple Test
echo 2. Interactive CLI
echo 3. Different Tool Calls
echo 4. Web UI
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Running simple test...
    python simple_test.py
) else if "%choice%"=="2" (
    echo Starting interactive CLI...
    python interactive_cli.py
) else if "%choice%"=="3" (
    echo Testing different tool calls...
    python different_tool_calls.py
) else if "%choice%"=="4" (
    echo Starting web UI...
    python web_ui.py
) else if "%choice%"=="5" (
    echo Goodbye!
    exit
) else (
    echo Invalid choice!
)

pause