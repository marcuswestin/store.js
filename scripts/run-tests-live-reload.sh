set -e
cd $(cd `dirname ${BASH_SOURCE[0]}` && pwd -P)
export PATH=../node_modules/.bin:$PATH

budo ../tests/browser-test-runner.js --live --open --title "store.js browser tests" -- -d
