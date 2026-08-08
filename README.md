# BiofloraFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

[![CI - Test](../../actions/workflows/test.yml/badge.svg)](../../actions/workflows/test.yml)


## Decisões de Tecnologia e Arquiteturais

* **Angular:** framework utilizado para o desenvolvimento da aplicação frontend, permite modularização e organização do código.
* **Bootstrap:** utilizado para estilização e construção da interface, proporcionando componentes responsivos e padronização visual.
* **Jest:** substituiu o Jasmine como framework de testes unitários, visando uma execução mais rápida e uma experiência de testes mais estável.
* **GitHub Pages:** o frontend é compilado e disponibilizado por meio de um pipeline de CI/CD utilizando GitHub Actions e hospedagem no próprio GitHub.

### Interação Front-Back
* **API REST:** comunicação entre o frontend e o backend realizada por meio de uma API baseada em REST.
* **Autenticação JWT:** autenticação dos usuários realizada por meio de JSON Web Tokens (JWT), utilizados para autenticar e autorizar as requisições à API.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
