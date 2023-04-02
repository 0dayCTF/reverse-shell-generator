
// Element selectors
const ipInput = document.querySelector("#ip");
const portInput = document.querySelector("#port");
const listenerSelect = document.querySelector("#listener-selection");
const shellSelect = document.querySelector("#shell");
// const autoCopySwitch = document.querySelector("#auto-copy-switch");
const encodingSelect = document.querySelector('#encoding');
const listenerCommand = document.querySelector("#listener-command");
const reverseShellCommand = document.querySelector("#reverse-shell-command");
const bindShellCommand = document.querySelector("#bind-shell-command");
const msfVenomCommand = document.querySelector("#msfvenom-command");
const hoaxShellCommand = document.querySelector("#hoaxshell-command");

const FilterType = {
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

document.querySelector("#os-options").addEventListener("change", (event) => {
    const selectedOS = event.target.value;
    rsg.setState({
        filter: selectedOS,
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

var rawLinkButtons = document.querySelectorAll('.raw-listener');
for (const button of rawLinkButtons) {
    button.addEventListener("click", () => {
        const rawLink = RawLink.generate(rsg);
        window.location = rawLink;
    });
}

const filterCommandData = function (data, { commandType, filter }) {
    return data.filter(item => {
        if (!item.meta.includes(commandType)) {
            return false;
        }

        if (!filter) {
            return true;
        }

        if (filter === FilterType.All) {
            return true;
        }

        return item.meta.includes(filter);
    });
}

const query = new URLSearchParams(location.hash.substring(1));

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
const fixedEncodeURIComponent = function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

const rsg = {
    ip: (query.get('ip') || localStorage.getItem('ip') || '10.10.10.10').replace(/[^a-zA-Z0-9.\-]/g, ''),
    port: query.get('port') || localStorage.getItem('port') || 9001,
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
    },
    commandType: CommandType.ReverseShell,
    filter: FilterType.All,

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

    getPort: () => Number(rsg.port),

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
        } else {
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
        return command
            .replaceAll(encoder('{ip}'), encoder(rsg.getIP()))
            .replaceAll(encoder('{port}'), encoder(String(rsg.getPort())))
            .replaceAll(encoder('{shell}'), encoder(rsg.getShell()))
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
    },

    updateTabList: () => {
        const data = rsgData.reverseShellCommands;
        const filteredItems = filterCommandData(
            data,
            {
                filter: rsg.filter,
                commandType: rsg.commandType
            }
        );

        const documentFragment = document.createDocumentFragment()
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

        const listSelectionSelector = rsg.uiElements[rsg.commandType].listSelection;
        document.querySelector(listSelectionSelector).replaceChildren(documentFragment)
    },

    updateListenerCommand: () => {
        const privilegeWarning = document.querySelector("#port-privileges-warning");
        let command = listenerSelect.value;
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
    rsg.setState({
        port: Number(e.target.value)
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
