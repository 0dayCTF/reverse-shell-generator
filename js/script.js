
// Element selectors
const ipInput = document.querySelector("#ip");
const portInput = document.querySelector("#port");
const listenerSelect = document.querySelector("#listener-selection");
const shellSelect = document.querySelector("#shell");
// const autoCopySwitch = document.querySelector("#auto-copy-switch");
const operatingSystemSelect = document.querySelector("#os-options");
const encodingSelect = document.querySelector('#encoding');
const searchBox = document.querySelector('#searchBox');
const listenerCommand = document.querySelector("#listener-command");
const reverseShellCommand = document.querySelector("#reverse-shell-command");
const bindShellCommand = document.querySelector("#bind-shell-command");
const msfVenomCommand = document.querySelector("#msfvenom-command");
const hoaxShellCommand = document.querySelector("#hoaxshell-command");
const assembledCommand = document.querySelector("#assembled-command");

const FilterOperatingSystemType = {
    'All': 'all',
    'Windows': 'windows',
    'Linux': 'linux',
    'Mac': 'mac'
};

const hoaxshell_listener_types = {
    "Windows CMD cURL" : "cmd-curl",
    "PowerShell IEX" : "ps-iex",
    "PowerShell IEX Constr Lang Mode" : "ps-iex-cm",
    "PowerShell Outfile" : "ps-outfile",
    "PowerShell Outfile Constr Lang Mode" : "ps-outfile-cm",
    "Windows CMD cURL https" : "cmd-curl -c /your/cert.pem -k /your/key.pem",
    "PowerShell IEX https" : "ps-iex -c /your/cert.pem -k /your/key.pem",
    "PowerShell IEX Constr Lang Mode https" : "ps-iex-cm -c /your/cert.pem -k /your/key.pem",
    "PowerShell Outfile https" : "ps-outfile -c /your/cert.pem -k /your/key.pem",
    "PowerShell Outfile Constr Lang Mode https" : "ps-outfile-cm -c /your/cert.pem -k /your/key.pem"
};

operatingSystemSelect.addEventListener("change", (event) => {
    const selectedOS = event.target.value;
    rsg.setState({
        filterOperatingSystem: selectedOS,
    });
});

document.querySelector("#reverse-tab").addEventListener("click", () => {
    rsg.setState({
        commandType: CommandType.ReverseShell,
    });
})

document.querySelector("#bind-tab").addEventListener("click", () => {
    rsg.setState({
        commandType: CommandType.BindShell,
        encoding: "None"
});
})

document.querySelector("#bind-tab").addEventListener("click", () => {
    document.querySelector("#bind-shell-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.BindShell

    });
})

document.querySelector("#msfvenom-tab").addEventListener("click", () => {
    document.querySelector("#msfvenom-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.MSFVenom,
encoding: "None"
    });
});


document.querySelector("#hoaxshell-tab").addEventListener("click", () => {
    document.querySelector("#hoaxshell-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.HoaxShell,
        encoding: "None"
    });
});

document.querySelector("#assembled-tab").addEventListener("click", () => {
    document.querySelector("#assembled-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.Assembled,
        encoding: "None"
    });
});

var rawLinkButtons = document.querySelectorAll('.raw-listener');
for (const button of rawLinkButtons) {
    button.addEventListener("click", () => {
        const rawLink = RawLink.generate(rsg);
        window.location = rawLink;
    });
}

const filterCommandData = function (data, { commandType, filterOperatingSystem = FilterOperatingSystemType.All, filterText = '' }) {
    return data.filter(item => {

        if (!item.meta.includes(commandType)) {
            return false;
        }

        var hasOperatingSystemMatch = (filterOperatingSystem === FilterOperatingSystemType.All) || item.meta.includes(filterOperatingSystem);
        var hasTextMatch = item.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0;
        return hasOperatingSystemMatch && hasTextMatch;
    });
}

const query = new URLSearchParams(location.hash.substring(1));

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
const fixedEncodeURIComponent = function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

const parsePortOrDefault = function (value, defaultPort = 9001) {
    if (value === null || value === undefined) return defaultPort;

    const number = Number(value);
    const isValidPort = (Number.isSafeInteger(number) && number >= 0 && number <= 65535);
    return isValidPort ? number : defaultPort;
};

