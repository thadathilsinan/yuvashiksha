#SingleInstance Force
#NoTrayIcon

;INCLUDING REQUIRES FILES WITH THIS EXE FILE
FileCreateDir, C:\Yuvashiksha
FileInstall, C:\Users\Sinan\Desktop\disableKeys.exe, C:\Yuvashiksha\disableKeys.exe, 1
FileInstall, C:\Users\Sinan\Desktop\killTaskMgr.exe, C:\Yuvashiksha\killTaskMgr.exe, 1
FileInstall, C:\Users\Sinan\Desktop\activateChrome.exe, C:\Yuvashiksha\activateChrome.exe, 1

;Chcking if chrome installed or not
if (FileExist("C:\Program Files\Google\Chrome\Application\chrome.exe") or FileExist("C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"))
{
	;Chrome installed, All depency are OK
	CheckAdmin()
	Main()
}
else
{
	MsgBox, % Options 4+48 , Cannot start Yuvashiksha, Google Chrome is not installed in your system! `rDo you want to select chrome.exe manually?
	IfMsgBox, Yes
		FileSelectFile, chromeFile, 1, C:\, Select Chrome.exe file, *.exe
	IfMsgBox, No
		Return	;Exit the program
	
	if(chromeFile)
	{
		CheckAdmin()
		Main(chromeFile)
	}
	else
	{
		MsgBox, You are not selected any file
		Return
	}
}


;FUNCTION DECLARATIONS

;CHECK ADMIN RIGHTS
CheckAdmin()
{
	if (not A_IsAdmin)
	{
		MsgBox, % Options 0+16, Cannot Start Yuvashiksha, No Administrator Access
		Exit
	}
}

;PROGRAM MAIN LOGIC
Main(chrome:=0)
{
	if (chrome != 0)
	{
		;Chrome location passed
		;Kill Chrome
		Kill(chrome)
		DisableKeys()
		StartChrome()
		EnableKeys()
	}
	else
	{
		;Default chrome location
		;Kill Chrome
		Kill()
		DisableKeys()
		StartChrome()
		EnableKeys()
	}
}

;KILL CHROME IF ALREADY RUNNING
Kill(chrome:=0)
{
	if (chrome != 0)
	{
		;Chrome location passed
		chrome=ahk_exe %chrome%

		if (WinExist(chrome))
		{
			WinKill
		}
	}
	else
	{
		;Default chrome location
		if (WinExist("ahk_exe chrome.exe"))
		{
			WinKill
		}
	}
}

;DISABLE KEYS
DisableKeys()
{
	try {
		Run, C:\Yuvashiksha\disableKeys.exe
		Run, C:\Yuvashiksha\killTaskMgr.exe
		Run, C:\Yuvashiksha\activateChrome.exe
	} catch e {
		MsgBox, % Options 0+16, Cannot Start Yuvashiksha, Cannot Run dependancy programs
		Exit
	}
}

;START CHROME IN KIOSK MODE
StartChrome(chrome:=0)
{
	if (chrome != 0)
	{
		;Chrome location passed
		chrome=%chrome%

		RunWait, %chrome% --kiosk --incognito "http://localhost:3000"
	}
	else
	{
		;Default chrome location
		RunWait, chrome.exe --kiosk --incognito "http://localhost:3000"
	}
}

;ENABLE KEYS
EnableKeys()
{
	Process, Close, disableKeys.exe
	Process, Close, killTaskMgr.exe
	Process, Close, activateChrome.exe
}
