# reverse-shell-generator
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-14-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
Hosted Reverse Shell generator with a ton of functionality -- (great for CTFs)
<br> [![Netlify Status](https://api.netlify.com/api/v1/badges/46dbabe0-23b7-42e6-b04b-e1769dc455ce/deploy-status)](https://app.netlify.com/sites/brave-swartz-5dcdab/deploys)

### Hosted Instance
https://revshells.com

### Features

- Generate common listeners and reverse shells
- Raw mode to cURL shells to your machine.
- Button to increment the listening port number by 1
- URI and Base64 encoding
- LocalStorage to persist your configuration
- Dark and Light Modes

### Screenshot

![image](https://user-images.githubusercontent.com/44453666/111888563-02430f80-89b4-11eb-9e17-ea3de014cf69.png)

## Dev

It's recommended to use the netlify dev command if you're wanting to modify any of the server functions, such as for raw link support:

```
npx netlify dev
```

## Using Docker
Simply run the following commands within this repository to spin up the instance locally using a Docker container

```
docker build -t reverse_shell_generator .

docker run -d -p 80:80 reverse_shell_generator
```

Browse to http://localhost:80

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://ryanmontgomery.me"><img src="https://avatars.githubusercontent.com/u/44453666?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ryan Montgomery</b></sub></a><br /><a href="https://github.com/0dayCTF/reverse-shell-generator/pulls?q=is%3Apr+reviewed-by%3A0dayCTF" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://briskets.io"><img src="https://avatars.githubusercontent.com/u/58673953?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chris Wild</b></sub></a><br /><a href="#projectManagement-briskets" title="Project Management">📆</a> <a href="#tool-briskets" title="Tools">🔧</a> <a href="#infra-briskets" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#design-briskets" title="Design">🎨</a></td>
    <td align="center"><a href="https://papadope.net/"><img src="https://avatars.githubusercontent.com/u/28659477?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chris Papadopoulos</b></sub></a><br /><a href="#design-Papadope" title="Design">🎨</a></td>
    <td align="center"><a href="https://www.alanfoster.me/"><img src="https://avatars.githubusercontent.com/u/1271782?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alan Foster</b></sub></a><br /><a href="#infra-AlanFoster" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://muir.land"><img src="https://avatars.githubusercontent.com/u/58998623?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AG</b></sub></a><br /><a href="#maintenance-MuirlandOracle" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/0x03f3"><img src="https://avatars.githubusercontent.com/u/24409121?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joseph Rose</b></sub></a><br /><a href="#ideas-0x03f3" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/JabbaCS"><img src="https://avatars.githubusercontent.com/u/68778279?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jabba</b></sub></a><br /><a href="#data-JabbaCS" title="Data">🔣</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.jake-ruston.com"><img src="https://avatars.githubusercontent.com/u/22551835?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jake Ruston</b></sub></a><br /><a href="#data-Jake-Ruston" title="Data">🔣</a></td>
    <td align="center"><a href="https://h0j3n.github.io/"><img src="https://avatars.githubusercontent.com/u/51261763?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Muhammad Ali</b></sub></a><br /><a href="#tool-H0j3n" title="Tools">🔧</a></td>
    <td align="center"><a href="http://sprucelab.site"><img src="https://avatars.githubusercontent.com/u/33971688?v=4?s=100" width="100px;" alt=""/><br /><sub><b>edrapac</b></sub></a><br /><a href="#tool-edrapac" title="Tools">🔧</a></td>
    <td align="center"><a href="https://epi052.gitlab.io/notes-to-self/"><img src="https://avatars.githubusercontent.com/u/43392618?v=4?s=100" width="100px;" alt=""/><br /><sub><b>epi</b></sub></a><br /><a href="#tool-epi052" title="Tools">🔧</a></td>
    <td align="center"><a href="https://skerritt.blog"><img src="https://avatars.githubusercontent.com/u/10378052?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brandon</b></sub></a><br /><a href="https://github.com/0dayCTF/reverse-shell-generator/commits?author=bee-san" title="Code">💻</a></td>
    <td align="center"><a href="https://robiot.github.io/"><img src="https://avatars.githubusercontent.com/u/68228472?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Robiot</b></sub></a><br /><a href="#content-robiot" title="Content">🖋</a> <a href="#maintenance-robiot" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/Hydragyrum"><img src="https://avatars.githubusercontent.com/u/4928181?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Bertrand</b></sub></a><br /><a href="#content-Hydragyrum" title="Content">🖋</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