const toBytes = function (ip, port) {

    if (ip.split('.').length == 4) {
        ip = ip.split('.').map(x => {
            let octet = parseInt(x);
            if (!isNaN(octet) && ((octet >= 0) && (octet <= 0xFF)))
                return `\\x${octet.toString(16).padStart(2, 0)}`;
            return "\\x..";
        }).join('');
    }
    else ip = "\\x..\\x..\\x..\\x..";

    if (!isNaN(port = parseInt(port))) {
        port = port.toString(16).padStart(4, 0);
        port = port.match(/.{2}/g).map(b => `\\x${b}`).join('');
    }
    else port = "\\x..\\x..";

    return {ip, port};
}

const rsg = {
    ip: (query.get('ip') || localStorage.getItem('ip') || '10.10.10.10').replace(/[^a-zA-Z0-9.\-]/g, ''),
    port: parsePortOrDefault(query.get('port') || localStorage.getItem('port')),
    payload: query.get('payload') || localStorage.getItem('payload') || 'windows/x64/meterpreter/reverse_tcp',
    payload: query.get('type') || localStorage.getItem('type') || 'cmd-curl',
    shell: query.get('shell') || localStorage.getItem('shell') || rsgData.shells[0],
    listener: query.get('listener') || localStorage.getItem('listener') || rsgData.listenerCommands[0][1],
    encoding: query.get('encoding') || localStorage.getItem('encoding') || 'None',
    selectedValues: {
        [CommandType.ReverseShell]: filterCommandData(rsgData.reverseShellCommands, { commandType: CommandType.ReverseShell })[0].name,
        [CommandType.BindShell]: filterCommandData(rsgData.reverseShellCommands, { commandType: CommandType.BindShell })[0].name,
        [CommandType.MSFVenom]: filterCommandData(rsgData.reverseShellCommands, { commandType: CommandType.MSFVenom })[0].name,
        [CommandType.HoaxShell]: filterCommandData(rsgData.reverseShellCommands, { commandType: CommandType.HoaxShell })[0].name,
        [CommandType.Assembled]: filterCommandData(rsgData.reverseShellCommands, { commandType: CommandType.Assembled })[0].name,
    },
    commandType: CommandType.ReverseShell,
    filterOperatingSystem: query.get('filterOperatingSystem') || localStorage.getItem('filterOperatingSystem') || FilterOperatingSystemType.All,
    filterText: query.get('filterText') || localStorage.getItem('filterText') || '',

    uiElements: {
        [CommandType.ReverseShell]: {
            listSelection: '#reverse-shell-selection',
            command: '#reverse-shell-command'
        },
        [CommandType.BindShell]: {
            listSelection: '#bind-shell-selection',
            command: '#bind-shell-command',
        },
        [CommandType.MSFVenom]: {
            listSelection: '#msfvenom-selection',
            command: '#msfvenom-command'
        },
        [CommandType.HoaxShell]: {
            listSelection: '#hoaxshell-selection',
            command: '#hoaxshell-command'
        },
        [CommandType.Assembled]: {
            listSelection: '#assembled-selection',
            command: '#assembled-command'
        }
    },

    copyToClipboard: (text) => {
        if (navigator ?.clipboard ?.writeText) {
            navigator.clipboard.writeText(text)
            $('#clipboard-toast').toast('show')
        } else if (window ?.clipboardData ?.setData) {
            window.clipboardData.setData('Text', text);
            $('#clipboard-toast').toast('show')
        } else {
            $('#clipboard-failure-toast').toast('show')
        }
    },

    escapeHTML: (text) => {
        let element = document.createElement('p');
        element.textContent = text;
        return element.innerHTML;
    },

    getIP: () => rsg.ip,

    getPort: () => parsePortOrDefault(rsg.port),

    getShell: () => rsg.shell,

    getEncoding: () => rsg.encoding,

    getSelectedCommandName: () => {
        return rsg.selectedValues[rsg.commandType];
    },

    getReverseShellCommand: () => {
        const reverseShellData = rsgData.reverseShellCommands.find((item) => item.name === rsg.getSelectedCommandName());
        return reverseShellData.command;
    },

    getPayload: () => {
        if (rsg.commandType === 'MSFVenom') {
            let cmd = rsg.getReverseShellCommand();
            // msfvenom -p windows/x64/meterpreter_reverse_tcp ...
            let regex = /\s+-p\s+(?<payload>[a-zA-Z0-9/_]+)/;
            let match = regex.exec(cmd);
            if (match) {
                return match.groups.payload;
            }
        }

        return 'windows/x64/meterpreter/reverse_tcp'

    },

    getType: () => {
        if (rsg.commandType === 'HoaxShell') {
            let cmd_name = rsg.getSelectedCommandName();
            return hoaxshell_listener_types[cmd_name];
        }

        return 'cmd-curl'

    },

    generateReverseShellCommand: () => {
        let command
        if (rsg.getSelectedCommandName() === 'PowerShell #3 (Base64)') {
            const encoder = (text) => text;
            const payload = rsg.insertParameters(rsgData.specialCommands['PowerShell payload'], encoder)
                command = "powershell -e " + btoa(toBinary(payload))
            function toBinary(string) {
                const codeUnits = new Uint16Array(string.length);
                for (let i = 0; i < codeUnits.length; i++) {
                codeUnits[i] = string.charCodeAt(i);
                }
                const charCodes = new Uint8Array(codeUnits.buffer);
                let result = '';
                for (let i = 0; i < charCodes.byteLength; i++) {
                result += String.fromCharCode(charCodes[i]);
                }
                return result;
            }
        } else if (rsg.getSelectedCommandName() === 'PowerShell #5 (stderr support) (Base64)') {
            const encoder = (text) => text;
            const payload = rsg.insertParameters(rsgData.specialCommands['PowerShell +stderr payload'], encoder)
                command = "powershell -e " + btoa(toBinary(payload))
            function toBinary(string) {
                const codeUnits = new Uint16Array(string.length);
                for (let i = 0; i < codeUnits.length; i++) {
                codeUnits[i] = string.charCodeAt(i);
                }
                const charCodes = new Uint8Array(codeUnits.buffer);
                let result = '';
                for (let i = 0; i < charCodes.byteLength; i++) {
                result += String.fromCharCode(charCodes[i]);
                }
                return result;
            }
        }
        else {
            command = rsg.getReverseShellCommand()
        }
        
        const encoding = rsg.getEncoding();
        if (encoding === 'Base64') {
            command = rsg.insertParameters(command, (text) => text)
            command = btoa(command)
        } else {
            function encoder(string) {
                let result = string;
                switch (encoding) {
                    case 'encodeURLDouble':
                        result = fixedEncodeURIComponent(result);
                        // fall-through
                    case 'encodeURL':
                        result = fixedEncodeURIComponent(result);
                        break;
                }
                return result;
            }
            command = rsg.escapeHTML(encoder(command));
            // NOTE: Assumes encoder doesn't produce HTML-escaped characters in parameters
            command = rsg.insertParameters(rsg.highlightParameters(command, encoder), encoder);
        }

        return command;
    },

    highlightParameters: (text, encoder) => {
        const parameters = ['{ip}', '{port}', '{shell}', encodeURI('{ip}'), encodeURI('{port}'),
            encodeURI('{shell}')
        ];

        parameters.forEach((param) => {
            if (encoder) param = encoder(param)
            text = text.replace(param, `<span class="highlighted-parameter">${param}</span>`)
        })
        return text
    },

    init: () => {
        rsg.initListenerSelection()
        rsg.initShells()
    },

    initListenerSelection: () => {
        rsgData.listenerCommands.forEach((listenerData, i) => {
            const type = listenerData[0];
            const command = listenerData[1];

            const option = document.createElement("option");

            option.value = command;
            option.selected = rsg.listener === option.value;
            option.classList.add("listener-option");
            option.innerText = type;

            listenerSelect.appendChild(option);
        })
    },

    initShells: () => {
        rsgData.shells.forEach((shell, i) => {
            const option = document.createElement("option");

            option.selected = rsg.shell === shell;
            option.classList.add("shell-option");
            option.innerText = shell;

            shellSelect.appendChild(option);
        })
    },

    // Updates the rsg state, and forces a re-render
    setState: (newState = {}) => {
        Object.keys(newState).forEach((key) => {
            const value = newState[key];
            rsg[key] = value;
            localStorage.setItem(key, value)
        });
        Object.assign(rsg, newState);

        rsg.update();
    },

    insertParameters: (command, encoder) => {

        let ip    = rsg.getIP();
        let port  = rsg.getPort();
        let shell = rsg.getShell();

        if (rsg.commandType === CommandType.Assembled) {  
            const {ip: _ip, port: _port} = toBytes(ip, port)
            ip = _ip; port = _port
        }

        return command
            .replaceAll(encoder('{ip}'), encoder(ip))
            .replaceAll(encoder('{port}'), encoder(String(port)))
            .replaceAll(encoder('{shell}'), encoder(shell))

    },

    update: () => {
        rsg.updateListenerCommand()
        rsg.updateTabList()
        rsg.updateReverseShellCommand()
        rsg.updateValues()
    },

    updateValues: () => {
        const listenerOptions = listenerSelect.querySelectorAll(".listener-option");
        listenerOptions.forEach((option)  => {
            option.selected = rsg.listener === option.value;
        });

        const shellOptions = shellSelect.querySelectorAll(".shell-option");
        shellOptions.forEach((option) => {
            option.selected = rsg.shell === option.value;
        });

        const encodingOptions = encodingSelect.querySelectorAll("option");
        encodingOptions.forEach((option) => {
            option.selected = rsg.encoding === option.value;
        });

        ipInput.value = rsg.ip;
        portInput.value = rsg.port;
        operatingSystemSelect.value = rsg.filterOperatingSystem;
        searchBox.value = rsg.filterText;
    },

    updateTabList: () => {
        const data = rsgData.reverseShellCommands;
        const filteredItems = filterCommandData(
            data,
            {
                filterOperatingSystem:  rsg.filterOperatingSystem,
                filterText: rsg.filterText,
                commandType: rsg.commandType
            }
        );
        const listSelectionSelector = rsg.uiElements[rsg.commandType].listSelection;
        const listSelectionElement = document.querySelector(listSelectionSelector);
        const previousScrollTop = listSelectionElement?.scrollTop || 0;
        const documentFragment = document.createDocumentFragment();
        if (filteredItems.length === 0) {
            const emptyMessage = document.createElement("button");
            emptyMessage.innerText = "No results found";
            emptyMessage.classList.add("list-group-item", "list-group-item-action", "disabled");

            documentFragment.appendChild(emptyMessage);
        }
        filteredItems.forEach((item, index) => {
            const {
                name,
                command
            } = item;

            const selectionButton = document.createElement("button");

            if (rsg.getSelectedCommandName() === item.name) {
                selectionButton.classList.add("active");
            }

            const clickEvent = () => {
                rsg.selectedValues[rsg.commandType] = name;
                rsg.update();

                // if (document.querySelector('#auto-copy-switch').checked) {
                //     rsg.copyToClipboard(reverseShellCommand.innerText)
                // }
            }

            selectionButton.innerText = name;
            selectionButton.classList.add("list-group-item", "list-group-item-action");
            selectionButton.addEventListener("click", clickEvent);

            documentFragment.appendChild(selectionButton);
        })

        listSelectionElement.replaceChildren(documentFragment);
        listSelectionElement.scrollTop = previousScrollTop;
    },

    updateListenerCommand: () => {
        const privilegeWarning = document.querySelector("#port-privileges-warning");
        let command = listenerSelect.value;

        const selectedCommandName = rsg.getSelectedCommandName();
        const udpPayloads = [
            'Bash udp',
            'ncat udp',
        ];
        let isUDP = false;
        if (udpPayloads.includes(selectedCommandName)) {
            isUDP = true;
        }

        if (isUDP) {
            let udpSupported = true;
            if (/^nc\s/.test(command) && !/\s-u(\s|$)/.test(command)) {
                command = command.replace(/^(nc)(\s+)/, '$1 -u$2');
            } else if (/^ncat(\s|\.|\s--ssl)/.test(command) && !/\s-u(\s|$)/.test(command)) {
                if (/--ssl/.test(command)) {
                    udpSupported = false;
                    command = '<span class="highlighted-warning">Warning: SSL/TLS (--ssl) is not supported over UDP with ncat.</span>';
                } else {
                    command = command.replace(/^(ncat(\.exe)?( --ssl)?)(\s+)/, '$1 -u$4');
                }
            } else if (/^busybox nc\s/.test(command) && !/\s-u(\s|$)/.test(command)) {
                command = command.replace(/^(busybox nc)(\s+)/, '$1 -u$2');
            } else if (/^rlwrap -cAr nc\s/.test(command) && !/\s-u(\s|$)/.test(command)) {
                command = command.replace(/^(rlwrap -cAr nc)(\s+)/, '$1 -u$2');
            } else if (/^nc freebsd\s/.test(command)) {
                command = command.replace(/^nc freebsd\s+-lvn(\s+){port}/, 'nc freebsd -lun {port}');
            } else if (/^rcat listen/.test(command) && !/\s-u(\s|$)/.test(command)) {
                command = command.replace(/^(rcat listen)(\s+)/, '$1 -u$2');
            } else if (/^python3 -m pwncat( -m windows)?(\s+)/.test(command) && !/\s-u(\s|$)/.test(command)) {
                command = command.replace(/^(python3 -m pwncat( -m windows)?)(\s+)/, '$1 -u$3');
            } else if (/^socat\b/.test(command)) {
                command = command.replace(/TCP-LISTEN:/g, 'UDP-LISTEN:').replace(/TCP:/g, 'UDP:');
            } else if (/^openssl\b/.test(command)) {
                const dtlsCmd = 'openssl s_server -dtls -accept {port} -cert server-cert.pem -key server-key.pem';
                command = '<code>' + dtlsCmd + '</code>';
            } else if (/^msfconsole\b/.test(command)) {
                udpSupported = false;
                command = '<span class="highlighted-warning">Warning: UDP payloads are not currently supported in msfconsole by this generator.</span>';
            } else if (/^powercat\b/.test(command)) {
                udpSupported = false;
                command = '<span class="highlighted-warning">Warning: powercat does not support UDP listeners.</span>';
            } else if (/hoaxshell-listener\.py/.test(command)) {
                udpSupported = false;
                command = '<span class="highlighted-warning">Warning: hoaxshell does not support UDP listeners.</span>';
            } else if (/stty raw -echo; \(stty size; cat\) \| nc /.test(command)) {
                udpSupported = false;
                command = '<span class="highlighted-warning">Warning: UDP is not natively supported for Windows ConPty listeners.</span>';
            }
            if (!udpSupported && !/highlighted-warning/.test(command)) {
                command = '<span class="highlighted-warning">Warning: This listener may not support UDP. Please verify manually.</span>';
            }
        }



        command = rsg.highlightParameters(command)
        command = command.replace('{port}', rsg.getPort())
        command = command.replace('{ip}', rsg.getIP())
        command = command.replace('{payload}', rsg.getPayload())
        command = command.replace('{type}', rsg.getType())

        if (rsg.getPort() < 1024) {
            privilegeWarning.style.visibility = "visible";
            command = `<span class="highlighted-warning">sudo</span> ${command}`
        } else {
            privilegeWarning.style.visibility = "hidden";
        }

        let icon = '🚀';
        if (/<span class=\"highlighted-warning\">|Warning:|Error:|💥/.test(command)) {
            icon = '💥';
        }
        // Set the icon in the .prompt-sign element (do not change HTML or styles)
        const promptSign = listenerCommand.parentElement.querySelector('.prompt-sign');
        if (promptSign) promptSign.textContent = icon;
        listenerCommand.innerHTML = command;
    },

    updateReverseShellSelection: () => {
        document.querySelector(".list-group-item.active") ?.classList.remove("active");
        const elements = Array.from(document.querySelectorAll(".list-group-item"));
        const selectedElement = elements.find((item) => item.innerText === rsg.currentCommandName);
        selectedElement?.classList.add("active");
    },

    updateReverseShellCommand: () => {
        const command = rsg.generateReverseShellCommand();
        const commandSelector = rsg.uiElements[rsg.commandType].command;
        // Set dynamic icon (🚀 for normal, 💥 for error/warning)
        let icon = '🚀';
        if (/<span class=\"highlighted-warning\">|Warning:|Error:|💥/.test(command)) {
            icon = '💥';
        }
        // Set the icon in the .prompt-sign element for the current command area
        const commandPre = document.querySelector(commandSelector);
        if (commandPre && commandPre.parentElement) {
            const promptSign = commandPre.parentElement.querySelector('.prompt-sign');
            if (promptSign) promptSign.textContent = icon;
        }
        document.querySelector(commandSelector).innerHTML = command;
    },

    updateSwitchStates: () => {
        $('#listener-advanced').collapse($('#listener-advanced-switch').prop('checked') ? 'show' :
            'hide')
        $('#revshell-advanced').collapse($('#revshell-advanced-switch').prop('checked') ? 'show' :
            'hide')
    }
}

