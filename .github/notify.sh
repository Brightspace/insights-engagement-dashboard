#!bin/bash
curl -X POST -H 'Content-type: application/json' --data '{"text":"Translation PR Created"}' ${WEBHOOK}
