let numBravoCandidates = 2; // default to 2 candidates

document.getElementById('add-candidate').addEventListener('click', () => {
    numBravoCandidates++;
    addCandidate();
});

document.getElementById('remove-candidate').addEventListener('click', () => {
    const candidates = document.querySelectorAll('#candidates-container .form-row');
    if (!candidates.length) return;

    numBravoCandidates--;
    removeCandidate();
});

document.getElementById('submit-bravo').addEventListener('click', () => {
    submitBravoAudit();
});

function addCandidate() {
    const newCandidate = document.createElement('div');
    newCandidate.className = 'form-row';
    // eslint-disable-next-line
    newCandidate.innerHTML = `\
    <div class="col-md-4 mb-3">\
        <label for="candidate${numBravoCandidates}">Candidate ${numBravoCandidates} name</label>\
        <input type="text" class="form-control" id="candidate${numBravoCandidates}" placeholder="Name">\
    </div>\
    <div class="col-md-3 mb-3">\
        <label for="candidate${numBravoCandidates}-votes">Candidate ${numBravoCandidates} votes</label>\
        <input type="number" class="form-control" id="candidate${numBravoCandidates}-votes" placeholder="0" min="0">\
    </div>`;
    document.getElementById('candidates-container').appendChild(newCandidate);
}

function removeCandidate() {
    const candidates = document.querySelectorAll('#candidates-container .form-row');
    const lastCandidate = candidates[candidates.length - 1];
    if (lastCandidate) {
        document.getElementById('candidates-container').removeChild(lastCandidate);
    }
}

function submitBravoAudit() {
    // Obtain data from form
    const candidateVoteNodes = document.querySelectorAll('#candidates-container input[type="number"]');
    const candidateVotes = [];

    // TODO: do some sort of validation to check if candidate name or votes are invalid. done on backend?
    for (const node of candidateVoteNodes) {
        candidateVotes.push(node.value);
    }

    const numBallotsCost = document.getElementById('total-ballots-cast').value;
    const numWinners = document.getElementById('num-winners').value;
    const riskLimit = document.getElementById('risk-limit').value;

    // Setup API call
    const API_ENDPOINT = `${API_ROOT}/perform_audit`
    const formData = new FormData();

    formData.append('audit-type', 'bravo');
    formData.append('candidate-votes', JSON.stringify(candidateVotes));
    formData.append('num-ballots-cast', numBallotsCost);
    formData.append('num-winners', numWinners);
    formData.append('risk-limit', riskLimit);

    // Make API call
    axios.post(API_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then((response) => {
            // // Create WebSocket connection.
            // const socket = new WebSocket('ws://127.0.0.1:8080');

            // // Connection opened
            // socket.addEventListener('open', function (event) {
            //     socket.send('Hello Server!');
            // });

            // socket.addEventListener('open', function (event) {
            //     console.log("ERROR!");
            // });

            // socket.addEventListener('close', function (event) {
            //     console.log('Closing!');
            // });

            // // Listen for messages
            // socket.addEventListener('message', function (event) {
            //     console.log('Message from server ', event.data);
            // });

            return console.log(response);
        })
        .catch((error) => {
            return console.error(error);
        });
}

// Check status every 5 seconds
setInterval(() => {
    const API_ENDPOINT = `${API_ROOT}/check_status`
    axios.get(API_ENDPOINT)
        .then((response) => {
            return console.log(response);
        })
        .catch((error) => {
            return console.error(error);
        });
}, 5000);

// =========================
// FOR TESTING PURPOSES ONLY

document.onload = fillTestData();

function fillTestData() {
    console.log('Loading test data onload!');

    const testNumBallotsCast = 100;
    const testNumWinners = 1;

    const candidateName1 = 'John Doe';
    const candidateVote1 = 80;

    const candidateName2 = 'Howard Kane';
    const candidateVote2 = 20;

    const testRiskLimit = 5;

    document.getElementById('total-ballots-cast').value = testNumBallotsCast;
    document.getElementById('num-winners').value = testNumWinners;

    document.getElementById('candidate1').value = candidateName1;
    document.getElementById('candidate1-votes').value = candidateVote1;

    document.getElementById('candidate2').value = candidateName2;
    document.getElementById('candidate2-votes').value = candidateVote2;

    document.getElementById('risk-limit').value = testRiskLimit;
}

// FOR TESTING PURPOSES ONLY
// =========================