/*
    * Init
    */
rsg.init();
rsg.update();

/*
    * Event handlers/functions
    */
ipInput.addEventListener("input", (e) => {
    rsg.setState({
        ip: e.target.value
        })
});

portInput.addEventListener("input", (e) => {
    const value = e.target.value.length === 0 ? '0' : e.target.value;
    rsg.setState({
        port: parsePortOrDefault(value, rsg.getPort())
    })
});

listenerSelect.addEventListener("change", (e) => {
    rsg.setState({
        listener: e.target.value
    })
});

shellSelect.addEventListener("change", (e) => {
    rsg.setState({
        shell: e.target.value
    })
});

encodingSelect.addEventListener("change", (e) => {
    rsg.setState({
        encoding: e.target.value
    })
});

searchBox.addEventListener("input", (e) => {
    rsg.setState({
        filterText: e.target.value
    })
});

document.querySelector('#inc-port').addEventListener('click', () => {
    rsg.setState({
        port: rsg.getPort() + 1
    })
})

document.querySelector('#listener-advanced-switch').addEventListener('change', rsg.updateSwitchStates);
document.querySelector('#revshell-advanced-switch').addEventListener('change', rsg.updateSwitchStates);

setInterval(rsg.updateSwitchStates, 500) // fix switch changes in rapid succession

