# SIMPLE CRUD WEBSITE WITH DJANGO AND REACT

A template for a basic django and react site

## Requirements

- docker v20+
- python v3.9 (python3 and pip3)
- bash v5 or zsh
- nodejs v16+
- yarn (node package manager)
- mac or linux/wsl
- internet connection

### Requirements Mac only

- iterm2 with rosetta enabled (needed to run ui tests)

### Requirements Windows only

- wsl2 ubuntu

## NOTES

- Running on Windows outside of wsl is not supported
- All commands listed here assume you are running them from the root of the project unless otherwise specified
- view the project root level just.bash to see all available commands
- Be sure to always have the network tab open in the browser while developing (be on the look out for authorization failure, if endpoints fail due to this, then you need to relogin to the site)

## Ensure .env variables are set

- The environment variables need to be set. Use the default values like so:
> cp .env.example .env; cp .env.bash.example .env.bash

## Just Commands

- All just\_\* commands expect that you have sourced the project root level just.bash while in the root of the project:
> . ./just.bash

### Demo/First Time Setup (takes care of all steps needed to run the app from begin to end assuming you have taken care of the requirements section)

- run the demo (if you see errors in this command, it is likely from installing all dependencies locally which will not matter if your launching vscode within the containers, local install is only needed for intellisense when editing code outside of a container)
> just_demo

### Run the project (start the containers)

> just_run

### Stop the project (stop the containers)

> just_stop

### Make database migrations

> just_migrate

#### NOTE: if your migration fails, then your server container will silently stop working. Fix this with:
> just_stop; just_run;

## Visit the development site
- Go to http://127.0.0.1:3000/

## VSCODE DEVELOPMENT NOTES

- Install the following extensions:
  - ms-azuretools.vscode-docker
  - ms-vscode-remote.remote-containers
- Relaunch vscode after installing it and vscode will notice you have a .devcontainer and ask you if you want to reopen in a container. Do so.
  - If the prompt doesnt come up. Then use <ctrl>+<shift>+p Remote-Containers: Reopen in Container
- Depending on if you are working on the frontend or backend, you will have to make changes to the .devcontainer content
  - .devcontainer/compose-dev.yml
    - Under services, specify the container name you want to develop in. For backend, use backend, for frontend, use frontend. This will override that containers creation process to allow you to develop and debug processes related to the frontend or backend depending on your choice.
  - .devcontainer/devcontainer.json
    - A similar change needs to be made here depending on if you want to work on the frontend or backend. the service needs to reflect the container you wish to work on.
      - Ex: you want to work on frontend so: "service": "frontend"

