#Persistent
#SingleInstance Force
#NoTrayIcon

gosub Activate

;ACTIAVTE WINDOW IF FOCUS CHANGED
Activate:

	WinWaitNotActive, ahk_exe chrome.exe
	if ErrorLevel
	{
		return
	}
	else
	{
		WinActivate, ahk_exe chrome.exe
		gosub Activate
	}
return