document.querySelector('#copy-listener').addEventListener('click', () => {
    rsg.copyToClipboard(listenerCommand.innerText)
})

document.querySelector('#copy-reverse-shell-command').addEventListener('click', () => {
    rsg.copyToClipboard(reverseShellCommand.innerText)
})

document.querySelector('#copy-bind-shell-command').addEventListener('click', () => {
    rsg.copyToClipboard(bindShellCommand.innerText)
})

document.querySelector('#copy-msfvenom-command').addEventListener('click', () => {
    rsg.copyToClipboard(msfVenomCommand.innerText)
})

document.querySelector('#copy-hoaxshell-command').addEventListener('click', () => {
    rsg.copyToClipboard(hoaxShellCommand.innerText)
})

document.querySelector('#copy-assembled-command').addEventListener('click', () => {
    rsg.copyToClipboard(assembledCommand.innerText)
})

var downloadButton = document.querySelectorAll(".download-svg");
for (const Dbutton of downloadButton) {
    Dbutton.addEventListener("click", () => {
        const filename = prompt('Enter a filename', 'payload.sh')
        if(filename===null)return;
        const rawLink = RawLink.generate(rsg);
        axios({
            url: rawLink,
            method: 'GET',
            responseType: 'arraybuffer',
        })
        .then((response)=>{
            const url = window.URL.createObjectURL(new File([response.data], filename ));
            const downloadElement = document.createElement("a");
            downloadElement.href = url;
            downloadElement.setAttribute('download', filename);
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
        });
    });
}

// autoCopySwitch.addEventListener("change", () => {
//     setLocalStorage(autoCopySwitch, "auto-copy", "checked");
// });

// Popper tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

// TODO: add a random fifo for netcat mkfifo
//let randomId = Math.random().toString(36).substring(2, 4);

