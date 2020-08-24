#!/bin/bash

if [ "${BASH_SOURCE[0]}" -ef "$0" ]
then
    echo "Usage: source $(basename $0)"
    exit 1
fi

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm install v12.13.1 &&
nvm use &&
npm install &&
npm run start-services
