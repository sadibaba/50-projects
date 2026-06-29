@echo off
echo ========================================
echo   TASK MANAGER API - TEST SUITE
echo ========================================
echo.

if not exist results mkdir results

where k6 >nul 2>nul
if %errorlevel% neq 0 (
    echo  k6 is not installed. Please install it:
    echo    - Windows: choco install k6
    echo.
    echo Or run with Docker: docker run --rm -v .:/scripts grafana/k6 run /scripts/k6-load-test.js
    exit /b 1
)

echo  k6 is installed
echo.
echo  Starting Load Tests...
echo.

k6 run k6-load-test.js ^
  --summary-export=results/load-test-summary.json ^
  --out json=results/load-test-results.json ^
  --verbose

echo.
echo  Load test completed!
echo  Results saved to:
echo    - results/load-test-summary.json
echo    - results/load-test-results.json
echo.