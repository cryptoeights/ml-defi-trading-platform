@echo off
echo Cross-Chain Trading Test Suite
echo =============================
echo.
echo Choose an option:
echo 1. Basic Cross-Chain Test
echo 2. GAIA Cross-Chain Test
echo 3. Interactive Cross-Chain CLI
echo 4. All Tests
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Running basic cross-chain test...
    python cross_chain_trading.py
) else if "%choice%"=="2" (
    echo Running GAIA cross-chain test...
    python gaia_cross_chain.py
) else if "%choice%"=="3" (
    echo Starting interactive cross-chain CLI...
    python cross_chain_cli.py
) else if "%choice%"=="4" (
    echo Running all tests...
    python test_cross_chain.py
) else if "%choice%"=="5" (
    echo Goodbye!
    exit
) else (
    echo Invalid choice!
)

pause 