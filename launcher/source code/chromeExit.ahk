#Persistent
#SingleInstance Force
#NoTrayIcon

CheckChanges()
{
	if (clipboard == "close-yuvashiksha")
	{
		Process, Close, chrome.exe
		Return
	}
}

OnClipboardChange("CheckChanges")