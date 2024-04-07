export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

execute_command() {
    eval "$1"
    if [ $? -eq 0 ]; then
        echo -e "\e[94m$1 success!\e[0m"
    else
        echo -e "\e[91mError: $1\e[0m"
}

execute_command "nvm install v20.11.1"
execute_command "sudo apt install npm"
echo -e "\e[92mRun dependencies.sh\e[0m"
