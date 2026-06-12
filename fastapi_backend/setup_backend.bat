@echo off
echo =========================================
echo  FastAPI Backend Setup
echo =========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is still not recognized! 
    echo Please make sure you checked "Add Python to PATH" during installation.
    echo If you just installed it, try restarting your computer.
    pause
    exit /b
)

echo [1/3] Creating Virtual Environment...
python -m venv venv

echo [2/3] Installing Dependencies...
call venv\Scripts\activate
pip install -r requirements.txt

echo [3/3] Starting FastAPI Server...
uvicorn app.main:app --host 0.0.0.0 --reload

pause
