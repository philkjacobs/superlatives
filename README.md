1. Make sure you have python 2.7 installed: `python --version`
2. Install the python dependencies: `pip install -r requirements.txt`
3. Install node (and npm) - todo(philip): instructions
4. Install webpack globally: npm install -g webpack
5. Install npm project packages locally: npm install
6. Generate a static bundle: npm run build 
7. Run the webserver: `./setup.py
8. Go to localhost:5000 to the landing page.
9. Go to localhost:5000/qwerty to see the custom 404.

### To Setup the DB
pre 1. make sure you have homebrew
1. Update your brew library + install postgres binaries: brew update && brew install postgres
2. initialize your postgres data folder: initdb /usr/local/var/postgres
3. Start your local server (open a new tab to do this since it'll run
   foreground): postgres -D /usr/local/var/postgres
4. In a different tab from the server, create your database: createdb supers
5. Open your postgres shell: psql supers
6. Freak out and realize you can't quit.
7. type \q and hit enter to quit the psql shell

