@echo off
echo Deleting test files...

REM Delete test_*.py files
for /r %%f in (test_*.py) do (
    if exist "%%f" (
        echo Deleting %%f
        del "%%f"
    )
)

REM Delete *_test.py files
for /r %%f in (*_test.py) do (
    if exist "%%f" (
        echo Deleting %%f
        del "%%f"
    )
)

echo Done!
