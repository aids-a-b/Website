@echo off
setlocal

echo Starting local server on port 8080...
start "TestServer" /B python -m http.server 8080

echo Waiting for server to kickstart everything...
ping 127.0.0.1 -n 2 > nul

echo Opening the Classroom Teaching Portal in your default browser...
start http://localhost:8080/index.html

echo The server is now running in the background. 
echo To stop the server later, you can close this command prompt window or run the kill command.
endlocal
